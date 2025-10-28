#!/usr/bin/env python3
"""
Cloudflare Radar - Internet Outages Ingestion
Fetches real-time internet outage events and posts to Next.js API
"""

import requests
import json
import os
from datetime import datetime
from typing import List, Dict, Any

# Country code to coordinates mapping (centroids)
COUNTRY_COORDS = {
    'US': [37.0902, -95.7129], 'CN': [35.8617, 104.1954], 'IN': [20.5937, 78.9629],
    'BR': [-14.2350, -51.9253], 'RU': [61.5240, 105.3188], 'JP': [36.2048, 138.2529],
    'DE': [51.1657, 10.4515], 'GB': [55.3781, -3.4360], 'FR': [46.2276, 2.2137],
    'IT': [41.8719, 12.5674], 'CA': [56.1304, -106.3468], 'AU': [-25.2744, 133.7751],
    'MX': [23.6345, -102.5528], 'ES': [40.4637, -3.7492], 'KR': [35.9078, 127.7669],
    'ID': [-0.7893, 113.9213], 'SA': [23.8859, 45.0792], 'TR': [38.9637, 35.2433],
    'AR': [-38.4161, -63.6167], 'PL': [51.9194, 19.1451], 'TH': [15.8700, 100.9925],
    'EG': [26.8206, 30.8025], 'PK': [30.3753, 69.3451], 'NG': [9.0820, 8.6753],
    'BD': [23.6850, 90.3563], 'VN': [14.0583, 108.2772], 'PH': [12.8797, 121.7740],
    'MY': [4.2105, 101.9758], 'ZA': [-30.5595, 22.9375], 'CO': [4.5709, -74.2973],
    'KE': [-0.0236, 37.9062], 'UA': [48.3794, 31.1656], 'DZ': [28.0339, 1.6596],
    'MA': [31.7917, -7.0926], 'PE': [-9.1900, -75.0152], 'VE': [6.4238, -66.5897],
    'CL': [-35.6751, -71.5430], 'RO': [45.9432, 24.9668], 'NL': [52.1326, 5.2913],
    'BE': [50.5039, 4.4699], 'GR': [39.0742, 21.8243], 'PT': [39.3999, -8.2245],
    'CZ': [49.8175, 15.4730], 'HU': [47.1625, 19.5033], 'SE': [60.1282, 18.6435],
    'AT': [47.5162, 14.5501], 'CH': [46.8182, 8.2275], 'IL': [31.0461, 34.8516],
    'HK': [22.3193, 114.1694], 'SG': [1.3521, 103.8198], 'NZ': [-40.9006, 174.8860],
    'IE': [53.4129, -8.2439], 'DK': [56.2639, 9.5018], 'FI': [61.9241, 25.7482],
    'NO': [60.4720, 8.4689], 'AE': [23.4241, 53.8478], 'QA': [25.3548, 51.1839],
    'KW': [29.3117, 47.4818], 'CM': [7.3697, 12.3547], 'GH': [7.9465, -1.0232],
    'TZ': [-6.3690, 34.8888], 'UG': [1.3733, 32.2903], 'ZW': [-19.0154, 29.1549],
    'MM': [21.9162, 95.9560], 'NP': [28.3949, 84.1240], 'LK': [7.8731, 80.7718],
    'KH': [12.5657, 104.9910], 'LA': [19.8563, 102.4955], 'MN': [46.8625, 103.8467],
    'KZ': [48.0196, 66.9237], 'UZ': [41.3775, 64.5853], 'BY': [53.7098, 27.9534],
}

def load_env():
    """Load environment variables from .env.local"""
    env_path = os.path.join(os.path.dirname(__file__), '../../.env.local')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key] = value

load_env()

CLOUDFLARE_API_TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN")
if not CLOUDFLARE_API_TOKEN:
    raise ValueError("CLOUDFLARE_API_TOKEN not found in .env.local")

BASE_URL = "https://api.cloudflare.com/client/v4/radar"
HEADERS = {
    "Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}",
    "Content-Type": "application/json"
}

