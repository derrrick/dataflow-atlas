# Vercel Deployment Guide

## Quick Deploy to Vercel

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Deploy from GitHub

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository: `derrrick/dataflow-atlas`
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables, add:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://ptgfpwtdarfznvliqgkb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# API Keys (Required for data ingestion)
NASA_FIRMS_API_KEY=a7e88f9ca49555749b2bf8ef1052fae7
AIRNOW_API_KEY=531A153F-E605-4DFF-B03E-1510613868E6

# Cron Security (Generate a random string)
CRON_SECRET=your_random_secret_here

# Public URL (Auto-set by Vercel, but you can override)
NEXT_PUBLIC_URL=https://your-app.vercel.app
```

**Generate CRON_SECRET:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use any random string generator
```

### Step 4: Deploy

Click **"Deploy"** and wait ~2 minutes.

Your app will be live at: `https://your-app-name.vercel.app`

---

## 🔄 Automatic Data Ingestion

Once deployed, Vercel Cron will automatically run **every 5 minutes**:

**Schedule:** `*/5 * * * *` (every 5 minutes)
**Endpoint:** `/api/cron/ingest`
**Actions:**
- Fetches latest earthquakes from USGS
- Fetches air quality from AirNow
- Fetches wildfires from NASA FIRMS
- Stores all data in Supabase

### Monitor Cron Jobs

1. Go to Vercel Dashboard → Your Project
2. Click **"Deployments"** → Latest deployment
3. Click **"Functions"** tab
4. Find `/api/cron/ingest` function
5. View logs to see execution history

---

## 🧪 Test Cron Locally

You can test the cron endpoint locally:

```bash
# Generate a CRON_SECRET
echo "CRON_SECRET=$(openssl rand -base64 32)" >> .env.local

# Restart dev server
npm run dev

# Test the endpoint (replace YOUR_SECRET with the one from .env.local)
curl -H "Authorization: Bearer YOUR_SECRET" http://localhost:3000/api/cron/ingest
```

Expected response:
```json
{
  "success": true,
  "duration": 2543,
  "timestamp": "2025-10-26T00:00:00.000Z",
  "results": {
    "earthquakes": { "status": "success", "count": 151, "message": "..." },
    "airQuality": { "status": "success", "count": 1, "message": "..." },
    "wildfires": { "status": "success", "count": 0, "message": "..." }
  }
}
```

---

## 🔒 Security

The cron endpoint is protected by:

1. **Authorization Header:** Only requests with correct `Bearer {CRON_SECRET}` can execute
2. **Vercel Cron:** Vercel automatically includes this header when triggering scheduled jobs
3. **Environment Variable:** `CRON_SECRET` is only accessible server-side

**Never commit CRON_SECRET to git!** It's already in `.gitignore` as part of `.env*.local`.

---

## 📊 Monitoring

### Check Execution Logs

**In Vercel Dashboard:**
1. Go to your project
2. Click "Functions" or "Logs"
3. Filter by `/api/cron/ingest`
4. See execution times, success/failure, counts

**Example log output:**
```
✅ Scheduled ingestion complete in 2543ms:
   - Earthquakes: 151 events (success)
   - Air Quality: 1 observations (success)
   - Wildfires: 0 detections (success)
```

### Check Database

Visit your Supabase dashboard to see new events arriving every 5 minutes.

---

## 🎯 Customizing the Schedule

Edit `vercel.json` to change frequency:

```json
{
  "crons": [
    {
      "path": "/api/cron/ingest",
      "schedule": "0 * * * *"      // Every hour
      // "schedule": "*/15 * * * *" // Every 15 minutes
      // "schedule": "0 */6 * * *"  // Every 6 hours
      // "schedule": "0 0 * * *"    // Daily at midnight
    }
  ]
}
```

**Cron syntax:** `minute hour day month dayOfWeek`
- `*/5 * * * *` = Every 5 minutes
- `0 * * * *` = Every hour at minute 0
- `0 0 * * *` = Daily at midnight

---

## 🚨 Troubleshooting

### Cron not running?

1. **Check Vercel plan:** Cron jobs are available on Hobby (free) and Pro plans
2. **Check logs:** Vercel Dashboard → Functions → Look for errors
3. **Verify CRON_SECRET:** Make sure it matches in environment variables
4. **Check deployment:** Cron only runs on production deployments, not previews

### API calls failing?

1. **Check environment variables:** Ensure all API keys are set
2. **Check Supabase:** Verify SUPABASE_SERVICE_ROLE_KEY is correct
3. **Check API rate limits:** NASA FIRMS and AirNow have rate limits
4. **Test endpoints manually:** Visit `/api/ingest/earthquakes` directly

### Data not updating?

1. **Check Supabase RLS policies:** Service role should bypass RLS
2. **Check database size:** Free tier has 500 MB limit
3. **Check cron logs:** Verify jobs are completing successfully
4. **Manual test:** Run `curl https://your-app.vercel.app/api/cron/ingest`

---

## 📈 Scaling

**Current setup handles:**
- ✅ ~150 earthquakes/day
- ✅ ~10-50 air quality stations
- ✅ ~100-500 wildfire detections/day
- ✅ Total: ~300-700 events/day

**Free tier supports:**
- Supabase: 500 MB database (you'll use <1% monthly)
- Vercel: 100 GB bandwidth/month (more than enough)
- Vercel Cron: Unlimited executions on free tier

**You won't hit limits for months!**

---

## Next Steps

1. Deploy to Vercel
2. Add environment variables
3. Wait 5 minutes
4. Check Supabase to see new data appearing
5. Monitor the cron logs

Your data will stay fresh automatically! 🎉
