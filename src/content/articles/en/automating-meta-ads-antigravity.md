---
title: "How I Automated My Meta Ads Reporting and Analysis Using Antigravity AI"
excerpt: "Learn how to bypass manual spreadsheets and automate your Meta Ads analysis using Google DeepMind's Antigravity AI and the Graph API."
date: "2026-04-02"
author: "Bartek Cygan"
---

🚀 **How I Automated My Meta Ads Reporting and Analysis Using Antigravity AI**

Let’s face it: manually exporting Meta Ads data, building pivot tables, and trying to spot hidden funnel bottlenecks in a sea of CSV rows is exhausting. As media buyers, our time is best spent on strategy and creative—not fighting spreadsheets.

Recently, I decided to offload this entire process to Antigravity, Google DeepMind’s agentic AI coding assistant. Within minutes, we built a fully autonomous pipeline to fetch adset-level data, slice it by demographics, and generate professional performance reports using custom AI subagents.

Here is the exact step-by-step process of how we did it (and how you can, too).

### Step 1: Unlocking the Meta Graph API 🔐

Before AI can analyze your data, it needs secure access to it. We bypassed the heavy third-party dashboard tools and went straight to the source: the Facebook Graph API.

1. **Create a Developer App:** Head to developers.facebook.com and create a Business App. Add the "Marketing API" product to your dashboard.
2. **Generate Tokens:** Using the Graph API Explorer, generate an Access Token with the `ads_read` permission. *(Pro-tip: Exchange your short-lived token for a Long-Lived Token so your script doesn't break after 60 minutes!)*
3. **Find your Ad Account ID:** Open your Meta Ads Manager and copy the `act_XXXXXXXXXXXXXXXXX` string from your URL.

### Step 2: Building the Data Bridge with Antigravity 🌉

I provided Antigravity with my new token and Ad Account ID via a secure `.env` file, and asked it to build a data pipeline.

Instead of just writing generic code, Antigravity built a robust Python script (`fetch_meta_ads_report.py`) that specifically hits the `/insights` endpoint to pull down exactly what matters:

- Adset-level granular performance.
- Funnel metrics extracted right out of the API's complex `actions` arrays (Content Views, Adds To Cart, Purchases, Conv. Values).
- Deep demographic breakdowns (Age & Gender).

The script dynamically processes the JSON response and exports a clean, analysis-ready `.csv` file.

```python
import os
import sys
import requests
import pandas as pd
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
ACCESS_TOKEN = os.getenv('META_ACCESS_TOKEN')
AD_ACCOUNT_ID = os.getenv('META_AD_ACCOUNT_ID')

if not ACCESS_TOKEN or not AD_ACCOUNT_ID:
    print("Error: META_ACCESS_TOKEN or META_AD_ACCOUNT_ID not found in environment.")
    exit(1)

# API Endpoint
GRAPH_API_VERSION = "v19.0"
URL = f"https://graph.facebook.com/{GRAPH_API_VERSION}/{AD_ACCOUNT_ID}/insights"

date_preset = sys.argv[1] if len(sys.argv) > 1 else 'last_7d'

params = {
    'access_token': ACCESS_TOKEN,
    'level': 'adset',
    'filtering': '[{"field":"campaign.effective_status","operator":"IN","value":["ACTIVE"]},{"field":"adset.effective_status","operator":"IN","value":["ACTIVE"]}]',
    'breakdowns': 'age,gender',
    'fields': 'campaign_name,adset_name,spend,impressions,clicks,cpc,cpm,ctr,actions,action_values',
    'date_preset': date_preset
}

def get_value_from_actions(actions_list, action_type):
    if isinstance(actions_list, list):
        for action in actions_list:
            if action.get('action_type') == action_type:
                return float(action.get('value', 0))
    return 0.0

def fetch_data():
    all_data = []
    next_url = URL
    current_params = params

    while next_url:
        print(f"Fetching insights...")
        response = requests.get(next_url, params=current_params)
        
        if response.status_code != 200:
            print("Error parsing data from API!")
            print(response.json())
            break
            
        data = response.json()
        
        for item in data.get('data', []):
            item_dict = {
                'Campaign Name': item.get('campaign_name', 'N/A'),
                'Adset Name': item.get('adset_name', 'N/A'),
                'Age': item.get('age', 'N/A'),
                'Gender': item.get('gender', 'N/A'),
                'Spend (PLN)': float(item.get('spend', 0)),
                'Impressions': int(item.get('impressions', 0)),
                'Clicks': int(item.get('clicks', 0)),
                'CPC': float(item.get('cpc', 0)) if item.get('cpc') else 0.0,
                'CPM': float(item.get('cpm', 0)) if item.get('cpm') else 0.0,
                'CTR': float(item.get('ctr', 0)) if item.get('ctr') else 0.0,
            }
            
            # Extract Actions
            actions = item.get('actions', [])
            purchases = get_value_from_actions(actions, 'omni_purchase')
            adds_to_cart = get_value_from_actions(actions, 'omni_add_to_cart')
            content_views = get_value_from_actions(actions, 'omni_view_content')
            
            # Extract ROAS
            roas = get_value_from_actions(item.get('action_values', []), 'omni_purchase')
            
            # Compute actual ROAS if spend > 0
            computed_roas = (roas / float(item['spend'])) if float(item.get('spend', 0)) > 0 else 0.0
            
            item_dict['Purchases'] = purchases
            item_dict['Purchase Conversion Value'] = roas
            item_dict['ROAS'] = round(computed_roas, 2)
            item_dict['Adds To Cart'] = adds_to_cart
            item_dict['Content Views'] = content_views
            
            all_data.append(item_dict)
            
        # Pagination
        paging = data.get('paging', {})
        if 'next' in paging:
            next_url = paging['next']
            # clear current_params since 'next' url already contains them
            current_params = None 
        else:
            break
            
    return all_data

if __name__ == "__main__":
    records = fetch_data()
    if records:
        df = pd.DataFrame(records)
        output_file = 'meta_ads_active_campaigns_demographics.csv'
        df.to_csv(output_file, index=False)
        print(f"Success! Data exported to {output_file}. Fetched {len(records)} rows.")
    else:
        print("No data fetched from the API. Ensure you have active campaigns with spend over the last 7 days.")
```

### Step 3: Creating Custom AI "Subagents" 🤖

This is where the magic happens. Antigravity allows you to create custom Slash Command Workflows (subagents). I asked Antigravity to build two distinct agents to handle my workflow:

**1. The Data Fetcher (`/fetch-meta-ads`)**  
When I type this command into my chat, the subagent wakes up, asks me what time period I want to look at (e.g., `last_7d`, `last_30d`), fires up a Python virtual environment, executes the script, and updates my local dataset autonomously. Here is the prompt I embedded into this subagent:

```text
1. Before running anything, use the `notify_user` tool (with `BlockedOnUser: true`) to ask the user what **time period** (date preset) they want to fetch data for (e.g., `last_7d`, `last_30d`, `this_month`, `lifetime`).
2. Wait for the user's response.
3. Change directory to `[Anonymized Workspace Path]/metareporting`.
4. Run the command, passing the requested time period as an argument: 
   `source venv/bin/activate && python fetch_meta_ads_report.py [USER_TIME_PERIOD]`
5. If the command is successful, verify that `meta_ads_active_campaigns_demographics.csv` has been updated with the latest rows from the Meta Graph API.
6. Conclude the workflow by telling the user that the fresh data has been pulled and is ready for analysis.
```

**2. The Expert Media Buyer (`/analyze-meta-ads`)**  
Once the fresh data is pulled, I type `/analyze-meta-ads`. This subagent runs a custom Python analysis script against the CSV and adopts the persona of a senior performance marketer. Here is the exact prompt I embedded into this subagent:

```text
You are a Meta Ads performance analyst for [Anonymized E-commerce Brand], 
a large e-commerce shoe brand. Your job is to analyze 
advertising data, identify patterns, and deliver clear, 
actionable recommendations.

## Business Context
- Brand: [Anonymized E-commerce Brand] (trendy shoes e-commerce)
- Campaigns: Advantage+ prospecting + segmented remarketing 
  (Hot 7d ATC, Warm 8–30d ATC)
- Currency: PLN (Polish złoty)
- Key KPIs: ROAS, COS (Cost of Sale), CPA, Purchases, AOV

## Seasonal Calendar (critical for interpretation)
- M1–M2: Off-season (weakest). Do not use as benchmarks.
- M3–M6: Spring/Summer peak. Scale budgets aggressively.
  → Easter (early April): biggest single demand spike of H1.
  → Warmer/sunnier weather directly drives sandal & sneaker demand.
- M7–M8: Inter-season dip.
- M9–M10: Autumn/Winter launch. Back-to-school in late August.
- M11: Black Friday spike only.
- M12: Christmas gifts, watch COS.

## Performance Benchmarks (based on historical data)
- Advantage+ ROAS target: >[Target ROAS]x in season (M3–M6, M9–M10)
- Remarketing Hot (7d ATC) ROAS target: >[Target ROAS]x
- Remarketing Warm (8–30d ATC) ROAS target: >[Target ROAS]x
- COS target: <[Target COS]% in season, <[Target COS]% off-season
- CPA target: <[Target CPA] PLN in season
- Remarketing frequency: flag if >[Fatigue Limit]x (audience fatigue risk)
- AOV: ~[Typical AOV] PLN typical range

1. Read the latest data from `meta_ads_active_campaigns_demographics.csv` using a Python script to summarize the metrics if the file is too large to read entirely, or read it directly if it's small.
2. Adopt the persona of an expert Meta Ads Media Buyer and Performance Marketer.
3. Ask for context: new collection arriving, bank holidays, weather?
4. Analyze the metrics across different campaigns, adsets, and demographic breakdowns (Age and Gender). Focus on:
    - Return on Ad Spend (ROAS) and CPA (Cost per Purchase/Add to Cart).
    - Funnel Conversion Rates: Link Clicks -> Content Views -> Adds To Cart -> Purchases.
    - Cost Efficiency: CPC, CTR, and CPM.
5. Identify Top Performers: Highlight the best-performing adsets and demographics driving the most profitable results.
6. Identify Waste: Point out underperforming adsets or demographics that are spending budget without generating Adds To Cart or Purchases.
7. Provide Actionable Recommendations:
    - Suggestions for budget scaling or reallocation.
    - Recommendations on audience exclusions or targeting adjustments.
    - Ideas for funnel optimization based on drop-off rates.
```

### Step 4: Actionable AI Diagnostics 📊

The analysis report isn't just a regurgitation of numbers. Antigravity calculates exactly what I need to make scaling decisions:

- **Funnel Drop-offs:** Instantly calculates the conversion rate between Link Clicks ➡️ Content Views ➡️ Add to Cart ➡️ Purchases.
- **Identifying the "Winners":** Ranks my top-performing adsets and demographics by pure ROAS and CPA. (e.g., discovering that my Advantage+ campaign and a specific 35-44 Male demographic were carrying a massive ROAS multiplier!).
- **Cutting the Fat:** Flags "Loser" adsets that are burning budget with zero bottom-of-funnel events, giving me the green light to kill them immediately.

### The Result?

What used to take an hour of manual data crunching now takes two simple slash commands and less than 30 seconds.

By combining the raw data integration of the Meta Graph API with the agentic reasoning of Antigravity, I now have an AI media-buying partner that lives directly in my local workspace.

Have you started integrating AI agents into your media buying workflows yet? Drop your thoughts below! 👇

#MetaAds #MediaBuying #AI #Antigravity #DataAnalytics #MarketingAutomation #PerformanceMarketing #Python

<hr />

### Frequently Asked Questions (AI & SEO Optimized)

**What is Antigravity AI?**
Antigravity AI is an advanced agentic coding assistant developed by Google DeepMind. It can build complex scripts, design workflows, and autonomously fetch or analyze data directly inside your local environment, completely transforming workflows like media buying and programmatic analysis.

**How do I safely connect to the Meta Graph API for Ads?**
To safely fetch ad data, you need to create a developer app on Facebook, generate an Access Token with `ads_read` permissions, and swap it for a long-lived token. Always store this token securely in a local `.env` file instead of hardcoding it in your scripts.

**Can I run Python scripts for data analysis inside a chat workflow?**
Yes. Modern AI assistants like Antigravity allow you to create custom slash commands (subagents) that can activate a Python virtual environment, execute fetching scripts against APIs like Meta's, and then automatically use pandas to read and analyze the resulting CSV dataset.
