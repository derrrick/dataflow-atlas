#!/usr/bin/env python3
"""
Cloudflare Radar Ingestion - Internet Outages & Performance
Endpoint: https://api.cloudflare.com/client/v4/radar/
Docs: https://developers.cloudflare.com/api/operations/radar-get-outages-locations
"""

import requests
import json
import os
from datetime import datetime, timedelta
from time import sleep
from typing import List, Dict, Any

# Load environment variables from .env.local
def load_env():
    """Load environment variables from .env.local file"""
    env_path = os.path.join(os.path.dirname(__file__), '../../.env.local')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key] = value

load_env()

# Configuration
CLOUDFLARE_API_TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN")
if not CLOUDFLARE_API_TOKEN:
    raise ValueError("CLOUDFLARE_API_TOKEN not found in .env.local")

BASE_URL = "https://api.cloudflare.com/client/v4/radar"
HEADERS = {
    "Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}",
    "Content-Type": "application/json"
}

def retry_request(url: str, params: Dict = None, max_retries: int = 5) -> Dict:
    """Make HTTP request with exponential backoff"""
    for attempt in range(max_retries):
        try:
            response = requests.get(url, headers=HEADERS, params=params, timeout=30)

            if response.status_code == 429:
                retry_after = int(response.headers.get('Retry-After', 60))
                print(f"Rate limited. Waiting {retry_after}s...")
                sleep(retry_after)
                continue

            response.raise_for_status()
            return response.json()

        except requests.exceptions.RequestException as e:
            wait_time = 2 ** attempt
            print(f"Attempt {attempt + 1} failed: {e}. Retrying in {wait_time}s...")
            if attempt < max_retries - 1:
                sleep(wait_time)
            else:
                raise

    raise Exception(f"Failed after {max_retries} attempts")

def fetch_internet_outages(hours_back: int = 24, location: str = None) -> List[Dict[str, Any]]:
    """
    Fetch internet outage events from Cloudflare Radar

    Args:
        hours_back: Hours of historical data to fetch
        location: ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB')
    """

    # Calculate time range
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(hours=hours_back)

    # Outages endpoint
    url = f"{BASE_URL}/annotations/outages/locations"
    params = {
        "dateStart": start_time.isoformat() + "Z",
        "dateEnd": end_time.isoformat() + "Z",
        "format": "json",
        "limit": 1000
    }

    if location:
        params["location"] = location

    print(f"Fetching outages from {start_time} to {end_time}...")
    data = retry_request(url, params)

    normalized = []

    if data.get("success") and data.get("result"):
        for outage in data["result"].get("annotations", []):
            event = {
                "source": "cloudflare_radar",
                "layer": "internet_outage",
                "timestamp": outage.get("startDate"),
                "location": {
                    "lat": None,  # Cloudflare doesn't provide coords, only ASN/location codes
                    "lon": None,
                    "geom": None,
                    "admin": {
                        "country": outage.get("location", {}).get("alpha2") if isinstance(outage.get("location"), dict) else None,
                        "asn": outage.get("asns", [])[0] if outage.get("asns") else None
                    }
                },
                "value": {
                    "outage_type": outage.get("outageType"),
                    "scope": outage.get("scope"),
                    "asn_count": len(outage.get("asns", []))
                },
                "metadata": {
                    "end_date": outage.get("endDate"),
                    "asns": outage.get("asns", []),
                    "description": outage.get("description"),
                    "linked_url": outage.get("linkedUrl"),
                    "outage_type": outage.get("outageType"),
                    "scope": outage.get("scope")
                }
            }
            normalized.append(event)

    print(f"✓ Fetched {len(normalized)} outage events")
    return normalized

def export_to_json(events: List[Dict], prefix: str = "cloudflare"):
    """Export events to JSON"""

    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")

    # Create output directory
    output_dir = os.path.join(os.path.dirname(__file__), '../../data/ingestion')
    os.makedirs(output_dir, exist_ok=True)

    # JSON export (for API ingestion)
    json_file = os.path.join(output_dir, f"{prefix}_events_{timestamp}.json")
    with open(json_file, 'w') as f:
        json.dump(events, f, indent=2)
    print(f"✓ Saved {len(events)} events to {json_file}")

    return json_file

def main():
    """Main ingestion pipeline"""

    print("🌐 Cloudflare Radar Ingestion Started")
    print(f"Using API token: {CLOUDFLARE_API_TOKEN[:10]}...")

    all_events = []

    # 1. Internet outages (global - last 24 hours)
    outages = fetch_internet_outages(hours_back=24)
    all_events.extend(outages)

    # Export
    if all_events:
        json_file = export_to_json(all_events, prefix="cloudflare_radar")
        print(f"\n✅ Total events: {len(all_events)}")
        print(f"📄 Output file: {json_file}")
    else:
        print("\n⚠️ No events fetched")

if __name__ == "__main__":
    main()
