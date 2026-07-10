const fs = require('fs');
const path = 'src/content/articles/en/mobile-app-attribution-guide-ga4-utm-mmp.md';
let content = fs.readFileSync(path, 'utf8');

// Replace Intro
content = content.replace(
  /In digital marketing, we have grown accustomed to a relatively simple and linear user journey:[\s\S]*?> \*\*The install step is a physical barrier that breaks the traditional tracking chain\.\*\*/m,
  `In digital marketing, we have grown accustomed to a relatively simple and linear user journey – like a straight flight through empty space:

**ad click → landing page view → conversion**

All campaign parameters travel effortlessly in the URL query string, the browser retains cookies, and the analytics script seamlessly logs the session and attributes the conversion.

However, in mobile app install campaigns, this straight path collides with the massive gravity of the app stores.

---

### Why the Install Step is an Attribution "Black Hole"

In the mobile app universe, your app is the center of the solar system, and ad networks (like Meta or Google) are distant planets. The user journey (our space probe) looks very different:

**ad click on planet "Meta" → entering the gravitational pull of the App Store → download → installation → landing (first launch) → conversion in the center (App)**

When a user clicks an app install ad, they leave their familiar orbit and enter the isolated sandbox of the app store. At the time of installation, the newly downloaded app has no access to URL query parameters, browser cookies, or the user's flight history. All source data disappears beyond the event horizon.

> **The install step is a black hole that physically breaks the traditional tracking chain and swallows the data.**`
);

// Replace Web vs App Grid
content = content.replace(
  /<div class="grid gap-6 md:grid-cols-2 my-8">[\s\S]*?<\/div>\n<\/div>/m,
  `<div class="grid gap-6 md:grid-cols-2 my-8">
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
</div>`
);

// Replace Product vs Marketing (One huge line)
content = content.replace(
  /<div class="relative my-12"><div class="grid gap-8 md:grid-cols-2 relative z-10 animate-slide-up"><div class="group relative overflow-hidden border border-blue-500\/20[\s\S]*?<\/div><\/div><\/div>/,
  `<div class="relative my-12"><div class="grid gap-8 md:grid-cols-2 relative z-10 animate-slide-up"><div class="group relative overflow-hidden border border-orange-500/20 bg-[#0a0500] rounded-3xl p-6 sm:p-8 hover:border-orange-500/50 transition-all duration-500 shadow-[0_0_40px_rgba(249,115,22,0.05)] hover:shadow-[0_0_60px_rgba(249,115,22,0.15)] flex flex-col justify-between"><div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1)_0%,transparent_100%)]"></div><div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full border border-orange-500/10 border-dashed animate-[spin_60s_linear_infinite] opacity-30 pointer-events-none"></div><div class="relative z-10"><div class="flex items-start gap-4 mb-6"><span class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 text-orange-400 font-extrabold text-lg shadow-[0_0_15px_rgba(249,115,22,0.2)]">01</span><div><h4 class="text-xl font-black tracking-tight text-white m-0">Core Analytics (Product)</h4><span class="text-xs font-mono text-orange-400 uppercase tracking-widest block mt-1">What's happening on the sun?</span></div></div><p class="text-sm font-semibold text-orange-100/90 mb-4">What happens after the probe lands? Where are the errors?</p><p class="text-sm text-orange-200/60 leading-relaxed mb-6">Focuses on <strong>optimizing the core app itself</strong>. Understanding what happens at the center of the system.</p></div><div class="space-y-4 relative z-10"><div class="bg-orange-950/40 border border-orange-500/20 rounded-2xl p-4 backdrop-blur-md"><span class="text-xs font-mono text-orange-400 block mb-1">Dedicated tool:</span><strong class="text-sm text-white">Google Analytics 4 &amp; Firebase SDK</strong></div><div class="flex flex-wrap gap-1.5"><span class="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-300 font-mono text-[10px] rounded-full">first_open</span><span class="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-300 font-mono text-[10px] rounded-full">screen_view</span></div></div></div><div class="group relative overflow-hidden border border-emerald-500/20 bg-[#000a05] rounded-3xl p-6 sm:p-8 hover:border-emerald-500/50 transition-all duration-500 shadow-[0_0_40px_rgba(16,185,129,0.05)] hover:shadow-[0_0_60px_rgba(16,185,129,0.15)] flex flex-col justify-between"><div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_100%)]"></div><div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full border border-emerald-500/10 border-dashed animate-[spin_60s_linear_infinite_reverse] opacity-30 pointer-events-none"></div><div class="relative z-10"><div class="flex items-start gap-4 mb-6"><span class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 font-extrabold text-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]">02</span><div><h4 class="text-xl font-black tracking-tight text-white m-0">Orbital Attribution (MMP)</h4><span class="text-xs font-mono text-emerald-400 uppercase tracking-widest block mt-1">Which planet sent them?</span></div></div><p class="text-sm font-semibold text-emerald-100/90 mb-4">Which planet (ad network) sent the user to our system?</p><p class="text-sm text-emerald-200/60 leading-relaxed mb-6">Focuses on <strong>interplanetary navigation and traffic</strong>. Connects the broken flight path through the black hole and deduplicates sources.</p></div><div class="space-y-4 relative z-10"><div class="bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-4 backdrop-blur-md"><span class="text-xs font-mono text-emerald-400 block mb-1">Dedicated tool:</span><strong class="text-sm text-white">Mobile Measurement Partner (MMP)</strong></div><div class="flex flex-wrap gap-1.5"><span class="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[10px] rounded-full">MMP SDK</span><span class="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[10px] rounded-full">Deduplication</span></div></div></div></div><div class="w-full border border-white/10 bg-[#050510] rounded-2xl p-6 text-center mt-8 relative overflow-hidden"><div class="absolute -right-12 -top-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div><p class="text-sm font-semibold text-white/90 m-0 relative z-10">🚀 <strong>Key takeaway:</strong> These two systems do not compete — they complete the solar system map. GA4 studies the sun, while MMP navigates the orbital traffic.</p></div></div>`
);

