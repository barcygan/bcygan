---
title: "App Tracking Without Illusions: GA4, UTM, MMP, and SKAdNetwork in Mobile Campaign Attribution 📱"
excerpt: "A comprehensive guide to mobile app attribution. Learn why app installations break traditional tracking, how GA4 differs from an MMP, and how to master iOS SKAdNetwork and AdAttributionKit."
date: "2026-07-10"
author: "Bartek Cygan"
---

In digital marketing, we have grown accustomed to a relatively simple and linear user journey – like a straight flight through empty space:

**ad click → landing page view → conversion**

All campaign parameters travel effortlessly in the URL query string, the browser retains cookies, and the analytics script seamlessly logs the session and attributes the conversion.

However, in mobile app install campaigns, this straight path collides with the massive gravity of the app stores.

---

### Why the Install Step is an Attribution "Black Hole"

In the mobile app universe, your app is the center of the solar system, and ad networks (like Meta or Google) are distant planets. The user journey (our space probe) looks very different:

**ad click on planet "Meta" → entering the gravitational pull of the App Store → download → installation → landing (first launch) → conversion in the center (App)**

When a user clicks an app install ad, they leave their familiar orbit and enter the isolated sandbox of the app store. At the time of installation, the newly downloaded app has no access to URL query parameters, browser cookies, or the user's flight history. All source data disappears beyond the event horizon.

> **The install step is a black hole that physically breaks the traditional tracking chain and swallows the data.**

<div class="grid gap-6 md:grid-cols-2 my-8">
  <div class="relative overflow-hidden border border-blue-500/20 bg-[#060814] p-6 rounded-3xl shadow-[0_0_30px_rgba(59,130,246,0.05)]">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none"></div>
    <h4 class="text-lg font-bold text-blue-100 mb-3 flex items-center gap-2 relative z-10">
      <span class="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]"></span>
      Web Journey (Straight Flight)
    </h4>
    <ol class="space-y-3 text-sm text-blue-200/60 pl-4 list-decimal relative z-10 font-medium">
      <li>User clicks an ad (with UTM parameters)</li>
      <li>Lands directly on the target website</li>
      <li>Analytics script logs the session</li>
      <li class="text-blue-300"><strong>Conversion happens on-site</strong> (full data)</li>
    </ol>
  </div>
  <div class="relative overflow-hidden border border-purple-500/30 bg-[#0a0510] p-6 rounded-3xl shadow-[0_0_30px_rgba(168,85,247,0.05)]">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.15)_0%,transparent_70%)] pointer-events-none"></div>
    <div class="absolute -right-10 -top-10 w-32 h-32 rounded-full border border-purple-500/20 border-dashed animate-[spin_20s_linear_infinite] opacity-50"></div>
    <h4 class="text-lg font-bold text-purple-100 mb-3 flex items-center gap-2 relative z-10">
      <span class="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,1)]"></span>
      App Journey (Black Hole)
    </h4>
    <ol class="space-y-3 text-sm text-purple-200/60 pl-4 list-decimal relative z-10 font-medium">
      <li>User clicks an ad in orbit</li>
      <li>Pulled into App Store / Google Play gravity</li>
      <li class="text-purple-400">App is downloaded and installed (<strong>Data disappears beyond the horizon!</strong>)</li>
      <li>User launches the app in the center</li>
      <li><strong>In-app conversion happens</strong> (disconnected from source)</li>
    </ol>
  </div>
</div>

Google Analytics 4 (GA4) is exceptionally good at tracking user behavior once they are inside the app. However, it cannot automatically link that first app launch back to an ad click on an external advertising network. For that, a dedicated attribution architecture is required.

---

### 1. Two Different Questions: Product Analytics vs Attribution