def fetch_outages(days_back: int = 7) -> List[Dict[str, Any]]:
    """
    Fetch internet outage events from Cloudflare Radar

    Args:
        days_back: Number of days to look back (7, 14, 30)
    """

    url = f"{BASE_URL}/annotations/outages"
    params = {
        "dateRange": f"{days_back}d",
        "limit": 100,
        "format": "json"
    }

    print(f"🌐 Fetching internet outages (last {days_back} days)...")
    response = requests.get(url, headers=HEADERS, params=params, timeout=30)
    response.raise_for_status()
    data = response.json()

    if not data.get("success"):
        raise Exception(f"API Error: {data.get('errors')}")

    outages = []
    annotations = data.get("result", {}).get("annotations", [])

    print(f"   Found {len(annotations)} outage events")

    for event in annotations:
        # Get primary location (first country code)
        locations = event.get("locations", [])
        if not locations:
            continue

        country_code = locations[0]
        coords = COUNTRY_COORDS.get(country_code, [0, 0])

        # Get outage metadata
        outage_info = event.get("outage", {})
        outage_cause = outage_info.get("outageCause", "UNKNOWN")
        outage_type = outage_info.get("outageType", "UNKNOWN")

        # Get affected ISPs
        asns_details = event.get("asnsDetails", [])
        isp_names = [asn.get("name", f"AS{asn.get('asn')}") for asn in asns_details[:5]]

        # Build location description
        location_names = [loc.get("name") for loc in event.get("locationsDetails", [])]
        location_str = ", ".join(location_names) if location_names else country_code

        outage = {
            "source": "cloudflare_radar",
            "data_type": "internet_outage",
            "timestamp": event.get("startDate"),
            "location": {
                "lat": coords[0],
                "lon": coords[1]
            },
            "metadata": {
                "event_id": event.get("id"),
                "description": event.get("description", "Internet outage detected"),
                "cause": outage_cause,
                "type": outage_type,
                "country_code": country_code,
                "location": location_str,
                "isps": isp_names,
                "asns": event.get("asns", []),
                "start_date": event.get("startDate"),
                "end_date": event.get("endDate"),
                "linked_url": event.get("linkedUrl"),
                "data_source": event.get("dataSource", "ALL")
            }
        }
        outages.append(outage)

    return outages

def post_to_api(outages: List[Dict], api_url: str = "http://localhost:3000/api/ingest/internet-outages"):
    """
    Post outages to Next.js API endpoint

    Args:
        outages: List of outage events
        api_url: API endpoint URL
    """

    print(f"\n📤 Posting {len(outages)} outages to API...")

    try:
        response = requests.post(
            api_url,
            json={"events": outages},
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        response.raise_for_status()
        result = response.json()

        print(f"✅ API Response: {result.get('message', 'Success')}")
        if result.get('inserted'):
            print(f"   Inserted: {result['inserted']} events")
        if result.get('skipped'):
            print(f"   Skipped: {result['skipped']} duplicates")

        return result

    except requests.exceptions.ConnectionError:
        print("⚠️  Could not connect to API. Is the dev server running?")
        print("   Saving to file instead...")
        save_to_file(outages)
        return None
    except Exception as e:
        print(f"❌ Error posting to API: {e}")
        save_to_file(outages)
        return None

def save_to_file(outages: List[Dict]):
    """Save outages to JSON file as backup"""
    output_dir = os.path.join(os.path.dirname(__file__), '../../data/ingestion')
    os.makedirs(output_dir, exist_ok=True)

    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    filename = os.path.join(output_dir, f"internet_outages_{timestamp}.json")

    with open(filename, 'w') as f:
        json.dump(outages, f, indent=2)

    print(f"💾 Saved to {filename}")

def main():
    """Main ingestion pipeline"""

    print("=" * 60)
    print("🌐 Cloudflare Radar - Internet Outages Ingestion")
    print("=" * 60)

    # Fetch outages
    outages = fetch_outages(days_back=30)

    if not outages:
        print("\n⚠️  No outages found")
        return

    print(f"\n📊 Sample outage:")
    print(json.dumps(outages[0], indent=2))

    # Post to API
    post_to_api(outages)

    print("\n" + "=" * 60)
    print("✅ Ingestion Complete!")
    print("=" * 60)

if __name__ == "__main__":
    main()
