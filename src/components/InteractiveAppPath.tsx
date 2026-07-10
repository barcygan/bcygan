"use client";

import { useState } from "react";

type Lang = "pl" | "en";
type PerspectiveId = "ga4" | "mmp" | "skan";
type HighlightType = "success" | "warning" | "danger" | "info" | "dead";

interface CampaignContext {
  platform: string;
  platformIcon: string;
  adType: string;
  params: { key: string; value: string; color: string }[];
  clickUrl: string;
}

interface StepDetail {
  id: string;
  icon: string;
  label: string;
  sublabel: string;
  isCritical?: boolean;
}

interface PerspectiveStep {
  stepId: string;
  visible: boolean;
  highlight: HighlightType;
  // What data is preserved or lost at this step for this perspective
  dataState: {
    label: string;
    value: string;
    status: "ok" | "lost" | "partial" | "delayed" | "anonymous";
  }[];
  note: string;
}

interface Perspective {
  id: PerspectiveId;
  label: string;
  borderColor: string;
  textColor: string;
  badgeColor: string;
  ringColor: string;
  description: string;
  steps: PerspectiveStep[];
  summary: string;
  summaryIcon: string;
}

const highlightStyles: Record<HighlightType, string> = {
  success: "border-green-500/50 bg-green-950/20 shadow-[0_0_25px_rgba(34,197,94,0.1)]",
  warning: "border-yellow-500/50 bg-yellow-950/20 shadow-[0_0_25px_rgba(234,179,8,0.1)]",
  danger:  "border-red-500/50 bg-red-950/20 shadow-[0_0_25px_rgba(239,68,68,0.1)]",
  info:    "border-blue-500/50 bg-blue-950/20 shadow-[0_0_25px_rgba(59,130,246,0.1)]",
  dead:    "border-border/20 bg-card/5",
};

const highlightDot: Record<HighlightType, string> = {
  success: "bg-green-400",
  warning: "bg-yellow-400",
  danger:  "bg-red-400",
  info:    "bg-blue-400",
  dead:    "bg-border/40",
};

