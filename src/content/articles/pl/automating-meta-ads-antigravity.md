---
title: "Jak zautomatyzowałem raportowanie Meta Ads dzięki Antigravity AI"
excerpt: "Dowiedz się, jak porzucić ręczną pracę w arkuszach Excela i zautomatyzować analizę Meta Ads wykorzystując sztuczną inteligencję Antigravity AI od Google DeepMind"
date: "2026-04-02"
author: "Bartek Cygan"
---

🚀 **Jak zautomatyzowałem raportowanie i analizę Meta Ads dzięki Antigravity AI**

Podejdźmy do tego szczerze: ręczne eksportowanie danych z menedżera reklam, budowanie tabel przestawnych i próby wyłowienia „wąskich gardeł” w arkuszach CSV są wyczerpujące. Jako media buyerzy powinnismy poświęcać czas na strategię i kreacje, a nie walczyć z excelem.

Niedawno postanowiłem oddelegować ten proces prosto do Antigravity – mojego asystenta AI od Google DeepMind. W ciągu kilku minut stworzyliśmy w pełni autonomiczną architekturę, która sama pobiera dane do poziomu konkretnych adsetów (nawet z demografią) oraz generuje analityczne raporty przy użyciu sub-agentów AI.

Oto kompletny proces krok po kroku.

### Krok 1: Odblokowanie Meta Graph API 🔐

By sztuczna inteligencja mogła analizować Twoją kampanię, potrzebuje bezpiecznego dostępu do danych. Ominęliśmy ciężkie narzędzia analityczne i połączyliśmy się bezpośrednio ze źródłem: Facebook Graph API.

1. **Stwórz aplikację deweloperską:** Wejdź na developers.facebook.com. Dodaj produkt "Marketing API".
2. **Wygeneruj tokeny:** Użyj narzędzia Graph API Explorer, by uzyskać Access Token uprawniający do `ads_read`. *(Wskazówka: Wymień krótkotrwały token na długoterminowy - dzięki temu skrypt nie przestanie działać po godzinie!)*
3. **Złap swoje ID konta reklamowego:** Otwórz Meta Ads Manager i skopiuj krótki ciąg `act_XXXXXXXXXXXXXXXXX` z urla przeglądarki.

### Krok 2: Budowa mostu do gromadzenia danych w Antigravity 🌉

Następnie przekazałem Antigravity nowy token i ID jako zmienną środowiskową (w pliku `.env`) z prośbą o budowę pipeline'u danych.

Zamiast generycznego kodu, Antigravity napisało za mnie potężny skrypt linijka po linijce w języku Python (`fetch_meta_ads_report.py`), wysyłający request do punktu `/insights` i ściągający z API dokładne te metryki, z jakich korzystam:

- Wydajność reklam na poziomie poszczególnych Adsetów.
- Metryki lejkowe w wyciągnięte z dynamicznych tablic `actions` (Content Views, Adds To Cart, Purchases, Conv. Values).
- Bardzo precyzyjny rozkład demograficzny odbiorców (Age & Gender).

Skrypt przetwarza strukturę JSON bez problemów do czytelnego pliku .csv, gotowego na profesjonalną analizę.

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

### Krok 3: Tworzenie sub-agentów AI 🤖

Tu wydarzyła się prawdziwa magia. Antigravity AI potrafi wygenerować zdefiniowane Workflows. Powiedziałem asystentowi, żeby opracował 2 agentów do regularnego powtarzania całej trasy:

**1. Strażnik Danych (`/fetch-meta-ads`)**  
Kiedy wywołuję tę komendę w wierszu poleceń, sub-agent wybudza się, dopytuje mnie z jakich dni chcę poprać dane, otwiera wirtualne środowisko Pythona i zaciąga tabele uaktualniając bazy. Oto prompt wbudowany w to zadanie:

```text
1. Before running anything, use the `notify_user` tool (with `BlockedOnUser: true`) to ask the user what **time period** (date preset) they want to fetch data for (e.g., `last_7d`, `last_30d`, `this_month`, `lifetime`).
2. Wait for the user's response.
3. Change directory to `[Anonymized Workspace Path]/metareporting`.
4. Run the command, passing the requested time period as an argument: 
   `source venv/bin/activate && python fetch_meta_ads_report.py [USER_TIME_PERIOD]`
5. If the command is successful, verify that `meta_ads_active_campaigns_demographics.csv` has been updated with the latest rows from the Meta Graph API.
6. Conclude the workflow by telling the user that the fresh data has been pulled and is ready for analysis.
```

**2. Mistrz Wydajności - Media Buyer (`/analyze-meta-ads`)**  
Mając świeży zbiór informacji, wystarczy że zatypuję `/analyze-meta-ads`. Subagent analizuje mój plik CSV wchodząc w buty wykwalifikowanego specjalisty performance marketingu. Oto promt wbudowany w jego działanie:

```text
You are a Meta Ads performance analyst for [Anonymized E-commerce Brand], 
a large e-commerce shoe brand. Your job is to analyze 
advertising data, identify patterns, and deliver clear, 
actionable recommendations in Polish.

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

### Krok 4: Skalowalne porady 📊

Raport z analizy to nareszcie nie jest już tylko pusty ciąg trudnych do oceny cyfr. Algorytm wylicza teraz to, czego dokładnie potrzebuję by podejmować natychmiastowe zmiany budżetu:

- **Drop-offy w lejku:** Wyliczenie Conversion Rate's od Link Click ➡️ Content Views ➡️ Add to Cart ➡️ Purchases.
- **Topowe "Winnery":** Antigravity flaguje wszystkie bestsellery o najwyższym zysku uwzględniając czyste wartości ROAS oraz opłacalności zakupu. (np.: W ciągu chwili odkryłem, że Advantage+ i segment wiekowy kampanii na męską 35-44 dowoził u mnie w tym tygodniu wymarzony cel ROAS!).
- **Palenie Budżetu:** Odcięliśmy "Loser'y" z zerową skutecznością przy koszcie, aby oszczędzane złotówki przesuwąć na grupy z potężnym zaangażowaniem.

### Podsumowanie

Coś, co wymagało ode mnie jeszcze rok temu straty wielu godzin mozolnej zabawy na cyferkach w excelu dzisiaj sprowadziliśmy do wydania 2 poleceń tekstowych trwających około 30 sekund przed startem mojej pracy.

Łącząc integrację danych Meta Graph API i AI od Google... stworzyłem sobie prawdziwego partnera do optymalizacji budżetów reklamowych, zamkniętego całkowicie anonimowo na moim osobistym komputerze.

A jak wy podchodzicie do automatyzacji sztuczną inteligencją w temacie optymalizacji waszych działań performance marketingowych? 👇

#MetaAds #MediaBuying #AI #Antigravity #DataAnalytics #MarketingAutomation #PerformanceMarketing #Python

<hr />

### Często Zadawane Pytania (FAQ)

**Czym jest Antigravity AI?**
Antigravity AI to zaawansowany asystent kodowania typu "agentic", stworzony przez zespół Google DeepMind. Potrafi samodzielnie tworzyć złożone skrypty, czytać dane lokalne oraz autonomicznie wykonywać zadania (jak analiza arkuszy CSV i komunikacja z API), co całkowicie transformuje codzienną pracę m.in. w branży performance marketingu.

**Jak bezpiecznie połączyć się z Meta Graph API z poziomu skryptu?**
Należy otworzyć Meta for Developers i stworzyć prostą aplikację dla biznesu. Następnie wygenerować Access Token z odpowiednimi uprawnieniami (np. `ads_read`) i przekonwertować go na token długoterminowy. Krytycznym aspektem bezpieczeństwa jest przechowywanie tokena w lokalnym pliku `.env`, a nie wpisywanie go bezpośrednio w kod wykonawczy.

**Czy do automatyzacji reklam na Facebooku muszę znać Pythona?**
Chociaż znajomość języków ułatwia pracę, asystenci AI potrafią napisać cały kod integracyjny za Ciebie (np. z wykorzystaniem biblioteki `pandas`). Wystarczy zdefiniować poprawne wskaźniki (KPI, Metryki Lejka) jako polecenie tekstowe, a AI obsłuży proces transformacji JSON z Meta na czytelny raport.
