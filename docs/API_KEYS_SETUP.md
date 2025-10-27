# API Keys Setup Guide

This document explains how to obtain free API keys for each data source.

---

## ✅ USGS Earthquakes

**Status:** No API key required
**Endpoint:** https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
**Rate Limit:** None (public GeoJSON feeds)

Already working! Test with:
```bash
curl "http://localhost:3000/api/ingest/earthquakes?timeframe=day&magnitude=all"
```

---

## 🔥 NASA FIRMS (Wildfires)

**Status:** Free API key required
**Sign up:** https://firms.modaps.eosdis.nasa.gov/api/area/
**Rate Limit:** Generous (designed for real-time use)

### Steps to get API key:

1. Visit https://firms.modaps.eosdis.nasa.gov/api/area/
2. Click "Request API Key"
3. Fill out the form:
   - Name
   - Email
   - Organization (can be "Personal Project")
   - Intended use (e.g., "Real-time wildfire visualization")
4. API key will be emailed instantly
5. Add to `.env.local`:
   ```bash
   NASA_FIRMS_API_KEY=your_key_here
   ```

### Test after setup:
```bash
curl "http://localhost:3000/api/ingest/wildfires?source=VIIRS_SNPP_NRT&days=1"
```

---

## 🌬️ AirNow (Air Quality)

**Status:** Free API key required
**Sign up:** https://docs.airnowapi.org/account/request/
**Rate Limit:** 500 requests/hour (plenty for hourly updates)

### Steps to get API key:

1. Visit https://docs.airnowapi.org/account/request/
2. Fill out the account request form:
   - Name
   - Email
   - Organization (can be "Individual")
   - How will you use the data? (e.g., "Real-time air quality dashboard")
3. Agree to terms of service
4. API key will be emailed within a few hours (usually instant)
5. Add to `.env.local`:
   ```bash
   AIRNOW_API_KEY=your_key_here
   ```

### Test after setup:
```bash
curl "http://localhost:3000/api/ingest/air-quality"
```

---

## 📡 IODA Internet Outages (Future)

**Status:** Future integration
**Source:** https://ioda.caida.org/
**Access:** Open API (no key required for basic use)

---

## 🌐 RIPE Atlas (Network Latency) (Future)

**Status:** Future integration
**Source:** https://atlas.ripe.net/
**Access:** Free account required for API access

---

## Environment Variables Summary

Your `.env.local` file should contain:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ptgfpwtdarfznvliqgkb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Data Source API Keys
NASA_FIRMS_API_KEY=                    # Get from https://firms.modaps.eosdis.nasa.gov/api/area/
AIRNOW_API_KEY=                        # Get from https://docs.airnowapi.org/account/request/

# Future API Keys
IODA_API_KEY=                          # Optional - IODA has open API
RIPE_ATLAS_API_KEY=                    # Future integration
CLOUDFLARE_RADAR_API_KEY=              # Future integration
```

---

## Testing Your Setup

Once you've added the API keys to `.env.local`:

1. **Restart your dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Test each endpoint:**
   ```bash
   # Earthquakes (should already work)
   curl "http://localhost:3000/api/ingest/earthquakes?timeframe=day&magnitude=all"

   # Wildfires (after adding NASA_FIRMS_API_KEY)
   curl "http://localhost:3000/api/ingest/wildfires?source=VIIRS_SNPP_NRT&days=1"

   # Air Quality (after adding AIRNOW_API_KEY)
   curl "http://localhost:3000/api/ingest/air-quality"
   ```

3. **Check the database:**
   Visit http://localhost:3000/test-db to see all ingested events

---

## Rate Limits & Best Practices

### USGS Earthquakes
- **Frequency:** Every 5 minutes
- **No rate limit:** GeoJSON feeds are designed for real-time consumption
- **Recommended:** Cache for 5 minutes between requests

### NASA FIRMS
- **Frequency:** Every 3 hours (data updates every 3-6 hours)
- **Rate limit:** Very generous, designed for near-real-time use
- **Recommended:** Fetch once every 3-6 hours

### AirNow
- **Frequency:** Every hour (data updates hourly)
- **Rate limit:** 500 requests/hour
- **Recommended:** Fetch once per hour, cache aggressively

---

## Troubleshooting

### "API key not configured" error
- Check that the key is in `.env.local`
- Restart your dev server after adding keys
- Verify the key variable name matches exactly (case-sensitive)

### "Rate limit exceeded" error
- Wait for the rate limit window to reset
- Implement caching (already built into Next.js with `revalidate`)
- Reduce fetch frequency

### "RLS policy violation" error
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- This key bypasses Row Level Security for server-side operations

---

## Next Steps

Once all API keys are configured:
1. Set up scheduled ingest jobs (cron or serverless functions)
2. Connect real data to charts on main page
3. Implement real-time subscriptions for live updates
4. Add remaining data sources (IODA, RIPE Atlas, etc.)