When evaluating mobile apps, we must separate two entirely different analytical problems.
<div class="relative my-12"><div class="grid gap-8 md:grid-cols-2 relative z-10 animate-slide-up"><div class="group relative overflow-hidden border border-orange-500/20 bg-[#0a0500] rounded-3xl p-6 sm:p-8 hover:border-orange-500/50 transition-all duration-500 shadow-[0_0_40px_rgba(249,115,22,0.05)] hover:shadow-[0_0_60px_rgba(249,115,22,0.15)] flex flex-col justify-between"><div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1)_0%,transparent_100%)]"></div><div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full border border-orange-500/10 border-dashed animate-[spin_60s_linear_infinite] opacity-30 pointer-events-none"></div><div class="relative z-10"><div class="flex items-start gap-4 mb-6"><span class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 text-orange-400 font-extrabold text-lg shadow-[0_0_15px_rgba(249,115,22,0.2)]">01</span><div><h4 class="text-xl font-black tracking-tight text-white m-0">Core Analytics (Product)</h4><span class="text-xs font-mono text-orange-400 uppercase tracking-widest block mt-1">What's happening on the sun?</span></div></div><p class="text-sm font-semibold text-orange-100/90 mb-4">What happens after the probe lands? Where are the errors?</p><p class="text-sm text-orange-200/60 leading-relaxed mb-6">Focuses on <strong>optimizing the core app itself</strong>. Understanding what happens at the center of the system.</p></div><div class="space-y-4 relative z-10"><div class="bg-orange-950/40 border border-orange-500/20 rounded-2xl p-4 backdrop-blur-md"><span class="text-xs font-mono text-orange-400 block mb-1">Dedicated tool:</span><strong class="text-sm text-white">Google Analytics 4 &amp; Firebase SDK</strong></div><div class="flex flex-wrap gap-1.5"><span class="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-300 font-mono text-[10px] rounded-full">first_open</span><span class="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-300 font-mono text-[10px] rounded-full">screen_view</span></div></div></div><div class="group relative overflow-hidden border border-emerald-500/20 bg-[#000a05] rounded-3xl p-6 sm:p-8 hover:border-emerald-500/50 transition-all duration-500 shadow-[0_0_40px_rgba(16,185,129,0.05)] hover:shadow-[0_0_60px_rgba(16,185,129,0.15)] flex flex-col justify-between"><div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_100%)]"></div><div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full border border-emerald-500/10 border-dashed animate-[spin_60s_linear_infinite_reverse] opacity-30 pointer-events-none"></div><div class="relative z-10"><div class="flex items-start gap-4 mb-6"><span class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 font-extrabold text-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]">02</span><div><h4 class="text-xl font-black tracking-tight text-white m-0">Orbital Attribution (MMP)</h4><span class="text-xs font-mono text-emerald-400 uppercase tracking-widest block mt-1">Which planet sent them?</span></div></div><p class="text-sm font-semibold text-emerald-100/90 mb-4">Which planet (ad network) sent the user to our system?</p><p class="text-sm text-emerald-200/60 leading-relaxed mb-6">Focuses on <strong>interplanetary navigation and traffic</strong>. Connects the broken flight path through the black hole and deduplicates sources.</p></div><div class="space-y-4 relative z-10"><div class="bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-4 backdrop-blur-md"><span class="text-xs font-mono text-emerald-400 block mb-1">Dedicated tool:</span><strong class="text-sm text-white">Mobile Measurement Partner (MMP)</strong></div><div class="flex flex-wrap gap-1.5"><span class="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[10px] rounded-full">MMP SDK</span><span class="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[10px] rounded-full">Deduplication</span></div></div></div></div><div class="w-full border border-white/10 bg-[#050510] rounded-2xl p-6 text-center mt-8 relative overflow-hidden"><div class="absolute -right-12 -top-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div><p class="text-sm font-semibold text-white/90 m-0 relative z-10">🚀 <strong>Key takeaway:</strong> These two systems do not compete — they complete the solar system map. GA4 studies the sun, while MMP navigates the orbital traffic.</p></div></div><div class="group relative overflow-hidden border border-green-500/20 bg-green-950/5 rounded-3xl p-6 sm:p-8 hover:border-green-500/50 hover:bg-green-950/10 transition-all duration-500 transform hover:-translate-y-2 shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] flex flex-col justify-between"><div class="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-all duration-500"></div><div><div class="flex items-start gap-4 mb-6"><span class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-green-500/10 text-green-400 font-extrabold text-lg group-hover:scale-110 transition-transform duration-500 mt-1">02</span><div><h4 class="text-xl font-black tracking-tight text-foreground m-0">Marketing Attribution</h4><span class="text-xs font-mono text-green-400 uppercase tracking-widest block mt-1">Where did they come from?</span></div></div><p class="text-sm font-semibold text-foreground mb-4">Key question: Which ad, campaign, or network led to the install and conversion?</p><p class="text-sm text-muted-foreground leading-relaxed mb-6">Focuses on <strong>marketing efficiency and ROAS</strong>. Connects the broken ad link to the install and deduplicates conversions across channels.</p></div><div class="space-y-4"><div class="bg-green-950/20 border border-green-500/10 rounded-2xl p-4"><span class="text-xs font-mono text-green-400 block mb-1">Dedicated tool:</span><strong class="text-sm text-foreground">Mobile Measurement Partner (MMP)</strong></div><div class="flex flex-wrap gap-1.5"><span class="px-2.5 py-0.5 bg-green-500/10 text-green-400 font-mono text-[10px] rounded-full">MMP SDK</span><span class="px-2.5 py-0.5 bg-green-500/10 text-green-400 font-mono text-[10px] rounded-full">Deduplication</span><span class="px-2.5 py-0.5 bg-green-500/10 text-green-400 font-mono text-[10px] rounded-full">SKAN / AAKit</span><span class="px-2.5 py-0.5 bg-green-500/10 text-green-400 font-mono text-[10px] rounded-full">Postbacks</span></div></div></div></div><div class="w-full border border-border/40 bg-card/20 rounded-2xl p-6 text-center mt-8 relative overflow-hidden"><div class="absolute -right-12 -top-12 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div><p class="text-sm font-semibold text-foreground m-0">💡 <strong>Key takeaway:</strong> These two systems do not compete — they play complementary roles and should run in parallel.</p></div></div>

---

### 2. How GA4 Works in Mobile Apps

The Firebase SDK automatically tracks standard technical events and allows you to define custom product events, such as:
*   `first_open` (the first time the app is launched – the app equivalent of an install),
*   onboarding completion and account sign-ups,
*   subscription trial starts and in-app purchases.

#### `first_open` vs Install
It is critical to remember that:

```text
store download ≠ install reported by network ≠ first_open in GA4
```

A user can download an app from the store but never actually open it. In this case, the ad network will report an install, but GA4 will never log a `first_open` event.

By default, without advanced configuration, GA4 will attribute the acquisition source of most new users as `(direct) / (none)` or `organic`. The campaign details simply get lost in the transition through the app store. While Google allows you to manually populate this data by sending a `campaign_details` event shortly after install, doing so requires additional technical integrations.

---

### 3. UTM vs MMP – Why They Are Not the Same

A common misconception is that UTM query parameters in ad links can replace a full MMP integration.

> **A UTM parameter is merely a static label describing a click source. An MMP is an active attribution engine.**

When a user clicks a link with UTM parameters and the app is already installed, a deep link (or App Link/Universal Link) opens it directly. The app reads the UTM parameters and passes them to GA4 – tracking works perfectly.

The issue arises with **new installs**. The presence of UTM parameters in the ad link does not mean they will magically survive the journey through App Store or Google Play and arrive in the app.

<div class="grid gap-6 md:grid-cols-2 my-8">
  <div class="border border-border/60 bg-card/10 p-6 rounded-2xl hover:border-primary/40 transition-colors">
    <h4 class="text-xl font-bold text-primary mb-3">Google Analytics 4 (GA4)</h4>
    <p class="text-sm text-muted-foreground mb-4"><strong>Product & Behavioral Analytics:</strong> What does the user do inside the app? How does the onboarding flow perform? Where do they drop off?</p>
    <ul class="space-y-2 text-xs text-muted-foreground pl-4 list-disc">
      <li>Tracks product events (screen_view, sign_up, add_to_cart)</li>
      <li>Cohort analysis and user retention metrics</li>
      <li>Firebase integration and raw data export to BigQuery</li>
      <li>Limited out-of-the-box attribution for paid channels</li>
    </ul>
  </div>
  <div class="border border-border/60 bg-card/10 p-6 rounded-2xl hover:border-primary/40 transition-colors">
    <h4 class="text-xl font-bold text-green-400 mb-3">Mobile Measurement Partner (MMP)</h4>
    <p class="text-sm text-muted-foreground mb-4"><strong>Marketing Attribution:</strong> Where did the user come from? Which specific ad drove the install? Who gets the conversion credit?</p>
    <ul class="space-y-2 text-xs text-muted-foreground pl-4 list-disc">
      <li>Attributes installs to specific ad networks</li>
      <li>Deduplicates conversions in multi-channel environments</li>
      <li>Sends real-time conversion postbacks to ad networks</li>
      <li>Handles Apple ATT, SKAN, and deferred deep linking on iOS</li>
    </ul>
  </div>
</div>

#### How MMP Attribution Works
The MMP SDK integrates directly with mobile operating systems and ad networks (Meta, Google, TikTok). When a user clicks an ad, the MMP logs the click (and the device identifier). Once the app is installed and launched, the MMP SDK gathers available device signals and queries its server. The system performs matching (either deterministic via Google Play Install Referrer, or probabilistic) to attribute the install, and instantly sends a postback to the winning ad network.

<details class="group border border-border bg-card/30 rounded-2xl p-4 my-6 transition-all duration-300">
  <summary class="flex justify-between items-center font-bold text-foreground cursor-pointer list-none">
    <span>🔍 Technical Deep Dive: How the Google Play Install Referrer API Works</span>
    <span class="transition-transform group-open:rotate-180 text-primary">&darr;</span>
  </summary>
  <div class="mt-4 pt-4 border-t border-border/50 text-sm text-muted-foreground space-y-4">
    <p>On Android, Google Play provides a secure API that allows apps to query the store for install details. Upon first launch, the SDK (MMP or Firebase) binds to the local Google Play service using an AIDL (Android Interface Definition Language) interface.</p>
    <p>The API response contains details such as:</p>
    <pre class="bg-card border border-border/50 p-4 rounded-xl font-mono text-xs overflow-x-auto text-foreground">
{
  "install_referrer": "utm_source=facebook&utm_medium=paid_social&utm_campaign=summer_sale&fbclid=...",
  "referrer_click_timestamp_seconds": 1783856200,
  "install_begin_timestamp_seconds": 1783856240,
  "google_play_instant_enabled": false
}</pre>
    <p>This allows the SDK to link the install to a specific click by verifying the exact timestamp discrepancy between the ad click and the download initiation.</p>
  </div>
</details>

---

### 4. iOS, ATT, and SKAdNetwork / AdAttributionKit

While Android attribution is relatively straightforward, iOS became a battlefield after Apple introduced **App Tracking Transparency (ATT)**.

Users must opt-in to tracking. If they select "Ask App not to Track" (which over 60% of users do), the app loses access to the IDFA identifier and is barred from using fingerprinting. To address this, Apple built **SKAdNetwork (SKAN)**, now evolving into **AdAttributionKit**, as a privacy-preserving attribution framework.

#### How SKAdNetwork Operates
Apple acts as the attribution referee:
1. The user clicks an ad digitally signed by the ad network.
2. Apple records this click at the iOS system level.
3. After the app is installed and opened, iOS determines if it qualifies for attribution.
4. Instead of sharing user data, Apple sends a **delayed, anonymous postback** directly to the ad network or MMP.

<details class="group border border-border bg-card/30 rounded-2xl p-4 my-6 transition-all duration-300">
  <summary class="flex justify-between items-center font-bold text-foreground cursor-pointer list-none">
    <span>🔍 Technical Deep Dive: Inside a Raw SKAdNetwork Postback</span>
    <span class="transition-transform group-open:rotate-180 text-primary">&darr;</span>
  </summary>
  <div class="mt-4 pt-4 border-t border-border/50 text-sm text-muted-foreground space-y-4">
    <p>When Apple decides to dispatch an attribution postback (which happens with a random delay of 24 to 48 hours after install or value update), it executes an HTTP POST request to the registered endpoint (e.g., the MMP server). A raw SKAN 4.0 JSON payload looks like this:</p>
    <pre class="bg-card border border-border/50 p-4 rounded-xl font-mono text-xs overflow-x-auto text-foreground">
{
  "version": "4.0",
  "ad-network-id": "v9wttpbfk9.skadnetwork",
  "transaction-id": "61a34b22-87ff-4375-9c88-12c83ff111a4",
  "campaign-id": "84",
  "source-identifier": "1084",
  "attribution-signature": "MEYCIQCc3v1qH3...",
  "redownload": false,
  "source-app-item-id": 123456789,
  "fidelity-type": 1,
  "coarse-conversion-value": "high",
  "postback-sequence-index": 0
}</pre>
    <p>Note that the postback contains absolutely no <code>device_id</code> or <code>user_id</code>. The <code>coarse-conversion-value</code> ("high") indicates the user completed a high-value action, and the <code>source-identifier</code> field contains up to 4 digits depending on sample sizes (privacy thresholds).</p>
  </div>
</details>

#### The Mystery of Conversion Values
Since Apple does not report individual user events (e.g., "purchased a $19 item"), post-install activity is measured using **Conversion Values**. This is a encoded digit (ranging from 0 to 63 in "Fine" mode, or represented as "low", "medium", "high" in "Coarse" mode).

An example conversion value schema:
*   **0** = app launched (first_open)
*   **5** = user signed up
*   **12** = added product to cart
*   **40** = completed purchase (low value)
*   **60** = premium subscription purchased

Analytics platforms (including Firebase and MMPs) allow you to map these values in their dashboard, while the SDK manages updating the value on-device. Apple transmits the raw value, and the receiving platform decodes it based on your predefined mapping schema.

---

### 5. Why Meta Ads, MMP, and GA4 Data Diverge

In a healthy app tracking setup, discrepancies across dashboards are expected. Each platform answers a different question and uses different attribution windows.

<div class="w-full overflow-x-auto my-8 border border-border/40 rounded-2xl bg-card/10 backdrop-blur-sm">
<table class="min-w-full text-sm m-0 border-collapse">
<thead>
<tr class="border-b border-border/40 bg-muted/10">
<th class="p-4 text-left font-bold text-foreground">Metric / Feature</th>
<th class="p-4 text-left font-bold text-foreground">Meta Ads Manager</th>
<th class="p-4 text-left font-bold text-foreground">Mobile Measurement Partner (MMP)</th>
<th class="p-4 text-left font-bold text-foreground">Google Analytics 4 (GA4)</th>
<th class="p-4 text-left font-bold text-foreground">Apple SKAN</th>
</tr>
</thead>
<tbody>
<tr class="border-b border-border/20">
<td class="p-4 text-muted-foreground font-semibold">What it reports</td>
<td class="p-4 text-muted-foreground text-xs leading-relaxed">Installs attributed to Meta</td>
<td class="p-4 text-muted-foreground text-xs leading-relaxed">Deduplicated multi-channel installs</td>
<td class="p-4 text-muted-foreground text-xs leading-relaxed">First open events (<code>first_open</code>)</td>
<td class="p-4 text-muted-foreground text-xs leading-relaxed">Aggregated postbacks from iOS devices</td>
</tr>
<tr class="border-b border-border/20">
<td class="p-4 text-muted-foreground font-semibold">Attribution Model</td>
<td class="p-4 text-muted-foreground text-xs leading-relaxed">Click &amp; View-through (Meta-centric)</td>
<td class="p-4 text-muted-foreground text-xs leading-relaxed">Cross-channel Last Click</td>
<td class="p-4 text-muted-foreground text-xs leading-relaxed">GA4 model (often modeled/data-driven)</td>
<td class="p-4 text-muted-foreground text-xs leading-relaxed">Aggregated Apple Attribution</td>
</tr>
<tr class="border-b border-border/20">
<td class="p-4 text-muted-foreground font-semibold">User Data</td>
<td class="p-4 text-muted-foreground text-xs leading-relaxed">Full (within Meta ecosystem)</td>
<td class="p-4 text-muted-foreground text-xs leading-relaxed">Dependent on ATT opt-in (deterministic/probabilistic)</td>
<td class="p-4 text-muted-foreground text-xs leading-relaxed">Dependent on user consent &amp; Firebase ID</td>
<td class="p-4 text-muted-foreground text-xs leading-relaxed">Complete absence of user-level data</td>
</tr>
<tr>
<td class="p-4 text-muted-foreground font-semibold">Reporting Delay</td>
<td class="p-4 text-muted-foreground text-xs leading-relaxed">Real-time / Modeled</td>
<td class="p-4 text-muted-foreground text-xs leading-relaxed">Real-time</td>
<td class="p-4 text-muted-foreground text-xs leading-relaxed">Real-time (up to 24-48h in standard UI)</td>
<td class="p-4 text-muted-foreground text-xs leading-relaxed">Random delay (24-48h for privacy)</td>
</tr>
</tbody>
</table>
</div>

#### Common Sources of Discrepancies:
*   **Download vs. Launch:** Meta counts an install when a user clicks download in the app store. GA4 only logs the install when the user physically opens the app (`first_open`) and the SDK initializes.
*   **Lack of Cross-Channel Deduplication:** If a user clicks a TikTok ad, then a Meta ad, and installs the app, both Meta and TikTok will claim 100% credit (total: 2 installs). An MMP deduplicates this and assigns 1 install to the last click.
*   **Attribution Windows:** Different systems default to different windows (e.g., 1-day, 7-day, or 30-day click-through).

---

### 6. Designing a Rational App Analytics Architecture

Attempting to find a single tool that does everything is a recipe for failure. A mature mobile marketing technology (MarTech) stack divides responsibilities:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        MOBILE ANALYTICS ARCHITECTURE                   │
├───────────────────┬────────────────────────────────────────────────────┤
│ GA4 / Firebase    │ Product usage, user flows, retention, and LTV      │
├───────────────────┼────────────────────────────────────────────────────┤
│ MMP (AppsFlyer)   │ Paid attribution, deduplication, and fraud checks  │
├───────────────────┼────────────────────────────────────────────────────┤
│ SKAN / AAKit      │ Privacy-safe iOS tracking and campaign optimization│
├───────────────────┼────────────────────────────────────────────────────┤
│ Warehouse (BQ)    │ Raw data merging, CRM revenue reconciliation       │
└───────────────────┴────────────────────────────────────────────────────┘
```

Using this architecture, business reporting is clean and actionable:
1.  **Product Dashboard (GA4/CRM):** Tracks actual product health (active users, conversion funnels, subscription churn, renewals).
2.  **Acquisition Dashboard (MMP):** Measures paid acquisition efficiency (ROAS, blended CAC, network performance).
3.  **Executive Dashboard (DWH):** Joins network spend with CRM subscription lifecycles to calculate accurate payback periods.

---

<div class="grid gap-4 sm:grid-cols-2 my-8">

<div class="relative overflow-hidden group flex items-start gap-4 p-5 rounded-3xl bg-[#030712] border border-white/5 hover:border-blue-500/30 transition-all duration-500">
<div class="absolute -inset-4 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
<div class="relative flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shadow-[0_0_10px_rgba(59,130,246,0.2)]">✓</div>
<div class="relative z-10"><h5 class="text-sm font-bold text-white m-0 mb-1">Firebase SDK Probe</h5><p class="text-xs text-white/50 m-0 leading-relaxed">Firebase SDK is installed in the system center (app) for Android and iOS.</p></div>
</div>
<div class="relative overflow-hidden group flex items-start gap-4 p-5 rounded-3xl bg-[#030712] border border-white/5 hover:border-blue-500/30 transition-all duration-500">
<div class="absolute -inset-4 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
<div class="relative flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shadow-[0_0_10px_rgba(59,130,246,0.2)]">✓</div>
<div class="relative z-10"><h5 class="text-sm font-bold text-white m-0 mb-1">Signal Mapping</h5><p class="text-xs text-white/50 m-0 leading-relaxed">Unified event taxonomy is defined (onboarding, sign-up, trial, purchase).</p></div>
</div>
<div class="relative overflow-hidden group flex items-start gap-4 p-5 rounded-3xl bg-[#030712] border border-white/5 hover:border-blue-500/30 transition-all duration-500">
<div class="absolute -inset-4 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
<div class="relative flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shadow-[0_0_10px_rgba(59,130,246,0.2)]">✓</div>
<div class="relative z-10"><h5 class="text-sm font-bold text-white m-0 mb-1">Referrer Gravity</h5><p class="text-xs text-white/50 m-0 leading-relaxed">Google Play Install Referrer is verified and functioning on Android.</p></div>
</div>
<div class="relative overflow-hidden group flex items-start gap-4 p-5 rounded-3xl bg-[#030712] border border-white/5 hover:border-blue-500/30 transition-all duration-500">
<div class="absolute -inset-4 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
<div class="relative flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shadow-[0_0_10px_rgba(59,130,246,0.2)]">✓</div>
<div class="relative z-10"><h5 class="text-sm font-bold text-white m-0 mb-1">Wormholes</h5><p class="text-xs text-white/50 m-0 leading-relaxed">Deep linking and deferred deep linking (Universal Links) are configured.</p></div>
</div>
<div class="relative overflow-hidden group flex items-start gap-4 p-5 rounded-3xl bg-[#030712] border border-white/5 hover:border-blue-500/30 transition-all duration-500">
<div class="absolute -inset-4 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
<div class="relative flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shadow-[0_0_10px_rgba(59,130,246,0.2)]">✓</div>
<div class="relative z-10"><h5 class="text-sm font-bold text-white m-0 mb-1">ATT & SKAN Shields</h5><p class="text-xs text-white/50 m-0 leading-relaxed">The iOS ATT consent prompt is active, and the SKAN schema is mapped.</p></div>
</div>
<div class="relative overflow-hidden group flex items-start gap-4 p-5 rounded-3xl bg-[#030712] border border-white/5 hover:border-blue-500/30 transition-all duration-500">
<div class="absolute -inset-4 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
<div class="relative flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shadow-[0_0_10px_rgba(59,130,246,0.2)]">✓</div>
<div class="relative z-10"><h5 class="text-sm font-bold text-white m-0 mb-1">Resource Integration</h5><p class="text-xs text-white/50 m-0 leading-relaxed">Subscription payment provider is integrated with the orbiting analytics.</p></div>
</div>
<div class="relative overflow-hidden group flex items-start gap-4 p-5 rounded-3xl bg-[#030712] border border-white/5 hover:border-blue-500/30 transition-all duration-500">
<div class="absolute -inset-4 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
<div class="relative flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shadow-[0_0_10px_rgba(59,130,246,0.2)]">✓</div>
<div class="relative z-10"><h5 class="text-sm font-bold text-white m-0 mb-1">MMP Research Station</h5><p class="text-xs text-white/50 m-0 leading-relaxed">MMP is integrated with ad networks (planets), and postbacks are set up.</p></div>
</div>
<div class="relative overflow-hidden group flex items-start gap-4 p-5 rounded-3xl bg-[#030712] border border-white/5 hover:border-blue-500/30 transition-all duration-500">
<div class="absolute -inset-4 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
<div class="relative flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shadow-[0_0_10px_rgba(59,130,246,0.2)]">✓</div>
<div class="relative z-10"><h5 class="text-sm font-bold text-white m-0 mb-1">Expedition Costs</h5><p class="text-xs text-white/50 m-0 leading-relaxed">Ad spend ingestion is configured between ad platforms and the MMP.</p></div>
</div>
</div>
<div class="flex items-start gap-3.5 p-5 rounded-2xl bg-card/25 border border-border/40 hover:border-blue-500/30 hover:bg-card/50 transition-all duration-300">
<div class="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">✓</div>
<div>
<h5 class="text-sm font-bold text-foreground m-0 mb-1">Event Taxonomy</h5>
<p class="text-xs text-muted-foreground m-0 leading-relaxed">Unified event taxonomy is defined (onboarding, sign-up, trial, purchase).</p>
</div>
</div>
<div class="flex items-start gap-3.5 p-5 rounded-2xl bg-card/25 border border-border/40 hover:border-blue-500/30 hover:bg-card/50 transition-all duration-300">
<div class="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">✓</div>
<div>
<h5 class="text-sm font-bold text-foreground m-0 mb-1">Install Referrer API</h5>
<p class="text-xs text-muted-foreground m-0 leading-relaxed">Google Play Install Referrer is verified and functioning on Android.</p>
</div>
</div>
<div class="flex items-start gap-3.5 p-5 rounded-2xl bg-card/25 border border-border/40 hover:border-blue-500/30 hover:bg-card/50 transition-all duration-300">
<div class="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">✓</div>
<div>
<h5 class="text-sm font-bold text-foreground m-0 mb-1">Deep Linking</h5>
<p class="text-xs text-muted-foreground m-0 leading-relaxed">Deep linking and deferred deep linking (Universal Links / App Links) are configured.</p>
</div>
</div>
<div class="flex items-start gap-3.5 p-5 rounded-2xl bg-card/25 border border-border/40 hover:border-blue-500/30 hover:bg-card/50 transition-all duration-300">
<div class="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">✓</div>
<div>
<h5 class="text-sm font-bold text-foreground m-0 mb-1">ATT &amp; SKAdNetwork</h5>
<p class="text-xs text-muted-foreground m-0 leading-relaxed">The iOS ATT consent prompt is active, and the SKAN Conversion Value schema is mapped.</p>
</div>
</div>
<div class="flex items-start gap-3.5 p-5 rounded-2xl bg-card/25 border border-border/40 hover:border-blue-500/30 hover:bg-card/50 transition-all duration-300">
<div class="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">✓</div>
<div>
<h5 class="text-sm font-bold text-foreground m-0 mb-1">Payments Integration</h5>
<p class="text-xs text-muted-foreground m-0 leading-relaxed">Subscription payment provider (e.g., RevenueCat) is integrated with analytics.</p>
</div>
</div>
<div class="flex items-start gap-3.5 p-5 rounded-2xl bg-card/25 border border-border/40 hover:border-blue-500/30 hover:bg-card/50 transition-all duration-300">
<div class="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">✓</div>
<div>
<h5 class="text-sm font-bold text-foreground m-0 mb-1">MMP Integration</h5>
<p class="text-xs text-muted-foreground m-0 leading-relaxed">MMP is integrated with your ad networks, and postbacks for in-app events are set up.</p>
</div>
</div>
<div class="flex items-start gap-3.5 p-5 rounded-2xl bg-card/25 border border-border/40 hover:border-blue-500/30 hover:bg-card/50 transition-all duration-300">
<div class="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">✓</div>
<div>
<h5 class="text-sm font-bold text-foreground m-0 mb-1">Cost Data Ingestion</h5>
<p class="text-xs text-muted-foreground m-0 leading-relaxed">Ad spend ingestion is configured between ad platforms and the MMP.</p>
</div>
</div>
</div>

---

### Interactive Attribution Path Map

Below is an interactive map that visually represents the entire user journey and shows what **each analytics system sees** (GA4, MMP, SKAdNetwork) at every stage. Click a perspective and each node to see the details.


<div class="relative overflow-hidden my-8 rounded-3xl border border-purple-500/20 bg-[#05030a] p-8 text-center shadow-[0_0_50px_rgba(168,85,247,0.05)]">
<div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15)_0%,transparent_70%)] pointer-events-none"></div>
<p class="text-base text-purple-100 font-bold m-0 mb-5 relative z-10">🌌 Want to see a fullscreen simulation of the attribution solar system?</p>
<a href="/en/tools/attribution-map" class="relative z-10 inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-black transition-all no-underline shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:-translate-y-1">Open the cosmic attribution map →</a>
</div>

---


### Frequently Asked Questions (FAQ)


**Why do analytics platforms lose acquisition sources for mobile app installs?**
App stores (App Store and Google Play) function as isolated environments. When a user is redirected from an ad to the store, standard URL parameters (like UTMs) are discarded. If the app does not have an attribution mechanism (like Google Play Install Referrer or an MMP SDK) to recover the click context on first launch, the analytics platform simply logs the user source as direct/none.

**What is the difference between Firebase SDK and an MMP?**
The Firebase SDK is a product analytics tool. It focuses on what users do inside the app – analyzing user flows, retention, features usage, and screen views. An MMP (Mobile Measurement Partner) is a marketing attribution engine. It matches the install to the correct marketing channel, deduplicates conversions across channels, and handles postbacks to ad networks.

**Is SKAdNetwork/AdAttributionKit required for an iOS app to function?**
No, your app will run perfectly without them. However, it is the only method approved by Apple for measuring the performance of paid ad campaigns on iOS for users who choose to opt-out via the ATT prompt. Without SKAN or AdAttributionKit, you cannot optimize iOS ad campaigns (such as Meta Ads) for installs or in-app conversions.

**How should I map Conversion Values in SKAdNetwork to optimize my campaigns?**
You should map conversion values to early user actions (within the first 24-48 hours) that strongly correlate with high long-term lifetime value (LTV). For example, assign low values to onboarding completion, mid-range values to profile creation, and high values (e.g., 40+) to starting a free trial or completing a purchase.

**Why is there a discrepancy between Meta Ads installs and GA4 first_open events?**
Meta Ads Manager counts an install when a user clicks the download button in the app store, or calculates it via statistical modeling. GA4 only logs a `first_open` event when the user actually opens the app for the first time and the SDK initializes. Many users download apps but never open them, causing Meta numbers to appear higher than GA4.