// Replace Checklist 
content = content.replace(
  /<div class="grid gap-4 sm:grid-cols-2 my-8">[\s\S]*?<\/div>\n<\/div>/,
  `<div class="grid gap-4 sm:grid-cols-2 my-8">
${[
  { title: "Firebase SDK Probe", desc: "Firebase SDK is installed in the system center (app) for Android and iOS." },
  { title: "Signal Mapping", desc: "Unified event taxonomy is defined (onboarding, sign-up, trial, purchase)." },
  { title: "Referrer Gravity", desc: "Google Play Install Referrer is verified and functioning on Android." },
  { title: "Wormholes", desc: "Deep linking and deferred deep linking (Universal Links) are configured." },
  { title: "ATT & SKAN Shields", desc: "The iOS ATT consent prompt is active, and the SKAN schema is mapped." },
  { title: "Resource Integration", desc: "Subscription payment provider is integrated with the orbiting analytics." },
  { title: "MMP Research Station", desc: "MMP is integrated with ad networks (planets), and postbacks are set up." },
  { title: "Expedition Costs", desc: "Ad spend ingestion is configured between ad platforms and the MMP." }
].map(item => `
<div class="relative overflow-hidden group flex items-start gap-4 p-5 rounded-3xl bg-[#030712] border border-white/5 hover:border-blue-500/30 transition-all duration-500">
<div class="absolute -inset-4 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
<div class="relative flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shadow-[0_0_10px_rgba(59,130,246,0.2)]">✓</div>
<div class="relative z-10"><h5 class="text-sm font-bold text-white m-0 mb-1">${item.title}</h5><p class="text-xs text-white/50 m-0 leading-relaxed">${item.desc}</p></div>
</div>`).join('')}
</div>`
);

// Replace CTA box
content = content.replace(
  /<div class="my-8 rounded-2xl border border-primary\/20 bg-primary\/5 p-6 text-center">[\s\S]*?<\/div>/,
  `<div class="relative overflow-hidden my-8 rounded-3xl border border-purple-500/20 bg-[#05030a] p-8 text-center shadow-[0_0_50px_rgba(168,85,247,0.05)]">
<div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15)_0%,transparent_70%)] pointer-events-none"></div>
<p class="text-base text-purple-100 font-bold m-0 mb-5 relative z-10">🌌 Want to see a fullscreen simulation of the attribution solar system?</p>
<a href="/en/tools/attribution-map" class="relative z-10 inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-black transition-all no-underline shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:-translate-y-1">Open the cosmic attribution map →</a>
</div>`
);

fs.writeFileSync(path, content, 'utf8');
console.log('EN Article updated with cosmic styling.');