const statusBadge: Record<string, string> = {
  ok:        "bg-green-500/15 text-green-400 border-green-500/30",
  lost:      "bg-red-500/15 text-red-400 border-red-500/30 line-through opacity-60",
  partial:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  delayed:   "bg-blue-500/15 text-blue-400 border-blue-500/30",
  anonymous: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

const statusIcon: Record<string, string> = {
  ok:        "✅",
  lost:      "❌",
  partial:   "⚠️",
  delayed:   "⏳",
  anonymous: "🎭",
};

const campaignContext: CampaignContext = {
  platform: "Meta Ads",
  platformIcon: "📘",
  adType: "App Install Campaign",
  params: [
    { key: "utm_source",   value: "meta",              color: "text-blue-400" },
    { key: "utm_medium",   value: "cpc",               color: "text-purple-400" },
    { key: "utm_campaign", value: "testowa_kampania",  color: "text-orange-400" },
    { key: "utm_content",  value: "kreacja_video_v2",  color: "text-cyan-400" },
    { key: "utm_term",     value: "fitness_app_pl",    color: "text-pink-400" },
  ],
  clickUrl: "https://link.twojapp.com/install?utm_source=meta&utm_medium=cpc&utm_campaign=testowa_kampania",
};

const content = {
  pl: {
    title: "Interaktywna Mapa Atrybucji",
    subtitle: "Scenariusz: użytkownik klika reklamę w Meta Ads. Wybierz perspektywę i kliknij węzeł, aby śledzić dane kampanii przez całą ścieżkę.",
    perspectiveLabel: "Perspektywa systemu:",
    campaignTitle: "Kontekst kampanii",
    campaignDesc: "Użytkownik widzi reklamę i klika. To jest punkt startowy — sprawdź, co dzieje się z danymi kampanii dalej.",
    urlLabel: "Link z reklamy:",
    dataFlowLabel: "Stan danych kampanii:",
    noDataMsg: "Brak danych kampanii dostępnych dla tej perspektywy na tym etapie.",
    legendLabels: {
      ok: "Dane zachowane", lost: "Dane utracone", partial: "Dane częściowe",
      delayed: "Dane opóźnione", anonymous: "Dane zanonimizowane",
    },
    steps: [
      { id: "ad",         icon: "📣", label: "Reklama",     sublabel: "Kliknięcie w Meta Ads" },
      { id: "store",      icon: "🏬", label: "Sklep",       sublabel: "App Store / Google Play" },
      { id: "install",    icon: "⛓️", label: "Instalacja",  sublabel: "Czarna dziura atrybucji", isCritical: true },
      { id: "first_open", icon: "🚀", label: "first_open",  sublabel: "Pierwsze uruchomienie" },
      { id: "conversion", icon: "💰", label: "Konwersja",   sublabel: "Zakup / Subskrypcja" },
    ] as StepDetail[],
    perspectives: [
      {
        id: "ga4" as PerspectiveId,
        label: "GA4 / Firebase",
        borderColor: "border-orange-500/40",
        textColor: "text-orange-400",
        badgeColor: "bg-orange-500/10",
        ringColor: "ring-orange-500/40",
        description: "Firebase SDK mierzy zachowanie użytkownika wewnątrz aplikacji — ale zaczyna działać dopiero od pierwszego uruchomienia. Dane kampanii mogą bezpowrotnie zaginąć przed tym momentem.",
        steps: [
          {
            stepId: "ad", visible: false, highlight: "dead",
            dataState: [],
            note: "GA4/Firebase nie jest w żaden sposób zaangażowany na tym etapie. Kliknięcie reklamy jest rejestrowane przez piksel Meta i serwer MMP — nie przez SDK Firebase.",
          },
          {
            stepId: "store", visible: false, highlight: "dead",
            dataState: [],
            note: "Sklep App Store lub Google Play to zamknięte silosy. Firebase SDK nie ma tu dostępu. Parametry UTM z linku reklamowego są odcinane na granicy sklepu.",
          },
          {
            stepId: "install", visible: false, highlight: "warning",
            dataState: [
              { label: "utm_campaign", value: "testowa_kampania", status: "partial" },
              { label: "utm_source",   value: "meta",             status: "partial" },
              { label: "Install Referrer (Android)", value: "dostępny przy właściwej konfiguracji", status: "partial" },
              { label: "iOS (App Store)", value: "❌ brak natywnej metody", status: "lost" },
            ],
            note: "Na Androidzie Google Play Install Referrer może przekazać parametry UTM — ale tylko jeśli link prowadził przez Google Play i aplikacja jest odpowiednio skonfigurowana. Na iOS ten mechanizm po prostu nie istnieje.",
          },
          {
            stepId: "first_open", visible: true, highlight: "warning",
            dataState: [
              { label: "utm_campaign", value: "(direct)",          status: "lost" },
              { label: "utm_source",   value: "(none)",            status: "lost" },
              { label: "Zdarzenie",    value: "first_open ✓",      status: "ok" },
              { label: "Sesja",        value: "Zarejestrowana ✓",  status: "ok" },
            ],
            note: "GA4 rejestruje zdarzenie first_open — wie, że aplikacja została uruchomiona. Ale bez Install Referrer lub integracji z MMP, źródło pozyskania pojawia się jako (direct) / (none). Kampania 'testowa_kampania' jest niewidoczna.",
          },
          {
            stepId: "conversion", visible: true, highlight: "success",
            dataState: [
              { label: "utm_campaign",   value: "(direct)",          status: "lost" },
              { label: "Zdarzenie",      value: "purchase ✓",        status: "ok" },
              { label: "Wartość",        value: "49.99 PLN ✓",       status: "ok" },
              { label: "Atrybucja do kampanii", value: "niemożliwa bez MMP", status: "lost" },
            ],
            note: "GA4 bezbłędnie rejestruje zakup i jego wartość. Jednak bez prawidłowej atrybucji w raporcie widnieje (direct), a kampania 'testowa_kampania' nie otrzymuje żadnego kredytu za konwersję.",
          },
        ] as PerspectiveStep[],
        summary: "GA4 widzi użytkownika, ale nie wie skąd przyszedł. Kampania 'testowa_kampania' generuje instalacje i zakupy, lecz w raportach GA4 cały ten ruch pojawia się jako bezpośredni (direct).",
        summaryIcon: "🔶",
      },
      {
        id: "mmp" as PerspectiveId,
        label: "MMP (AppsFlyer / Adjust)",
        borderColor: "border-green-500/40",
        textColor: "text-green-400",
        badgeColor: "bg-green-500/10",
        ringColor: "ring-green-500/40",
        description: "MMP specjalizuje się w łączeniu kliknięcia reklamy z instalacją pomimo przerwy w sklepie. To jedyne narzędzie, które widzi pełną ścieżkę z kontekstem kampanii.",
        steps: [
          {
            stepId: "ad", visible: true, highlight: "success",
            dataState: [
              { label: "utm_campaign", value: "testowa_kampania",  status: "ok" },
              { label: "utm_source",   value: "meta",              status: "ok" },
              { label: "utm_content",  value: "kreacja_video_v2",  status: "ok" },
              { label: "Click ID",     value: "c3f8a29b1d...",     status: "ok" },
              { label: "Device IP",    value: "zapamiętany",       status: "ok" },
            ],
            note: "MMP rejestruje kliknięcie z pełnym kontekstem: parametry UTM, Click ID z Meta, fingerprint urządzenia (IP, User-Agent). Wszystko to jest zapisane na serwerach MMP i czeka na dopasowanie do instalacji.",
          },
          {
            stepId: "store", visible: true, highlight: "info",
            dataState: [
              { label: "Deferred Deep Link", value: "iOS: schowek / SKAN",  status: "partial" },
              { label: "Play Install Referrer", value: "Android: aktywny",  status: "ok" },
              { label: "utm_campaign",       value: "przekazany przez DDL", status: "partial" },
            ],
            note: "MMP używa Deferred Deep Linking. Na Androidzie: Play Install Referrer pewnie przenosi UTM. Na iOS: dane kampanii są zakodowane w schowku (Pasteboard) lub przesyłane przez SKAdNetwork — z ograniczeniami prywatnościowymi.",
          },
          {
            stepId: "install", visible: true, highlight: "success",
            dataState: [
              { label: "utm_campaign", value: "testowa_kampania ✓", status: "ok" },
              { label: "utm_source",   value: "meta ✓",             status: "ok" },
              { label: "utm_content",  value: "kreacja_video_v2 ✓", status: "ok" },
              { label: "Atrybucja",    value: "deterministyczna",   status: "ok" },
              { label: "Postback",     value: "→ wysłany do Meta",  status: "ok" },
            ],
            note: "Klucz moment! SDK MMP budzi się przy pierwszym uruchomieniu, odpytuje serwer MMP i dopasowuje tę instalację do kliknięcia z 'testowa_kampania'. Postback instalacyjny trafia z powrotem do Meta Ads.",
          },
          {
            stepId: "first_open", visible: true, highlight: "success",
            dataState: [
              { label: "utm_campaign", value: "testowa_kampania ✓",  status: "ok" },
              { label: "Atrybucja",    value: "potwierdzona ✓",      status: "ok" },
              { label: "Postback",     value: "→ wysłany do GA4",    status: "ok" },
              { label: "Raport MMP",   value: "Instalacje: +1",      status: "ok" },
            ],
            note: "MMP rejestruje first_open i przypisuje go do kampanii 'testowa_kampania'. Te dane trafiają do dashboardu MMP oraz są odsyłane do GA4 przez integrację, wzbogacając raporty o źródło pozyskania.",
          },
          {
            stepId: "conversion", visible: true, highlight: "success",
            dataState: [
              { label: "utm_campaign", value: "testowa_kampania ✓",     status: "ok" },
              { label: "Przychód",     value: "49.99 PLN → Meta CAPI",  status: "ok" },
              { label: "ROAS",         value: "obliczony ✓",            status: "ok" },
              { label: "Postback",     value: "→ Meta / Google Ads",    status: "ok" },
            ],
            note: "Pełna atrybucja konwersji. MMP wie, że kupujący pochodzi z 'testowa_kampania', kreacji 'kreacja_video_v2'. Postback konwersji trafia do Meta CAPI — umożliwiając optymalizację ROAS i algorytmów aukcji reklamowej.",
          },
        ] as PerspectiveStep[],
        summary: "MMP widzi pełną ścieżkę kampanii 'testowa_kampania': kliknięcie → instalacja → konwersja. Jest to jedyne źródło prawdy dla wielokanałowej atrybucji mobilnej.",
        summaryIcon: "🟢",
      },
      {
        id: "skan" as PerspectiveId,
        label: "SKAdNetwork / AdAttributionKit",
        borderColor: "border-blue-500/40",
        textColor: "text-blue-400",
        badgeColor: "bg-blue-500/10",
        ringColor: "ring-blue-500/40",
        description: "Apple SKAdNetwork to system pomiaru iOS chroniący prywatność. Widzi ścieżkę, ale dane są zanonimizowane, zagregowane i dostarczane z opóźnieniem.",
        steps: [
          {
            stepId: "ad", visible: true, highlight: "info",
            dataState: [
              { label: "utm_campaign",  value: "testowa_kampania",  status: "ok" },
              { label: "SKAN Network ID", value: "zarejestrowany przez Meta", status: "ok" },
              { label: "Podpis crypto", value: "Apple weryfikuje",  status: "ok" },
              { label: "User ID",       value: "❌ niedostępny",    status: "anonymous" },
            ],
            note: "Meta Ads podpisuje kryptograficznie kliknięcie używając swojego SKAN Network ID zarejestrowanego u Apple. Dane kampanii istnieją, ale nie ma identyfikatora użytkownika — to celowy design.",
          },
          {
            stepId: "store", visible: true, highlight: "success",
            dataState: [
              { label: "Instalacja", value: "rejestrowana przez iOS ✓",  status: "ok" },
              { label: "SKAN podpis", value: "weryfikowany przez Apple",  status: "ok" },
              { label: "Timer",       value: "24h – 35 dni (aktywowany)", status: "delayed" },
            ],
            note: "App Store ma wbudowaną obsługę SKAdNetwork. Pobieranie i instalacja są rejestrowane na poziomie systemu iOS — bez żadnych SDK. Timer postbacku zaczyna odliczać.",
          },
          {
            stepId: "install", visible: true, highlight: "info",
            dataState: [
              { label: "Instalacja",  value: "potwierdzona przez iOS ✓", status: "ok" },
              { label: "Campaign ID", value: "1-100 (numeryczny tylko)", status: "partial" },
              { label: "utm_campaign", value: "niedostępny bezpośrednio", status: "anonymous" },
              { label: "User ID",     value: "❌ brak",                  status: "lost" },
            ],
            note: "iOS potwierdza, że instalacja nastąpiła po kliknięciu podpisanej reklamy Meta. Jednak zamiast 'testowa_kampania' system zna tylko numeryczny Campaign ID (np. 42) zmapowany wcześniej przez Meta.",
          },
          {
            stepId: "first_open", visible: true, highlight: "warning",
            dataState: [
              { label: "Conversion Value", value: "CV ustawiony przez app",  status: "partial" },
              { label: "Postback",         value: "⏳ wysłany po timerze",  status: "delayed" },
              { label: "utm_campaign",     value: "brak (tylko Campaign ID)", status: "anonymous" },
              { label: "User identyfikacja", value: "🎭 niemożliwa",        status: "anonymous" },
            ],
            note: "Aplikacja ustawia Conversion Value (0–63) na podstawie aktywności użytkownika. Po upływie timera Apple wysyła anonimowy postback do Meta. Nie ma ID użytkownika, nie ma 'testowa_kampania' — tylko zagregowane statystyki.",
          },
          {
            stepId: "conversion", visible: true, highlight: "warning",
            dataState: [
              { label: "SKAN postback 3",  value: "⏳ do 35 dni opóźnienia", status: "delayed" },
              { label: "Wartość zakupu",   value: "zaokrąglona do progu",    status: "anonymous" },
              { label: "Crowd anonymity",  value: "min. próg użytkowników",  status: "delayed" },
              { label: "Atrybucja 1:1",    value: "❌ niemożliwa",           status: "lost" },
            ],
            note: "SKAN 4.0 może wysłać do 3 postbacków. Konwersja jest raportowana, ale tylko zagregowanie — jeśli kampania ma wystarczającą liczbę konwersji (crowd anonymity threshold). Dane mogą przyjść kilkadziesiąt dni po zdarzeniu.",
          },
        ] as PerspectiveStep[],
        summary: "SKAdNetwork widzi ścieżkę iOS dla kampanii Meta, ale zamiast 'testowa_kampania' operuje tylko na numerycznych Campaign ID, bez User ID, z opóźnieniem i zaokrąglonymi wartościami.",
        summaryIcon: "🍏",
      },
    ] as Perspective[],
  },
  en: {
    title: "Interactive Attribution Map",
    subtitle: "Scenario: a user clicks an ad in Meta Ads. Choose a perspective and click a node to trace campaign data through the entire path.",
    perspectiveLabel: "System perspective:",
    campaignTitle: "Campaign Context",
    campaignDesc: "A user sees your ad and clicks it. This is the starting point — follow the campaign data as it travels (or disappears) through the funnel.",
    urlLabel: "Ad link:",
    dataFlowLabel: "Campaign data state:",
    noDataMsg: "No campaign data is available for this perspective at this stage.",
    legendLabels: {
      ok: "Data preserved", lost: "Data lost", partial: "Partial data",
      delayed: "Delayed data", anonymous: "Anonymised data",
    },
    steps: [
      { id: "ad",         icon: "📣", label: "Ad",          sublabel: "Click in Meta Ads" },
      { id: "store",      icon: "🏬", label: "Store",       sublabel: "App Store / Google Play" },
      { id: "install",    icon: "⛓️", label: "Install",     sublabel: "Attribution Black Hole", isCritical: true },
      { id: "first_open", icon: "🚀", label: "first_open",  sublabel: "First Launch" },
      { id: "conversion", icon: "💰", label: "Conversion",  sublabel: "Purchase / Subscription" },
    ] as StepDetail[],
    perspectives: [
      {
        id: "ga4" as PerspectiveId,
        label: "GA4 / Firebase",
        borderColor: "border-orange-500/40",
        textColor: "text-orange-400",
        badgeColor: "bg-orange-500/10",
        ringColor: "ring-orange-500/40",
        description: "Firebase SDK measures user behaviour inside the app — but only starts working from the first launch. Campaign data can be permanently lost before this moment.",
        steps: [
          {
            stepId: "ad", visible: false, highlight: "dead",
            dataState: [],
            note: "GA4/Firebase has no involvement at this stage. The ad click is registered by the Meta pixel and MMP server — not by the Firebase SDK.",
          },
          {
            stepId: "store", visible: false, highlight: "dead",
            dataState: [],
            note: "The App Store and Google Play are closed silos. Firebase SDK has no access here. UTM parameters from the ad link are cut off at the store boundary.",
          },
          {
            stepId: "install", visible: false, highlight: "warning",
            dataState: [
              { label: "utm_campaign", value: "testowa_kampania", status: "partial" },
              { label: "utm_source",   value: "meta",             status: "partial" },
              { label: "Install Referrer (Android)", value: "available with correct config", status: "partial" },
              { label: "iOS (App Store)", value: "❌ no native method", status: "lost" },
            ],
            note: "On Android, Google Play Install Referrer can pass UTM parameters — but only if the link went through Google Play and the app is correctly configured. On iOS, this mechanism simply doesn't exist.",
          },
          {
            stepId: "first_open", visible: true, highlight: "warning",
            dataState: [
              { label: "utm_campaign", value: "(direct)",         status: "lost" },
              { label: "utm_source",   value: "(none)",           status: "lost" },
              { label: "Event",        value: "first_open ✓",     status: "ok" },
              { label: "Session",      value: "Recorded ✓",       status: "ok" },
            ],
            note: "GA4 records the first_open event — it knows the app was launched. But without Install Referrer or MMP integration, the acquisition source shows as (direct) / (none). The 'testowa_kampania' campaign is invisible.",
          },
          {
            stepId: "conversion", visible: true, highlight: "success",
            dataState: [
              { label: "utm_campaign",        value: "(direct)",              status: "lost" },
              { label: "Event",               value: "purchase ✓",            status: "ok" },
              { label: "Value",               value: "49.99 PLN ✓",           status: "ok" },
              { label: "Campaign attribution", value: "impossible without MMP", status: "lost" },
            ],
            note: "GA4 perfectly records the purchase and its value. But without proper attribution, the report shows (direct), and 'testowa_kampania' receives no credit for the conversion.",
          },
        ] as PerspectiveStep[],
        summary: "GA4 sees the user but doesn't know where they came from. The 'testowa_kampania' campaign generates installs and purchases, but in GA4 reports all this traffic appears as direct.",
        summaryIcon: "🔶",
      },
      {
        id: "mmp" as PerspectiveId,
        label: "MMP (AppsFlyer / Adjust)",
        borderColor: "border-green-500/40",
        textColor: "text-green-400",
        badgeColor: "bg-green-500/10",
        ringColor: "ring-green-500/40",
        description: "MMP specialises in connecting the ad click to the install despite the store gap. It's the only tool that sees the complete path with campaign context.",
        steps: [
          {
            stepId: "ad", visible: true, highlight: "success",
            dataState: [
              { label: "utm_campaign", value: "testowa_kampania",  status: "ok" },
              { label: "utm_source",   value: "meta",              status: "ok" },
              { label: "utm_content",  value: "kreacja_video_v2",  status: "ok" },
              { label: "Click ID",     value: "c3f8a29b1d...",     status: "ok" },
              { label: "Device IP",    value: "stored",            status: "ok" },
            ],
            note: "MMP records the click with full context: UTM parameters, Meta Click ID, device fingerprint (IP, User-Agent). All of this is saved on MMP servers, waiting to be matched to an install.",
          },
          {
            stepId: "store", visible: true, highlight: "info",
            dataState: [
              { label: "Deferred Deep Link", value: "iOS: clipboard / SKAN",  status: "partial" },
              { label: "Play Install Referrer", value: "Android: active",     status: "ok" },
              { label: "utm_campaign",       value: "carried via DDL",        status: "partial" },
            ],
            note: "MMP uses Deferred Deep Linking. On Android: Play Install Referrer reliably carries UTMs. On iOS: campaign data is encoded in the clipboard (Pasteboard) or sent via SKAdNetwork — with privacy limitations.",
          },
          {
            stepId: "install", visible: true, highlight: "success",
            dataState: [
              { label: "utm_campaign", value: "testowa_kampania ✓", status: "ok" },
              { label: "utm_source",   value: "meta ✓",             status: "ok" },
              { label: "utm_content",  value: "kreacja_video_v2 ✓", status: "ok" },
              { label: "Attribution",  value: "deterministic",      status: "ok" },
              { label: "Postback",     value: "→ sent to Meta",     status: "ok" },
            ],
            note: "Key moment! The MMP SDK wakes up at first launch, queries the MMP server and matches this install to the 'testowa_kampania' click. An install postback is sent back to Meta Ads.",
          },
          {
            stepId: "first_open", visible: true, highlight: "success",
            dataState: [
              { label: "utm_campaign", value: "testowa_kampania ✓",  status: "ok" },
              { label: "Attribution",  value: "confirmed ✓",         status: "ok" },
              { label: "Postback",     value: "→ sent to GA4",       status: "ok" },
              { label: "MMP Report",   value: "Installs: +1",        status: "ok" },
            ],
            note: "MMP records first_open and attributes it to 'testowa_kampania'. This data goes to the MMP dashboard and is sent back to GA4 via integration, enriching reports with the acquisition source.",
          },
          {
            stepId: "conversion", visible: true, highlight: "success",
            dataState: [
              { label: "utm_campaign", value: "testowa_kampania ✓",   status: "ok" },
              { label: "Revenue",      value: "49.99 PLN → Meta CAPI", status: "ok" },
              { label: "ROAS",         value: "calculated ✓",         status: "ok" },
              { label: "Postback",     value: "→ Meta / Google Ads",  status: "ok" },
            ],
            note: "Full conversion attribution. MMP knows the buyer came from 'testowa_kampania', creative 'kreacja_video_v2'. Conversion postback goes to Meta CAPI — enabling ROAS optimisation and ad auction algorithm learning.",
          },
        ] as PerspectiveStep[],
        summary: "MMP sees the complete journey for 'testowa_kampania': click → install → conversion. It is the single source of truth for mobile multi-channel attribution.",
        summaryIcon: "🟢",
      },
      {
        id: "skan" as PerspectiveId,
        label: "SKAdNetwork / AdAttributionKit",
        borderColor: "border-blue-500/40",
        textColor: "text-blue-400",
        badgeColor: "bg-blue-500/10",
        ringColor: "ring-blue-500/40",
        description: "Apple SKAdNetwork is a privacy-preserving iOS measurement system. It sees the path, but data is anonymised, aggregated and delivered with a delay.",
        steps: [
          {
            stepId: "ad", visible: true, highlight: "info",
            dataState: [
              { label: "utm_campaign",    value: "testowa_kampania",  status: "ok" },
              { label: "SKAN Network ID", value: "registered by Meta", status: "ok" },
              { label: "Crypto signature", value: "Apple verifies",   status: "ok" },
              { label: "User ID",         value: "❌ unavailable",    status: "anonymous" },
            ],
            note: "Meta Ads cryptographically signs the click using its SKAN Network ID registered with Apple. Campaign data exists but there is no user identifier — this is by design.",
          },
          {
            stepId: "store", visible: true, highlight: "success",
            dataState: [
              { label: "Install",       value: "registered by iOS ✓",     status: "ok" },
              { label: "SKAN signature", value: "verified by Apple",      status: "ok" },
              { label: "Timer",         value: "24h – 35 days (started)", status: "delayed" },
            ],
            note: "The App Store has built-in SKAdNetwork support. Downloads and installs are registered at the iOS system level — no SDK required. The postback timer starts counting.",
          },
          {
            stepId: "install", visible: true, highlight: "info",
            dataState: [
              { label: "Install",      value: "confirmed by iOS ✓",    status: "ok" },
              { label: "Campaign ID",  value: "1–100 (numeric only)",  status: "partial" },
              { label: "utm_campaign", value: "not directly available", status: "anonymous" },
              { label: "User ID",      value: "❌ none",               status: "lost" },
            ],
            note: "iOS confirms the install followed a signed Meta ad click. However, instead of 'testowa_kampania', the system only knows a numeric Campaign ID (e.g. 42) pre-mapped by Meta.",
          },
          {
            stepId: "first_open", visible: true, highlight: "warning",
            dataState: [
              { label: "Conversion Value", value: "CV set by app",         status: "partial" },
              { label: "Postback",         value: "⏳ sent after timer",   status: "delayed" },
              { label: "utm_campaign",     value: "absent (only Camp. ID)", status: "anonymous" },
              { label: "User identification", value: "🎭 impossible",      status: "anonymous" },
            ],
            note: "The app sets a Conversion Value (0–63) based on user activity. After the timer expires, Apple sends an anonymous postback to Meta. No user ID, no 'testowa_kampania' — only aggregated statistics.",
          },
          {
            stepId: "conversion", visible: true, highlight: "warning",
            dataState: [
              { label: "SKAN postback 3",  value: "⏳ up to 35-day delay",  status: "delayed" },
              { label: "Purchase value",   value: "rounded to threshold",   status: "anonymous" },
              { label: "Crowd anonymity",  value: "min. user threshold",    status: "delayed" },
              { label: "1:1 attribution",  value: "❌ impossible",          status: "lost" },
            ],
            note: "SKAN 4.0 can send up to 3 postbacks. Conversion is reported, but only in aggregate — if the campaign has enough conversions (crowd anonymity threshold). Data may arrive dozens of days after the event.",
          },
        ] as PerspectiveStep[],
        summary: "SKAdNetwork sees the iOS path for the Meta campaign, but instead of 'testowa_kampania' it only works with numeric Campaign IDs, without User IDs, with delays and rounded values.",
        summaryIcon: "🍏",
      },
    ] as Perspective[],
  },
};

interface InteractiveAppPathProps {
  lang?: Lang;
}

export function InteractiveAppPath({ lang = "pl" }: InteractiveAppPathProps) {
  const t = content[lang] || content.pl;
  const [activePerspective, setActivePerspective] = useState<PerspectiveId>("mmp");
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const perspective = t.perspectives.find((p) => p.id === activePerspective)!;
  const getPerspectiveStep = (stepId: string) =>
    perspective.steps.find((s) => s.stepId === stepId);

  const activeStepData = activeStep ? t.steps.find((s) => s.id === activeStep) : null;
  const activePerspectiveStep = activeStep ? getPerspectiveStep(activeStep) : null;

  return (
    <div className="my-12 not-prose select-none">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Interactive
        </div>
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
          {t.title}
        </h3>
        <p className="text-sm text-white/60 max-w-2xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Campaign Context Card */}
      <div className="mb-8 rounded-2xl border border-border/40 bg-card/20 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border/30 bg-card/30">
          <span className="text-lg">{campaignContext.platformIcon}</span>
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-widest">
              {t.campaignTitle}
            </span>
            <span className="ml-2 text-xs text-white/40">— {campaignContext.platform} · {campaignContext.adType}</span>
          </div>
        </div>
        <div className="p-5">
          <p className="text-xs text-white/50 mb-4">{t.campaignDesc}</p>
          {/* URL strip */}
          <div className="mb-4">
            <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1.5">{t.urlLabel}</div>
            <div className="flex flex-wrap items-center gap-1 font-mono text-[11px] bg-black/30 rounded-xl px-3 py-2.5 border border-border/30">
              <span className="text-white/40">https://link.twojapp.com/install?</span>
              {campaignContext.params.map((p, i) => (
                <span key={p.key} className="whitespace-nowrap">
                  <span className="text-white/30">{p.key}=</span>
                  <span className={`font-bold ${p.color}`}>{p.value}</span>
                  {i < campaignContext.params.length - 1 && <span className="text-white/20">&</span>}
                </span>
              ))}
            </div>
          </div>
          {/* Params grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {campaignContext.params.map((p) => (
              <div key={p.key} className="rounded-xl bg-black/20 border border-border/20 p-2.5">
                <div className="text-[9px] font-mono text-white/30 uppercase mb-0.5">{p.key}</div>
                <div className={`text-xs font-bold truncate ${p.color}`}>{p.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Perspective Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
        <span className="text-[11px] font-mono text-white/30 uppercase tracking-widest shrink-0">
          {t.perspectiveLabel}
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {t.perspectives.map((p) => (
            <button
              key={p.id}
              onClick={() => { setActivePerspective(p.id); setActiveStep(null); }}
              className={[
                "px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300 cursor-pointer",
                activePerspective === p.id
                  ? `${p.borderColor} ${p.badgeColor} ${p.textColor} shadow-lg scale-105 ring-1 ${p.ringColor}`
                  : "border-border/30 bg-card/10 text-white/40 hover:border-border/60 hover:text-white/70",
              ].join(" ")}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Perspective Description */}
      <div className={`mb-6 px-5 py-4 rounded-2xl border text-xs text-white/60 leading-relaxed transition-all duration-500 ${perspective.borderColor} ${perspective.badgeColor}`}>
        <span className={`font-bold ${perspective.textColor}`}>{perspective.label}: </span>
        {perspective.description}
      </div>

      {/* Timeline */}
      <div className="relative mb-6 px-2">
        {/* Connection line desktop */}
        <div className="hidden sm:block absolute top-10 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-border/50 to-transparent z-0" />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-3 sm:gap-2 relative z-10">
          {t.steps.map((step, index) => {
            const pStep = getPerspectiveStep(step.id);
            const isVisible = pStep?.visible ?? false;
            const isActive = activeStep === step.id;
            const highlight = pStep?.highlight ?? "dead";

            return (
              <div key={step.id} className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 flex-1 min-w-0">
                <button
                  onClick={() => setActiveStep(isActive ? null : step.id)}
                  className={[
                    "relative flex flex-col items-center justify-center w-20 h-20 sm:w-[4.5rem] sm:h-[4.5rem] rounded-2xl border-2 transition-all duration-300 cursor-pointer group shrink-0",
                    isActive
                      ? `${highlightStyles[highlight]} scale-110 shadow-xl`
                      : isVisible
                        ? `border-border/40 bg-card/20 hover:scale-105 hover:shadow-lg hover:${perspective.borderColor}`
                        : "border-border/15 bg-card/5 opacity-35 hover:opacity-50 hover:scale-105",
                    step.isCritical && !isActive ? "border-dashed border-red-500/40" : "",
                  ].join(" ")}
                  title={step.sublabel}
                >
                  {/* dot indicator */}
                  {isVisible && (
                    <span className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2 border-background ${highlightDot[highlight]}`} />
                  )}
                  <span className="text-2xl sm:text-xl">{step.icon}</span>
                  {step.isCritical && (
                    <span className="absolute -bottom-1 -right-1 text-[9px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-black">!</span>
                  )}
                </button>

                {/* Mobile arrow */}
                {index < t.steps.length - 1 && (
                  <div className="sm:hidden text-border/50 text-sm">↓</div>
                )}

                {/* Label */}
                <div className="flex-1 sm:flex-initial text-left sm:text-center min-w-0">
                  <div className={`text-[11px] font-bold truncate ${isVisible ? "text-white" : "text-white/30"}`}>
                    {step.label}
                  </div>
                  <div className="text-[9px] text-white/30 mt-0.5 leading-tight hidden sm:block">
                    {step.sublabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Detail Panel */}
      <div className={`transition-all duration-400 overflow-hidden ${activeStepData ? "max-h-[600px] opacity-100 mb-6" : "max-h-0 opacity-0 mb-0"}`}>
        {activeStepData && activePerspectiveStep && (
          <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${highlightStyles[activePerspectiveStep.highlight]}`}>
            {/* Panel header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border/20">
              <span className="text-2xl">{activeStepData.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-sm font-black text-white">{activeStepData.label}</span>
                  <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${perspective.badgeColor} ${perspective.textColor} ${perspective.borderColor}`}>
                    {perspective.label}
                  </span>
                </div>
                <div className="text-[10px] text-white/40 mt-0.5">{activeStepData.sublabel}</div>
              </div>
            </div>

            {/* Data flow table */}
            {activePerspectiveStep.dataState.length > 0 && (
              <div className="px-5 py-4 border-b border-border/20">
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-3">{t.dataFlowLabel}</div>
                <div className="space-y-2">
                  {activePerspectiveStep.dataState.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-white/40 w-36 shrink-0 truncate">{d.label}</span>
                      <span className="text-white/20">→</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-mono font-semibold ${statusBadge[d.status]}`}>
                        <span>{statusIcon[d.status]}</span>
                        <span className="truncate max-w-[160px]">{d.value}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Note */}
            <div className="px-5 py-4">
              <p className="text-xs text-white/70 leading-relaxed m-0">
                {activePerspectiveStep.note}
              </p>
            </div>
          </div>
        )}
        {activeStepData && (!activePerspectiveStep || activePerspectiveStep.dataState.length === 0) && (
          <div className="rounded-2xl border border-border/20 bg-card/10 p-5">
            <p className="text-xs text-white/40 m-0">{t.noDataMsg}</p>
          </div>
        )}
      </div>

      {/* Hint when nothing selected */}
      {!activeStep && (
        <div className="text-center mb-6">
          <p className="text-[11px] text-white/25 font-mono">
            ↑ kliknij węzeł na ścieżce, aby zobaczyć stan danych kampanii
          </p>
        </div>
      )}

      {/* Summary bar */}
      <div className={`rounded-2xl border p-5 ${perspective.borderColor} ${perspective.badgeColor}`}>
        <div className="flex items-start gap-3 mb-4">
          <span className="text-xl shrink-0">{perspective.summaryIcon}</span>
          <div>
            <p className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${perspective.textColor}`}>
              {perspective.label} — podsumowanie
            </p>
            <p className="text-xs text-white/80 leading-relaxed m-0">{perspective.summary}</p>
          </div>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-3 pt-3 border-t border-border/20">
          {Object.entries(t.legendLabels).map(([status, label]) => (
            <div key={status} className="flex items-center gap-1.5 text-[10px] text-white/40">
              <span className={`w-2 h-2 rounded-full inline-block ${highlightDot[status as HighlightType] || "bg-border/40"}`} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
