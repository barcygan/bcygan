const fs = require('fs');
const path = 'src/content/articles/pl/atrybucja-w-aplikacjach-mobilnych-ga4-utm-mmp.md';
let content = fs.readFileSync(path, 'utf8');

// Replace Intro
content = content.replace(
  /W marketingu internetowym przyzwyczailiśmy się do relatywnie prostej i liniowej ścieżki użytkownika:[\s\S]*?> \*\*Instalacja jest momentem, który fizycznie przerywa standardową ścieżkę atrybucji\.\*\*/m,
  `W klasycznym marketingu internetowym przyzwyczailiśmy się do prostej, liniowej ścieżki – niczym lot w próżni z punktu A do punktu B:

**kliknięcie reklamy → wejście na stronę → wykonanie konwersji**

Wszystkie parametry kampanii przemieszczają się bez oporu w adresie URL, przeglądarka zachowuje pliki cookie, a skrypt analityczny bez problemu rejestruje sesję i przypisuje jej konwersję. 

Jednak w kampaniach promujących aplikacje mobilne ta prosta ścieżka zderza się z potężną grawitacją sklepów z aplikacjami.

---

### Dlaczego instalacja to analityczna „czarna dziura”?

W świecie aplikacji mobilnych, nasza aplikacja jest centrum układu słonecznego, a sieci reklamowe (jak Meta czy Google) to odległe planety. Ścieżka użytkownika (naszej sondy) wygląda zupełnie inaczej:

**kliknięcie reklamy na planecie "Meta" → wejście w pole grawitacyjne sklepu (App Store) → pobranie → instalacja → lądowanie (pierwsze uruchomienie) → konwersja w centrum (App)**

Gdy użytkownik klika reklamę instalacyjną, opuszcza znajomą orbitę i trafia do zamkniętego ekosystemu sklepu. W momencie instalacji nowa aplikacja nie ma dostępu do parametrów URL, plików cookie ani historii lotu użytkownika. Wszystkie dane o źródle znikają za horyzontem zdarzeń.

> **Instalacja to czarna dziura, która fizycznie rozrywa standardową ścieżkę atrybucji i pochłania dane.**`
);

// Replace Web vs App Grid
content = content.replace(
  /<div class="grid gap-6 md:grid-cols-2 my-8">[\s\S]*?<\/div>\n<\/div>/m,
  `<div class="grid gap-6 md:grid-cols-2 my-8">
  <div class="relative overflow-hidden border border-blue-500/20 bg-[#060814] p-6 rounded-3xl shadow-[0_0_30px_rgba(59,130,246,0.05)]">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none"></div>
    <h4 class="text-lg font-bold text-blue-100 mb-3 flex items-center gap-2 relative z-10">
      <span class="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]"></span>
      Ścieżka Web (Lot po prostej)
    </h4>
    <ol class="space-y-3 text-sm text-blue-200/60 pl-4 list-decimal relative z-10 font-medium">
      <li>Kliknięcie w reklamę (z parametrami UTM)</li>
      <li>Przejście bezpośrednio na stronę docelową</li>
      <li>Zarejestrowanie sesji przez skrypt</li>
      <li class="text-blue-300"><strong>Konwersja na stronie</strong> (pełne dane)</li>
    </ol>
  </div>
  <div class="relative overflow-hidden border border-purple-500/30 bg-[#0a0510] p-6 rounded-3xl shadow-[0_0_30px_rgba(168,85,247,0.05)]">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.15)_0%,transparent_70%)] pointer-events-none"></div>
    <div class="absolute -right-10 -top-10 w-32 h-32 rounded-full border border-purple-500/20 border-dashed animate-[spin_20s_linear_infinite] opacity-50"></div>
    <h4 class="text-lg font-bold text-purple-100 mb-3 flex items-center gap-2 relative z-10">
      <span class="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,1)]"></span>
      Ścieżka App (Czarna Dziura)
    </h4>
    <ol class="space-y-3 text-sm text-purple-200/60 pl-4 list-decimal relative z-10 font-medium">
      <li>Kliknięcie w reklamę na orbicie</li>
      <li>Wkroczenie w grawitację App Store / Google Play</li>
      <li class="text-purple-400">Pobranie i instalacja (<strong>Dane znikają za horyzontem!</strong>)</li>
      <li>Pierwsze uruchomienie w centrum</li>
      <li><strong>Konwersja w aplikacji</strong> (brak powiązania ze źródłem)</li>
    </ol>
  </div>
</div>`
);

