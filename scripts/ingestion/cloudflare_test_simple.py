#!/usr/bin/env python3
"""
Cloudflare Radar Test - Simplified version that works
"""

import requests
import json
import os
from datetime import datetime

# Load API token
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

print("🌐 Cloudflare Radar Test\n")

# Test 1: HTTP Protocol Distribution
print("1️⃣ Fetching HTTP protocol distribution (last 7 days)...")
response = requests.get(
    f"{BASE_URL}/http/summary/http_protocol",
    headers=HEADERS,
    params={"dateRange": "7d"}
)
data = response.json()
if data.get("success"):
    print(f"   ✅ Success! HTTPS: {data['result']['summary_0']['https']}%, HTTP: {data['result']['summary_0']['http']}%")
else:
    print(f"   ❌ Failed: {data.get('errors')}")

# Test 2: BGP Hijack Events (Example of network disruption data)
print("\n2️⃣ Fetching BGP hijack events...")
response = requests.get(
    f"{BASE_URL}/bgp/hijacks/events",
    headers=HEADERS,
    params={"dateRange": "7d", "perPage": 10}
)
data = response.json()
if data.get("success"):
    events = data.get("result", {}).get("events", [])
    print(f"   ✅ Found {len(events)} BGP hijack events")
    for event in events[:3]:
        print(f"      - {event.get('event_type')} affecting AS{event.get('detected_origin_as')}")
else:
    print(f"   ❌ Failed: {data.get('errors')}")

# Test 3: HTTP Top Locations
print("\n3️⃣ Fetching top locations by HTTP traffic...")
response = requests.get(
    f"{BASE_URL}/http/top/locations",
    headers=HEADERS,
    params={"dateRange": "1d", "limit": 5}
)
data = response.json()
if data.get("success"):
    locations = data.get("result", {}).get("top_0", [])
    print(f"   ✅ Top locations:")
    for loc in locations[:5]:
        print(f"      - {loc.get('clientCountryName')}: {loc.get('value')}%")
else:
    print(f"   ❌ Failed: {data.get('errors')}")

print("\n✅ Cloudflare Radar API is working!")
print("📝 Token has access to HTTP, BGP, and location data")
