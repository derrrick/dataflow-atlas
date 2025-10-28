#!/usr/bin/env python3
"""
Explore Cloudflare Radar endpoints for map visualization
"""

import requests
import json
import os

def load_env():
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
BASE_URL = "https://api.cloudflare.com/client/v4/radar"
HEADERS = {
    "Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}",
    "Content-Type": "application/json"
}

def test_endpoint(name, url, params):
    print(f"\n{'='*60}")
    print(f"🔍 {name}")
    print(f"{'='*60}")
    response = requests.get(url, headers=HEADERS, params=params)
    data = response.json()
    
    if data.get("success"):
        print(f"✅ Success!")
        print(json.dumps(data, indent=2)[:1500])  # First 1500 chars
    else:
        print(f"❌ Failed: {data.get('errors')}")

# Test 1: BGP Hijacks (detailed)
test_endpoint(
    "BGP Hijack Events (Network Disruptions)",
    f"{BASE_URL}/bgp/hijacks/events",
    {"dateRange": "7d", "perPage": 5}
)

# Test 2: DDoS Attacks by Location
test_endpoint(
    "DDoS Attack Activity",
    f"{BASE_URL}/attacks/layer3/top/attacks",
    {"dateRange": "7d", "limit": 10}
)

# Test 3: Internet Quality by Location
test_endpoint(
    "Internet Quality by Location",
    f"{BASE_URL}/quality/speed/top/locations",
    {"dateRange": "7d", "limit": 10}
)

# Test 4: Outages
test_endpoint(
    "Internet Outages",
    f"{BASE_URL}/annotations/outages",
    {"dateRange": "7d", "limit": 10}
)

# Test 5: Top ASNs (for mapping ISP disruptions)
test_endpoint(
    "Top Autonomous Systems",
    f"{BASE_URL}/http/top/ases",
    {"dateRange": "1d", "limit": 10}
)

print("\n" + "="*60)
print("✅ Exploration Complete!")
print("="*60)