// Replace Product vs Marketing (One huge line)
content = content.replace(
  /<div class="relative my-12"><div class="grid gap-8 md:grid-cols-2 relative z-10 animate-slide-up"><div class="group relative overflow-hidden border border-blue-500\/20[\s\S]*?<\/div><\/div><\/div>/,
  `<div class="relative my-12"><div class="grid gap-8 md:grid-cols-2 relative z-10 animate-slide-up"><div class="group relative overflow-hidden border border-orange-500/20 bg-[#0a0500] rounded-3xl p-6 sm:p-8 hover:border-orange-500/50 transition-all duration-500 shadow-[0_0_40px_rgba(249,115,22,0.05)] hover:shadow-[0_0_60px_rgba(249,115,22,0.15)] flex flex-col justify-between"><div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1)_0%,transparent_100%)]"></div><div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full border border-orange-500/10 border-dashed animate-[spin_60s_linear_infinite] opacity-30 pointer-events-none"></div><div class="relative z-10"><div class="flex items-start gap-4 mb-6"><span class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 text-orange-400 font-extrabold text-lg shadow-[0_0_15px_rgba(249,115,22,0.2)]">01</span><div><h4 class="text-xl font-black tracking-tight text-white m-0">Analityka Centrum (Produkt)</h4><span class="text-xs font-mono text-orange-400 uppercase tracking-widest block mt-1">Co dzieje się na słońcu?</span></div></div><p class="text-sm font-semibold text-orange-100/90 mb-4">Co użytkownik robi po wylądowaniu w aplikacji? Gdzie napotyka błędy?</p><p class="text-sm text-orange-200/60 leading-relaxed mb-6">Koncentruje się na <strong>optymalizacji samej aplikacji</strong>. Zrozumienie, co dzieje się w samym centrum układu.</p></div><div class="space-y-4 relative z-10"><div class="bg-orange-950/40 border border-orange-500/20 rounded-2xl p-4 backdrop-blur-md"><span class="text-xs font-mono text-orange-400 block mb-1">Dedykowane narzędzie:</span><strong class="text-sm text-white">Google Analytics 4 &amp; Firebase SDK</strong></div><div class="flex flex-wrap gap-1.5"><span class="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-300 font-mono text-[10px] rounded-full">first_open</span><span class="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-300 font-mono text-[10px] rounded-full">screen_view</span></div></div></div><div class="group relative overflow-hidden border border-emerald-500/20 bg-[#000a05] rounded-3xl p-6 sm:p-8 hover:border-emerald-500/50 transition-all duration-500 shadow-[0_0_40px_rgba(16,185,129,0.05)] hover:shadow-[0_0_60px_rgba(16,185,129,0.15)] flex flex-col justify-between"><div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_100%)]"></div><div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full border border-emerald-500/10 border-dashed animate-[spin_60s_linear_infinite_reverse] opacity-30 pointer-events-none"></div><div class="relative z-10"><div class="flex items-start gap-4 mb-6"><span class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 font-extrabold text-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]">02</span><div><h4 class="text-xl font-black tracking-tight text-white m-0">Atrybucja Orbitalna (MMP)</h4><span class="text-xs font-mono text-emerald-400 uppercase tracking-widest block mt-1">Z jakiej planety przyleciał?</span></div></div><p class="text-sm font-semibold text-emerald-100/90 mb-4">Która planeta (sieć reklamowa) wysłała użytkownika do naszego systemu?</p><p class="text-sm text-emerald-200/60 leading-relaxed mb-6">Koncentruje się na <strong>nawigacji i ruchu międzyplanetarnym</strong>. Łączy przerwany lot przez czarną dziurę (sklep) i deduplikuje źródła.</p></div><div class="space-y-4 relative z-10"><div class="bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-4 backdrop-blur-md"><span class="text-xs font-mono text-emerald-400 block mb-1">Dedykowane narzędzie:</span><strong class="text-sm text-white">Mobile Measurement Partner (MMP)</strong></div><div class="flex flex-wrap gap-1.5"><span class="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[10px] rounded-full">MMP SDK</span><span class="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[10px] rounded-full">Deduplikacja</span></div></div></div></div><div class="w-full border border-white/10 bg-[#050510] rounded-2xl p-6 text-center mt-8 relative overflow-hidden"><div class="absolute -right-12 -top-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div><p class="text-sm font-semibold text-white/90 m-0 relative z-10">🚀 <strong>Kluczowy wniosek:</strong> Te dwa systemy nie konkurują ze sobą – tworzą pełny obraz układu słonecznego. GA4 bada słońce, a MMP nawiguje ruchem na orbitach.</p></div></div>`
);

// Replace Checklist 
content = content.replace(
  /<div class="grid gap-4 sm:grid-cols-2 my-8">[\s\S]*?<\/div>\n<\/div>/,
  `<div class="grid gap-4 sm:grid-cols-2 my-8">
${[
  { title: "Sonda Firebase SDK", desc: "Zainstalowano SDK w centrum układu (aplikacji) dla iOS i Androida." },
  { title: "Mapowanie sygnałów", desc: "Ustalono jednolitą taksonomię zdarzeń (onboarding, rejestracja, trial, zakup)." },
  { title: "Grawitacja Referrer API", desc: "Wdrożono obsługę Google Play Install Referrer na Androidzie." },
  { title: "Tunele czasoprzestrzenne", desc: "Skonfigurowano deep linking i deferred deep linking (Universal Links)." },
  { title: "Osłony ATT & SKAN", desc: "Zaimplementowano okno ATT oraz schemat wartości konwersji na iOS." },
  { title: "Zasoby (Płatności)", desc: "Zintegrowano system płatności z orbitującą analityką." },
  { title: "Stacja Badawcza MMP", desc: "Połączono MMP z planetami (sieciami) i skonfigurowano postbacki." },
  { title: "Koszty Ekspedycji", desc: "Zweryfikowano poprawność przesyłania danych kosztowych (Ad Spend)." }
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
<p class="text-base text-purple-100 font-bold m-0 mb-5 relative z-10">🌌 Chcesz zobaczyć pełnoekranową symulację układu atrybucyjnego?</p>
<a href="/pl/tools/attribution-map" class="relative z-10 inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-black transition-all no-underline shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:-translate-y-1">Otwórz kosmiczną mapę atrybucji →</a>
</div>`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Article updated with cosmic styling.');
