"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ─── Types ─────────────────────────────────────────────────── */

type Screen = "welcome" | "journey";
type EcosystemId = "meta" | "google" | "tiktok" | "asa";

type SummaryText = { pl: string; en: string };

interface MatrixStatus {
  status: "full" | "partial" | "none" | "na";
  text: SummaryText;
}

interface EcosystemSummary {
  dataAvailability: {
    ga4: {
      android: MatrixStatus;
      ios: MatrixStatus;
    };
    mmp: {
      android: MatrixStatus;
      ios: MatrixStatus;
    };
    skan: {
      android: MatrixStatus;
      ios: MatrixStatus;
    };
  };
  benefit: SummaryText;
  risk: SummaryText;
}
type PerspectiveId = "ga4" | "mmp" | "skan";
type NodeStatus = "visible" | "partial" | "hidden" | "blackhole";

interface DataRow {
  label: string;
  value: string;
  status: "ok" | "lost" | "partial" | "delayed" | "anon";
}

interface NodePerspective {
  status: NodeStatus;
  dataState: DataRow[];
  note: string;
}

interface JourneyNode {
  id: string;
  icon: string;
  label: string;
  sublabel: (eco: EcosystemId) => string;
  isBlackHole?: boolean;
  data: Record<EcosystemId, Record<PerspectiveId, NodePerspective>>;
}

/* ─── Ecosystems ─────────────────────────────────────────────── */

import React from "react";

const MetaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[1em] h-[1em]">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const GoogleAdsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[1em] h-[1em]">
    <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44-3.66 0-6.63-2.96-6.63-6.62 0-3.66 2.97-6.62 6.63-6.62 1.79 0 3.26.65 4.34 1.63l2.06-2.11c-1.68-1.52-3.87-2.39-6.4-2.39-5.26 0-9.52 4.26-9.52 9.51s4.26 9.5 9.52 9.5c5.03 0 9.07-3.4 9.07-8.91 0-.7-.09-1.42-.25-2.16z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[1em] h-[1em]">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.04.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.33 7.31-1.9 1.57-4.54 2.22-6.95 1.55-2.73-.72-4.9-2.91-5.46-5.65-.63-3.13.43-6.49 2.91-8.32 1.95-1.43 4.49-1.81 6.77-1.1v4.13c-1.39-.34-2.96-.13-4.14.71-1.17.84-1.78 2.37-1.42 3.79.35 1.44 1.73 2.5 3.21 2.58 1.43.08 2.87-.58 3.65-1.76.71-1.07 1.05-2.4 1.03-3.69-.07-5.32-.03-10.64-.04-15.96z" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[1em] h-[1em]">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.25.68 2.96.68.74 0 1.98-.79 3.55-.66 1.8.08 3.03.74 3.9 1.96-3.22 1.83-2.67 5.76.62 7.03-.79 1.75-1.78 3.19-3.03 3.96zm-2.88-14.7c-.52 2.06-2.5 3.42-4.52 3.22.45-2.17 2.44-3.71 4.52-3.22z" />
  </svg>
);

const ECOSYSTEMS = [
  {
    id: "meta" as EcosystemId,
    icon: <MetaIcon />,
    name: "Meta Ads",
    sub: "Facebook · Instagram · Audience Network",
    color: "#1877f2",
    glow: "rgba(24,119,242,0.35)",
    dim: "rgba(24,119,242,0.12)",
    defaultCampaign: "testowa_kampania",
    badge: "Wymaga MMP + SKAN",
    badgeColor: "#f97316",
    description: "Meta wymaga MMP do atrybucji aplikacji (np. AppsFlyer, Adjust) i polega na danych ze SKAdNetwork w systemie iOS.",
    summary: {
      dataAvailability: {
        ga4: {
          android: { status: "partial", text: { pl: "Kampania ginie na start, przypisywana w tle", en: "Campaign lost at start, assigned in background" } },
          ios: { status: "none", text: { pl: "Czarna dziura. (Wymagane wdrożenie MMP)", en: "Black hole. (MMP integration required)" } }
        },
        mmp: {
          android: { status: "full", text: { pl: "Pełne (100% atrybucji deterministycznej)", en: "Full (100% deterministic attribution)" } },
          ios: { status: "partial", text: { pl: "SKAN + Własne modele (AEM / Probabilistyka)", en: "SKAN + Custom models (AEM / Probabilistic)" } }
        },
        skan: {
          android: { status: "full", text: { pl: "Play API bez opóźnień", en: "Play API with no delays" } },
          ios: { status: "partial", text: { pl: "Zanonimizowane z opóźnieniem 24-48h", en: "Anonymized with 24-48h delay" } }
        }
      },
      benefit: { pl: "Zaawansowane algorytmy optymalizacji zdarzeń (AEM) wspierające wysokiej jakości konwersje, mimo braków w deterministycznym śledzeniu.", en: "Advanced event optimization algorithms (AEM) supporting high-quality conversions despite deterministic tracking gaps." },
      risk: { pl: "Utrata pełnego lejka (direct) w klasycznym GA4 dla iOS. Silne uzależnienie od postbacków S2S (CAPI) i opóźnień SKAN.", en: "Loss of full funnel (direct) in classic GA4 for iOS. Strong reliance on S2S postbacks (CAPI) and SKAN delays." }
    }
  },
  {
    id: "google" as EcosystemId,
    icon: <img src="/logos/logo2.png" alt="Google Ads" className="w-[1em] h-[1em] object-contain drop-shadow-md" />,
    name: "Google Ads (UAC)",
    sub: "Universal App Campaign · Play Store",
    color: "#4285f4",
    glow: "rgba(66,133,244,0.35)",
    dim: "rgba(66,133,244,0.12)",
    defaultCampaign: "uac_fitness_kwiecien",
    badge: "Natywna integracja Firebase",
    badgeColor: "#22c55e",
    description: "Kampanie Google posiadają natywną integrację z Firebase i Google Play, co zapewnia bezstratną atrybucję w środowisku Android.",
    summary: {
      dataAvailability: {
        ga4: {
          android: { status: "full", text: { pl: "Pełne. Natywna więź Google Ads & Firebase", en: "Full. Native Google Ads & Firebase link" } },
          ios: { status: "none", text: { pl: "Brak. Gclid przepada w sklepie Apple", en: "None. Gclid lost in Apple App Store" } }
        },
        mmp: {
          android: { status: "full", text: { pl: "Pełne. Płynny odczyt z Referrera", en: "Full. Smooth read from Referrer" } },
          ios: { status: "partial", text: { pl: "Podatne na wahania i opóźnienia SKAN", en: "Prone to fluctuations and SKAN delays" } }
        },
        skan: {
          android: { status: "full", text: { pl: "System przekazuje gclid bezbłędnie", en: "System passes gclid flawlessly" } },
          ios: { status: "partial", text: { pl: "Uzależnienie od agregacji Apple", en: "Dependence on Apple's aggregation" } }
        }
      },
      benefit: { pl: "Bezbłędna atrybucja GA4 na Androidzie bez konieczności zewnętrznych narzędzi MMP, co obniża koszty technologiczne.", en: "Flawless GA4 attribution on Android without external MMP tools, reducing tech stack costs." },
      risk: { pl: "Słaba widoczność kampanii (w tym iOS) w bezpłatnych narzędziach analitycznych innych niż z ekosystemu Google.", en: "Poor campaign visibility (especially iOS) in non-Google ecosystem analytical tools." }
    }
  },
  {
    id: "tiktok" as EcosystemId,
    icon: <img src="/logos/tiktok-logo.png" alt="TikTok Ads" className="w-[1em] h-[1em] object-contain drop-shadow-md" />,
    name: "TikTok Ads",
    sub: "TikTok For Business · Pangle",
    color: "#fe2c55",
    glow: "rgba(254,44,85,0.35)",
    dim: "rgba(254,44,85,0.12)",
    defaultCampaign: "tt_viral_fitness",
    badge: "Wymaga MMP",
    badgeColor: "#f97316",
    description: "Brak natywnej integracji z GA4. Raportowanie instalacji i konwersji jest silnie zależne od platformy MMP oraz SKAN.",
    summary: {
      dataAvailability: {
        ga4: {
          android: { status: "none", text: { pl: "Brak zaufanej integracji. Wymagane MMP", en: "No trusted integration. MMP required" } },
          ios: { status: "none", text: { pl: "Izolacja w in-app browser zrzuca ruch", en: "In-app browser isolation drops traffic" } }
        },
        mmp: {
          android: { status: "full", text: { pl: "Skutecznie powiązane przez ttclid", en: "Successfully linked via ttclid" } },
          ios: { status: "partial", text: { pl: "Niestabilne i rygorystycznie obcinane przez iOS", en: "Unstable and strictly curtailed by iOS" } }
        },
        skan: {
          android: { status: "full", text: { pl: "Natywna zgodność z logiką Androida", en: "Native compatibility with Android logic" } },
          ios: { status: "partial", text: { pl: "Śledzenie utrudnione przez brak zgód ATT", en: "Tracking hindered by lack of ATT consent" } }
        }
      },
      benefit: { pl: "Duży potencjał konwersji ze specyficznej demografii, silne własne raportowanie self-attribution.", en: "High conversion potential from specific demographics, strong internal self-attribution reporting." },
      risk: { pl: "Brak integracji z Firebase (GA4 na iOS całkowicie ślepe na działania z TikToka). Izolacja wewnątrz In-App browser utrudnia Deferred Deep Linking.", en: "No Firebase integration (GA4 on iOS completely blind to TikTok activity). In-App browser isolation makes Deferred Deep Linking difficult." }
    }
  },
  {
    id: "asa" as EcosystemId,
    icon: <AppleIcon />,
    name: "Apple Search Ads",
    sub: "App Store · AdAttributionKit",
    color: "#a8b3cf",
    glow: "rgba(168,179,207,0.3)",
    dim: "rgba(168,179,207,0.1)",
    defaultCampaign: "search_brand_ios",
    badge: "Deterministyczne API",
    badgeColor: "#22c55e",
    description: "Atrybucja na iOS oparta o framework AdAttributionKit. Pozwala na deterministyczny pomiar z pominięciem obostrzeń ATT.",
    summary: {
      dataAvailability: {
        ga4: {
          android: { status: "na", text: { pl: "N/A (Niedostępne)", en: "N/A (Not available)" } },
          ios: { status: "full", text: { pl: "Pełne, jeśli wdrożysz AdAttributionKit API", en: "Full, if AdAttributionKit API implemented" } }
        },
        mmp: {
          android: { status: "na", text: { pl: "N/A (Niedostępne)", en: "N/A (Not available)" } },
          ios: { status: "full", text: { pl: "100% szczelności i brak wymogu okna ATT", en: "100% robust and no ATT prompt required" } }
        },
        skan: {
          android: { status: "na", text: { pl: "N/A (Niedostępne)", en: "N/A (Not available)" } },
          ios: { status: "full", text: { pl: "Natywne rozwiązanie z całkowitą pewnością", en: "Native solution with total certainty" } }
        }
      },
      benefit: { pl: "Jedyny ekosystem oferujący 100% wiarygodny i natychmiastowy pomiar efektywności i ROAS w środowisku iOS.", en: "The only ecosystem offering 100% reliable and immediate efficiency and ROAS measurement on iOS." },
      risk: { pl: "Wysoki koszt kliknięć (CPC) i organiczna kanibalizacja ruchu (płacenie za użytkowników, którzy zainstalowaliby apkę z wyników bezpłatnych).", en: "High Cost Per Click (CPC) and organic traffic cannibalization (paying for users who would install organically)." }
    }
  }
];

/* ─── Perspectives ──────────────────────────────────────────── */

const PERSPECTIVES: Record<PerspectiveId, { label: string; emoji: string; color: string; glow: string; dim: string; desc: (eco: EcosystemId) => string }> = {
  ga4: {
    label: "GA4 / Firebase",
    emoji: "🔶",
    color: "#f97316",
    glow: "rgba(249,115,22,0.4)",
    dim: "rgba(249,115,22,0.12)",
    desc: (eco) => eco === "google"
      ? "Natywna integracja: GA4 widzi kampanię Google Ads bez większych przeszkód (zwłaszcza na Androidzie)."
      : "Na platformie iOS kontekst źródłowy utracony podczas przejścia użytkownika przez środowisko App Store.",
  },
  mmp: {
    label: "MMP (AppsFlyer / Adjust)",
    emoji: "🟢",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.4)",
    dim: "rgba(34,197,94,0.12)",
    desc: (eco) => eco === "asa"
      ? "ASA nie potrzebuje MMP — natywny AdAttributionKit zastępuje jego rolę."
      : eco === "google"
        ? "MMP używa Play Install Referrer na Androidzie. Na iOS wspiera się modelowaniem i SKAN."
        : "Rozwiązanie MMP dokonuje estymacji powiązania sesji za pomocą technik modelowania i Deferred Deep Linking.",
  },
  skan: {
    label: "Poziom Systemu (SKAN / OS)",
    emoji: "⚙️",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.4)",
    dim: "rgba(59,130,246,0.12)",
    desc: (eco) => eco === "asa"
      ? "ASA korzysta z deterministycznego AdAttributionKit. Brak okna ATT, brak anonimizacji."
      : "Środowisko iOS: agregacja danych w SKAdNetwork (wymuszone opóźnienia). Android: w pełni natywne odczyty z Play Install Referrer.",
  },
};

/* ─── Journey node data ─────────────────────────────────────── */

const NODES: JourneyNode[] = [
  {
    id: "ad",
    icon: "📣",
    label: "Kliknięcie (Web)",
    sublabel: (eco) => {
      const e = ECOSYSTEMS.find(x => x.id === eco)!;
      return `${e.name} · spring_sale_vip`;
    },
    data: {
      meta: {
        ga4: { status: "hidden", dataState: [], note: "Brak zdarzeń inicjujących w Firebase SDK. Rejestrowana jest wyłącznie sesja w obszarze przeglądarki Web." },
        mmp: { status: "visible", dataState: [
          { label: "utm_campaign", value: "spring_sale_vip", status: "ok" },
          { label: "MMP Click Link", value: "wygenerowany ✓", status: "ok" },
          { label: "Kierowanie", value: "sprawdza czy masz apkę", status: "ok" }
        ], note: "MMP identyfikuje parametr kliknięcia i weryfikuje status instalacji aplikacji, determinując proces Deep Linkingu lub przekierowania do platformy dystrybucyjnej." },
        skan: { status: "partial", dataState: [
          { label: "Ad Network ID", value: "podpisany", status: "ok" },
          { label: "User ID (ATT)", value: "zależne od zgody", status: "partial" }
        ], note: "Podpis sygnatury reklamowej na poziomie systemu (OS). W środowisku iOS, zablokowanie parametrów śledzenia (ATT) uniemożliwia agregację identyfikatora." },
      },
      google: {
        ga4: { status: "visible", dataState: [
          { label: "utm_campaign", value: "spring_sale_vip", status: "ok" },
          { label: "gclid", value: "wygenerowany ✓", status: "ok" }
        ], note: "Parametry UTM oraz gclid są prawidłowo propagowane na poziomie przeglądarki i platformy Google." },
        mmp: { status: "visible", dataState: [
          { label: "utm_campaign", value: "spring_sale_vip", status: "ok" },
          { label: "gclid", value: "zarejestrowany", status: "ok" }
        ], note: "MMP rejestruje kliknięcie reklamowe z sieci UAC w celu budowy sesji do obsługi strumienia Deferred Deep Link." },
        skan: { status: "partial", dataState: [
          { label: "[iOS] SKAN ID", value: "aktywny", status: "ok" },
          { label: "[Android] Play", value: "rejestruje start", status: "ok" }
        ], note: "Generowanie parametrów SKAdNetwork (iOS) oraz inicjacja procesu śledzenia Play Install Referrer (Android)." },
      },
      tiktok: {
        ga4: { status: "hidden", dataState: [], note: "Brak zintegrowanego modelu przekazywania danych z przeglądarki in-app platformy TikTok do środowiska Firebase." },
        mmp: { status: "visible", dataState: [
          { label: "utm_campaign", value: "spring_sale_vip", status: "ok" },
          { label: "ttclid", value: "wygenerowany ✓", status: "ok" }
        ], note: "MMP inicjuje logowanie kliknięcia w oparciu o modele probabilistyczne (fingerprinting) dla przeglądarki TikTok In-App." },
        skan: { status: "partial", dataState: [
          { label: "SKAN ID", value: "TikTok iOS", status: "ok" },
          { label: "User ID", value: "zazwyczaj brak (ATT)", status: "lost" }
        ], note: "Przekazanie kliknięcia do sygnatury SKAN. W przypadku braku zgody ATT, trwała utrata widoczności na identyfikatory reklamowe." },
      },
      asa: {
        ga4: { status: "partial", dataState: [
          { label: "utm_campaign", value: "N/A", status: "lost" },
          { label: "AdAttrib token", value: "wygenerowany", status: "ok" }
        ], note: "System ASA ignoruje tagi UTM na rzecz natywnych, wbudowanych tokenów atrybucyjnych systemu iOS." },
        mmp: { status: "partial", dataState: [
          { label: "MMP SDK", value: "czeka w aplikacji", status: "partial" }
        ], note: "Platforma MMP nie odbiera żądania przekierowania (atrybucja zamknięta w ekosystemie App Store). Oczekuje na zdarzenie uruchomienia aplikacji." },
        skan: { status: "visible", dataState: [
          { label: "AdAttributionKit", value: "aktywny ✓", status: "ok" },
          { label: "Privacy Limits", value: "brak okna ATT ✓", status: "ok" }
        ], note: "Warstwa systemowa (iOS) deterministycznie weryfikuje atrybucję reklamową w ekosystemie App Store z całkowitym pominięciem ograniczeń ATT." },
      },
    },
  },
  {
    id: "store",
    icon: "🏬",
    label: "Sklep (Brak Apki)",
    sublabel: (eco) => "Deferred Deep Link",
    isBlackHole: true,
    data: {
      meta: {
        ga4: { status: "blackhole", dataState: [
          { label: "[iOS] Sklep", value: "blokada UTM", status: "lost" },
          { label: "[Android] Sklep", value: "wymaga configu", status: "partial" }
        ], note: "Ślepy punkt w analityce: App Store całkowicie izoluje sesję instalacyjną i odrzuca parametry tagowania (UTM). Całkowity brak widoczności w usłudze GA4." },
        mmp: { status: "partial", dataState: [
          { label: "[Android] Referrer", value: "niezawodny ✓", status: "ok" },
          { label: "[iOS] Fingerprint", value: "niedokładny ⚠️", status: "partial" }
        ], note: "Rejestracja dla ruchu bez pre-instalacji. W środowisku Android dane pokryte są przez Referrer API. W iOS atrybucja zależy od skuteczności modeli probabilistycznych MMP." },
        skan: { status: "visible", dataState: [
          { label: "[iOS] SKAN", value: "rejestruje pobranie", status: "ok" },
          { label: "[Android]", value: "Play Store Play API", status: "ok" }
        ], note: "Monitorowanie sesji na poziomie warstwy operacyjnej. Proces logowania instalacji przebiega natywnie i poprawnie." },
      },
      google: {
        ga4: { status: "visible", dataState: [
          { label: "[Android] gclid", value: "zapisany w Play ✓", status: "ok" },
          { label: "[iOS] gclid", value: "UTRACONY ❌", status: "lost" }
        ], note: "Zachowanie parametrów śledzenia (gclid) jest pełne dla środowiska Play Store. Przejście przez App Store na systemie iOS powoduje trwałą utratę danych dla Firebase." },
        mmp: { status: "partial", dataState: [
          { label: "[Android] Referrer", value: "gclid + utm ✓", status: "ok" },
          { label: "[iOS] Deferred DL", value: "niestabilny ⚠️", status: "partial" }
        ], note: "MMP z powodzeniem atrybuuje ruch Android za sprawą dedykowanego API. Środowisko iOS systematycznie deprecjonuje modele weryfikacji po stronie sieciowej (IP matching)." },
        skan: { status: "partial", dataState: [
          { label: "[iOS] SKAN", value: "pobranie odnotowane", status: "ok" },
          { label: "Timer", value: "zaczyna odliczać", status: "delayed" }
        ], note: "Status pobrania jest walidowany, jednak ramy czasowe na systemie iOS ulegają wielogodzinnemu opóźnieniu z uwagi na wymuszone okna raportowe SKAN." },
      },
      tiktok: {
        ga4: { status: "blackhole", dataState: [
          { label: "utm_campaign", value: "wyczyszczone", status: "lost" },
          { label: "ttclid", value: "wyczyszczone", status: "lost" }
        ], note: "Brak pomiaru atrybucji deterministycznej. Konsekwencją jest kwalifikacja całej konwersji jako źródło nieskategoryzowane (Organic/Direct) w platformie GA4." },
        mmp: { status: "partial", dataState: [
          { label: "[Android] Referrer", value: "podaje ttclid ✓", status: "ok" },
          { label: "[iOS] IP Match", value: "niska skuteczność", status: "partial" }
        ], note: "Odzyskiwanie parametru atrybucyjnego (ttclid) powodzi się dla platform Android. System iOS notuje strukturalne opóźnienia i straty na skutek sandoxingu (izolacji) przeglądarki." },
        skan: { status: "visible", dataState: [
          { label: "[iOS] SKAN", value: "rejestracja Apple", status: "ok" },
          { label: "[Android] Play", value: "rejestracja Google", status: "ok" }
        ], note: "Logowanie operacyjne zachowuje pełną spójność danych instalacyjnych, uniemożliwiając jedynie dostęp aplikacyjny i analityczny firmom trzecim." },
      },
      asa: {
        ga4: { status: "partial", dataState: [
          { label: "App Store", value: "generuje token ✓", status: "ok" },
          { label: "utm_campaign", value: "N/A", status: "lost" }
        ], note: "Brak natychmiastowego logowania w usłudze GA4 do czasu finalizacji procesu uruchomienia oprogramowania. Generowany jest zanonimizowany token instalacji (App Store)." },
        mmp: { status: "visible", dataState: [
          { label: "App Store", value: "natywna atrybucja ✓", status: "ok" }
        ], note: "Moduł MMP funkcjonuje w trybie pasywnym w architekturze ASA. Weryfikacja danych następuje wyłącznie po nawiązaniu łączności z rejestrem systemowym Apple." },
        skan: { status: "visible", dataState: [
          { label: "[iOS] AdAttribKit", value: "natychmiastowe ✓", status: "ok" },
          { label: "Deterministyczne", value: "100% pewności ✓", status: "ok" }
        ], note: "W odróżnieniu od środowisk otwartych, ekosystem App Store gwarantuje stabilny i wysoce wiarygodny proces deterministycznego weryfikowania instalacji dla usługi ASA." },
      },
    },
  },
  {
    id: "first_open",
    icon: "🚀",
    label: "first_open",
    sublabel: () => "Deferred Deep Link otwiera apkę",
    data: {
      meta: {
        ga4: { status: "partial", dataState: [
          { label: "event", value: "first_open ✓", status: "ok" },
          { label: "[Android]", value: "(direct) ❌", status: "lost" },
          { label: "[iOS]", value: "(direct) ❌", status: "lost" }
        ], note: "Inicjacja oprogramowania (first_open). Usługa GA4, z racji braku powiązania sesji, notuje zdarzenie bez kontekstu pierwotnej kampanii reklamowej, zaniżając efektywność Meta Ads." },
        mmp: { status: "visible", dataState: [
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "deep link", value: "przenosi na promocję ✓", status: "ok" },
          { label: "→ Meta CAPI", value: "wysyła postback ✓", status: "ok" }
        ], note: "SDK platformy MMP odczytuje parametry post-instalacyjne ze sklepu i obsługuje mechanikę powiązania sesji, finalnie egzekwując przekierowanie do ścieżki Deferred Deep Link." },
        skan: { status: "partial", dataState: [
          { label: "[iOS] CV", value: "aktualizacja 1 (app)", status: "partial" },
          { label: "Postback", value: "⏳ oczekuje", status: "delayed" }
        ], note: "Inicjalizacja pierwszej, domyślnej Wartości Konwersji (Conversion Value) przez platformę SKAdNetwork, podlegającej procesom opóźnionej wysyłki." },
      },
      google: {
        ga4: { status: "visible", dataState: [
          { label: "[Android] kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "[iOS] kampania", value: "(direct) ❌", status: "lost" },
          { label: "[Android] deep link", value: "auto-redirect ✓", status: "ok" }
        ], note: "Poprawne powiązanie atrybucji GA4 ze zdarzeniem inicjalizacji w Androidzie oraz płynna realizacja scenariusza deep-link. Struktura i parametry konwersji (direct) są typowe dla strat powiązania środowiska iOS." },
        mmp: { status: "visible", dataState: [
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "→ Google Ads", value: "potwierdzenie ✓", status: "ok" }
        ], note: "Model weryfikacji powodzi się bezpośrednio w ekosystemie Android. Odtworzenie ścieżki w środowisku Apple oparte jest w znacznej mierze o zasoby modelowania probabilistycznego." },
        skan: { status: "partial", dataState: [
          { label: "[iOS] CV", value: "aktualizacja", status: "partial" },
          { label: "Postback", value: "⏳ oczekuje", status: "delayed" }
        ], note: "Transparentna realizacja założeń ramowych SKAdNetwork na poziomie systemowym, zachodząca bez ingerencji w proces instalacji aplikacji." },
      },
      tiktok: {
        ga4: { status: "partial", dataState: [
          { label: "event", value: "first_open ✓", status: "ok" },
          { label: "kampania", value: "(direct) ❌", status: "lost" }
        ], note: "Analiza GA4 rejestruje uruchomienie programu, jednak bez przypisanej kampanii źródłowej (odrzucony parametr UTM). Konwersja przyporządkowana nieskategoryzowanemu ruchowi 'direct'." },
        mmp: { status: "visible", dataState: [
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "[Android]", value: "100% atrybucja ✓", status: "ok" },
          { label: "[iOS]", value: "niska szansa dopasowania", status: "partial" }
        ], note: "Scenariusz powiązania instalacji z docelowym ekranem uwieńczony sukcesem dla użytkowników systemu Android. Wysoki procent zakłóceń lejka Deferred Deep Link podczas wejścia z iOS." },
        skan: { status: "partial", dataState: [
          { label: "[iOS] CV", value: "aktualizacja", status: "partial" }
        ], note: "W pełni anonimizowany profil instalacji przydzielony z poziomu operacyjnego dla standardu SKAdNetwork." },
      },
      asa: {
        ga4: { status: "visible", dataState: [
          { label: "event", value: "first_open ✓", status: "ok" },
          { label: "AdAttribKit", value: "odczyt tokenu ✓", status: "ok" },
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" }
        ], note: "Możliwość pełnej, natywnej atrybucji w środowisku iOS pod warunkiem zaimplementowania logiki obsługi zdarzeń AdAttributionKit w ramach inicjacji aplikacji." },
        mmp: { status: "visible", dataState: [
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "Atrybucja", value: "deterministyczna iOS ✓", status: "ok" }
        ], note: "Wysoka spójność weryfikacji atrybucyjnej. Platforma odczytuje poprawnie weryfikowalny i nierejestrowalny token bezpośrednio z API firmy Apple." },
        skan: { status: "visible", dataState: [
          { label: "AdAttributionKit", value: "sukces ✓", status: "ok" },
          { label: "Postback", value: "brak opóźnień ✓", status: "ok" }
        ], note: "Implementacja systemowa funkcjonuje w sposób asynchroniczny z całkowitym zniwelowaniem wskaźnika deficytu danych operacyjnych i opóźnień czasowych." },
      },
    },
  },
  {
    id: "conversion",
    icon: "🛍️",
    label: "Zakup",
    sublabel: () => "Purchase · Koszyk: 349 PLN",
    data: {
      meta: {
        ga4: { status: "visible", dataState: [
          { label: "event", value: "purchase ✓", status: "ok" },
          { label: "revenue", value: "349.00 PLN ✓", status: "ok" },
          { label: "kampania", value: "(direct) ❌", status: "lost" }
        ], note: "Transakcja zrealizowana pozytywnie (event: purchase). Usługa GA4 z dużym prawdopodobieństwem zniekształci atrybucję ROI dla kanału Meta Ads z racji kwalifikacji jako ruch direct." },
        mmp: { status: "visible", dataState: [
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "revenue", value: "349.00 PLN ✓", status: "ok" },
          { label: "→ Meta CAPI", value: "wysyła ROAS ✓", status: "ok" }
        ], note: "Atrybucja zakupu przez serwery MMP, generująca sprzężenie Server-to-Server postback dla API docelowego (CAPI). Istotny sygnał dla optymalizacji algorytmu po stronie Meta Ads." },
        skan: { status: "partial", dataState: [
          { label: "[iOS] CV Update", value: "349 PLN (skrzynka 4)", status: "partial" },
          { label: "[iOS] Postback", value: "⏳ w końcu wysłany", status: "delayed" }
        ], note: "Aktualizacja progu parametru wartości (Conversion Value) do odzwierciedlenia skali transakcji. Uruchamia to mechanizm odroczonego postbacku wymaganego normą SKAN." },
      },
      google: {
        ga4: { status: "visible", dataState: [
          { label: "event", value: "purchase ✓", status: "ok" },
          { label: "[Android] kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "[iOS] kampania", value: "(direct) ❌", status: "lost" }
        ], note: "Podział wyników ze względu na system operacyjny: prawidłowy zwrot i przypisanie ROAS na systemie Android względem silnego ryzyka zakwalifikowania strumienia przychodów z platform iOS do obszaru 'direct'." },
        mmp: { status: "visible", dataState: [
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "revenue", value: "349.00 PLN ✓", status: "ok" },
          { label: "→ Google API", value: "aktualizacja ROAS ✓", status: "ok" }
        ], note: "System MMP poprawia skuteczność estymacji poprzez przesłanie informacji o udanej transakcji bezpośrednio za pomocą integracji po stronie serwera API (S2S)." },
        skan: { status: "partial", dataState: [
          { label: "[iOS] CV", value: "349 PLN", status: "partial" },
          { label: "[Android]", value: "nie dotyczy", status: "ok" }
        ], note: "Rozwiązania platformy Google dla środowisk iOS polegają wtórnie na odroczonych w czasie raportach o zdarzeniach ze strony interfejsu SKAdNetwork, wpływających na opóźnienia w analizie modeli w czasie rzeczywistym." },
      },
      tiktok: {
        ga4: { status: "visible", dataState: [
          { label: "event", value: "purchase ✓", status: "ok" },
          { label: "revenue", value: "349.00 PLN ✓", status: "ok" },
          { label: "kampania", value: "(direct) ❌", status: "lost" }
        ], note: "Finalizacja lejka, pomimo realizacji konwersji widoczna defragmentacja z powodu braku transparentnej atrybucji. Wydatki na kampanię ulegają deprecjacji po względem przypisanego zwrotu ROAS." },
        mmp: { status: "visible", dataState: [
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "revenue", value: "349.00 PLN ✓", status: "ok" },
          { label: "→ TikTok Events", value: "wysyła ROAS ✓", status: "ok" }
        ], note: "Integracja ze strukturą MMP dostarcza kluczowych informacji biznesowych o efektywnym wskaźniku ROAS umożliwiających audyt kosztów zakupu ruchu w TikTok Ads." },
        skan: { status: "partial", dataState: [
          { label: "[iOS] CV", value: "349 PLN", status: "partial" },
          { label: "[iOS] Postback", value: "⏳ opóźnienie 24-48h", status: "delayed" }
        ], note: "Anonimizacja pakietów instalacyjnych zgodna z paradygmatem ochrony danych (ATT) ogranicza zdolność natychmiastowego powiązania konwersji dla zintegrowanych systemów stron trzecich." },
      },
      asa: {
        ga4: { status: "visible", dataState: [
          { label: "event", value: "purchase ✓", status: "ok" },
          { label: "revenue", value: "349.00 PLN ✓", status: "ok" },
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" }
        ], note: "Spójność rozwiązań: transakcja i atrybucja przypisana przez GA4 zachowuje bezpośrednie powiązanie analityczne z wykorzystaniem detali semantycznych użytego kanału ASA." },
        mmp: { status: "visible", dataState: [
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "revenue", value: "349.00 PLN ✓", status: "ok" }
        ], note: "Logowanie instalacji cechuje się maksymalnym zakresem danych deterministycznych w środowisku Apple bez występowania zakłóceń estymacji zjawiska (modelingu)." },
        skan: { status: "visible", dataState: [
          { label: "[iOS] AdAttribKit", value: "potwierdzenie ✓", status: "ok" },
          { label: "wartość", value: "pełna, bez agregacji ✓", status: "ok" }
        ], note: "Warstwa natywna systemu wysyła natychmiastowy raport sukcesji, przekazując szczegółowy parametr do analiz po stronie analityka w sposób wykluczający rozbieżność danych i spadek skuteczności ROAS." },
      },
    },
  },
];
/* ─── Status helpers ────────────────────────────────────────── */

const STATUS_COLOR: Record<string, string> = {
  ok: "#22c55e", lost: "#ef4444", partial: "#eab308", delayed: "#3b82f6", anon: "#a855f7",
};
const STATUS_LABEL: Record<string, string> = {
  ok: "OK", lost: "utracone", partial: "częściowe", delayed: "opóźnione", anon: "anonimowe",
};

const NODE_STATUS_TO_GLOW: Record<NodeStatus, string> = {
  visible: "success", partial: "warning", hidden: "dead", blackhole: "blackhole",
};

/* ─── Welcome Screen ────────────────────────────────────────── */

function WelcomeScreen({ onSelect, lang }: { onSelect: (eco: EcosystemId) => void; lang: string }) {
  const isPl = lang === "pl";
  return (
    <motion.div
      className="relative w-full max-w-7xl h-full mx-auto px-5 lg:px-10 flex flex-col lg:flex-row items-center justify-center lg:justify-between overflow-y-auto overflow-x-hidden pt-6 pb-20 lg:pt-0 lg:pb-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5 }}
    >
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes counter-orbit {
          from { transform: translate(-50%, -50%) rotate(360deg); }
          to { transform: translate(-50%, -50%) rotate(0deg); }
        }
      `}</style>

      {/* Left Column: Text */}
      <div className="w-full lg:w-1/2 relative z-20 flex flex-col justify-center mt-4 lg:mt-0 pointer-events-none">
        <motion.div
          className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 text-[11px] font-mono text-white/90 mb-8 sm:mb-10 uppercase tracking-widest pointer-events-auto mx-auto lg:mx-0 w-fit"
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          {isPl ? "Interaktywna Mapa Atrybucji Mobilnej" : "Interactive Mobile Attribution Map"}
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-4 sm:mb-5 leading-[1.05] sm:leading-[0.95]"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        >
          {isPl ? "Skąd przychodzi\nTwój użytkownik?" : "Where does your\nuser come from?"}
        </motion.h1>

        <motion.p
          className="text-sm sm:text-base lg:text-lg text-white/90 max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
        >
          {isPl
            ? "Wybierz ekosystem reklamowy i prześledź drogę użytkownika dla trudnego scenariusza (Deferred Deep Link)."
            : "Choose your ad ecosystem and trace the user journey for the challenging scenario (Deferred Deep Link)."}
        </motion.p>
        
        <motion.div
          className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/5 mx-auto lg:mx-0 max-w-xl text-left"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🛍️</span>
            <h3 className="font-bold text-white text-sm sm:text-base">{isPl ? "Case Study: Kampania E-commerce" : "Case Study: E-commerce Campaign"}</h3>
          </div>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed m-0">
            {isPl 
              ? "Wiosenna Wyprzedaż (Web2App). Użytkownik widzi reklamę, klika, trafia do sklepu i pobiera aplikację, by kupić koszyk za 349 PLN. Zobacz, jak poszczególne platformy (iOS vs Android) gubią lub chronią atrybucję."
              : "Spring Sale (Web2App). The user sees an ad, clicks, goes to the store, installs the app, and buys a cart for 349 PLN. See how platforms (iOS vs Android) lose or protect attribution."}
          </p>
        </motion.div>
      </div>

      {/* Right Column: Solar System */}
      <motion.div 
        className="relative lg:w-1/2 w-full hidden lg:flex items-center justify-center min-h-[350px] lg:min-h-[500px]"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className="relative w-full max-w-[500px] lg:max-w-[750px] aspect-square group/solar pointer-events-auto">
          {/* Sun */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full border border-white/10 bg-white/5 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)] z-10 backdrop-blur-sm">
            <span className="text-3xl sm:text-5xl lg:text-6xl mb-0.5 sm:mb-2">📱</span>
            <span className="text-[10px] sm:text-xs lg:text-sm font-mono text-white/90 uppercase tracking-widest">App</span>
          </div>

          {/* Orbit Rings - 4 distinct orbits */}
          {[45, 62, 79, 96].map((size, i) => (
            <div key={i} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border" 
                 style={{ 
                   width: `${size}%`, height: `${size}%`, 
                   borderColor: "rgba(255,255,255,0.04)",
                   borderStyle: i % 2 === 0 ? "solid" : "dashed",
                 }} />
          ))}

          {/* Container that rotates */}
          <div className="absolute inset-0 group-hover/solar:[animation-play-state:paused]" style={{ animation: 'orbit 60s linear infinite' }}>
            {ECOSYSTEMS.map((eco, i) => {
              const r = [22.5, 31, 39.5, 48][i]; // Corresponds to half of sizes
              // Offset angles so they are well distributed
              const angle = (i * 120 + 45) * (Math.PI / 180);
              const left = 50 + Math.cos(angle) * r;
              const top = 50 + Math.sin(angle) * r;

              return (
                <div key={eco.id} className="absolute w-0 h-0" style={{ left: `${left}%`, top: `${top}%` }}>
                  <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 group-hover/solar:[animation-play-state:paused]" style={{ animation: 'counter-orbit 60s linear infinite' }}>
                    <motion.button
                      onClick={() => onSelect(eco.id)}
                      className="group/planet relative flex flex-col items-center justify-center rounded-full border cursor-pointer transition-all duration-300"
                      style={{ 
                        width: "clamp(72px, 14vw, 120px)", 
                        height: "clamp(72px, 14vw, 120px)", 
                        borderColor: eco.color + "40", 
                        background: `radial-gradient(circle at 30% 30%, ${eco.color}30 0%, ${eco.color}05 70%, transparent 100%)`,
                        boxShadow: `0 0 20px ${eco.color}15, inset 0 0 15px ${eco.color}20`
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="text-4xl sm:text-5xl lg:text-6xl">{eco.icon}</span>

                      {/* Hover Card */}
                      <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-64 sm:w-80 p-5 sm:p-6 rounded-3xl border opacity-0 group-hover/planet:opacity-100 group-hover/planet:translate-y-0 translate-y-3 pointer-events-none transition-all duration-400 z-50 text-left"
                           style={{ 
                             background: 'rgba(2,8,24,0.95)', 
                             backdropFilter: 'blur(12px)',
                             borderColor: eco.color + "30", 
                             boxShadow: `0 20px 40px rgba(0,0,0,0.8), 0 0 30px ${eco.color}15` 
                           }}>
                          <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: eco.color + "60" }} />
                          <div className="font-black text-base sm:text-xl text-white mb-1.5">{eco.name}</div>
                          <div className="text-xs sm:text-sm text-white/90 mb-5 leading-tight">{eco.sub}</div>
                          <div className="flex items-center gap-1.5 mt-auto">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: eco.badgeColor }} />
                            <span className="text-[10px] sm:text-[11px] font-semibold" style={{ color: eco.badgeColor }}>{eco.badge}</span>
                          </div>
                      </div>
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Mobile ecosystem picker (visible only on mobile) */}
      <motion.div
        className="lg:hidden w-full flex flex-col gap-3 pb-24 relative z-20"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
      >
        {ECOSYSTEMS.map((eco) => (
          <motion.button
            key={eco.id}
            onClick={() => onSelect(eco.id)}
            className="flex items-center gap-3 p-4 rounded-2xl border cursor-pointer text-left"
            style={{
              background: eco.color + '08',
              borderColor: eco.color + '30',
            }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="text-3xl shrink-0">{eco.icon}</span>
            <div className="min-w-0">
              <div className="text-sm font-black text-white truncate">{eco.name}</div>
              <div className="text-[10px] text-white/50 leading-tight mt-0.5">{eco.sub}</div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <motion.p
        className="text-[11px] text-white/60 font-mono mt-2 absolute bottom-6 hidden lg:block"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}
      >
        {isPl ? "Rozpocznij analizę – wybierz ekosystem reklamowy" : "Start analysis – select an ad ecosystem"}
      </motion.p>
    </motion.div>
  );
}

/* ─── Main Component ────────────────────────────────────────── */

export default function AttributionMapFull({ lang = "pl" }: { lang?: string }) {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [ecosystem, setEcosystem] = useState<EcosystemId>("meta");
  const [activePerspective, setActivePerspective] = useState<PerspectiveId>("mmp");
  const [activeNodeIdx, setActiveNodeIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const eco = ECOSYSTEMS.find(e => e.id === ecosystem)!;
  const persp = PERSPECTIVES[activePerspective];
  const activeNode = NODES[activeNodeIdx];
  const nodeData = activeNode.data[ecosystem][activePerspective];

  const stopPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
  }, []);

  const goToNode = useCallback((idx: number) => {
    setActiveNodeIdx(idx);
    setShowDetail(true);
  }, []);

  const startPlay = useCallback(() => {
    setIsPlaying(true);
    setShowDetail(true);
    let cur = 0;
    setActiveNodeIdx(0);
    intervalRef.current = setInterval(() => {
      cur++;
      if (cur >= NODES.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsPlaying(false);
        return;
      }
      setActiveNodeIdx(cur);
    }, 2200);
  }, []);

  const handleEcosystemSelect = (eco: EcosystemId) => {
    setEcosystem(eco);
    setScreen("journey");
    setActiveNodeIdx(0);
    setShowDetail(false);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || screen !== "journey") return;
    let lastScroll = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastScroll < 600) return;
      lastScroll = now;
      if (e.deltaY > 0) {
        setActiveNodeIdx(i => Math.min(NODES.length - 1, i + 1));
        setShowDetail(true);
        stopPlay();
      } else {
        setActiveNodeIdx(i => Math.max(0, i - 1));
        setShowDetail(true);
        stopPlay();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [stopPlay, screen]);

  const getNodeColor = (node: JourneyNode) => {
    const status = node.data[ecosystem][activePerspective].status;
    if (status === "visible") return persp.color;
    if (status === "partial") return "#eab308";
    if (status === "blackhole") return "#7c3aed";
    return "#374151";
  };

  const backHref = lang === "pl"
    ? "/pl/articles/atrybucja-w-aplikacjach-mobilnych-ga4-utm-mmp"
    : "/en/articles/mobile-app-attribution-guide-ga4-utm-mmp";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden bg-[#020818] select-none z-[60]"
      style={{ fontFamily: "var(--font-space-grotesk, sans-serif)" }}
    >
      <Stars />

      {/* Nebula */}
      <motion.div
        key={ecosystem + activePerspective}
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${screen === "journey" ? persp.dim : eco.dim} 0%, transparent 70%)` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* TOP BAR */}
      <div
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-2 sm:px-5 h-14"
        style={{ background: "rgba(2,8,24,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {screen === "welcome" ? (
          <Link href={backHref} className="flex items-center gap-2 text-xs font-mono text-white/90 hover:text-white/90 transition-colors">
            ← {lang === "pl" ? "artykuł" : "article"}
          </Link>
        ) : (
          <button
            onClick={() => { setScreen("welcome"); stopPlay(); }}
            className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-mono text-white/90 hover:text-white/90 transition-colors cursor-pointer shrink-0"
          >
            <span className="text-sm sm:text-base">{eco.icon}</span>
            <span className="hidden sm:inline" style={{ color: eco.color }}>{eco.name}</span>
            <span className="text-white/60 hidden sm:inline">· zmień</span>
          </button>
        )}

        {/* Center */}
        {screen === "welcome" ? (
          <div className="absolute left-1/2 -translate-x-1/2 text-[11px] font-mono text-white/60 uppercase tracking-widest hidden sm:block">
            {lang === "pl" ? "Mapa Atrybucji Mobilnej" : "Mobile Attribution Map"}
          </div>
        ) : (
          <>
            <div className="absolute left-1/2 -translate-x-1/2 text-[11px] font-mono text-white/60 uppercase tracking-widest hidden sm:block">
              {lang === "pl" ? "Ścieżka Atrybucji" : "Attribution Journey"}
            </div>
            {/* Mobile Perspective Tabs in Header */}
            <div className="flex sm:hidden absolute left-1/2 -translate-x-1/2 items-center rounded-lg overflow-hidden border border-white/10 bg-white/5">
              {(Object.entries(PERSPECTIVES) as [PerspectiveId, typeof persp][]).map(([id, p]) => (
                <button
                  key={id}
                  onClick={() => { setActivePerspective(id); stopPlay(); }}
                  className="px-2 py-1.5 text-[9px] font-bold transition-all cursor-pointer whitespace-nowrap"
                  style={{
                    background: activePerspective === id ? p.color + "30" : "transparent",
                    color: activePerspective === id ? p.color : "rgba(255,255,255,0.4)",
                    borderRight: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {id === 'ga4' ? 'GA4' : id === 'mmp' ? 'MMP' : 'OS'}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Right Play Button */}
        {screen === "journey" ? (
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={isPlaying ? stopPlay : startPlay}
              className="px-4 py-2 rounded-xl text-[11px] font-black transition-all cursor-pointer tracking-wide hidden sm:block"
              style={{
                background: isPlaying ? "rgba(239,68,68,0.12)" : persp.color + "12",
                border: `1px solid ${isPlaying ? "rgba(239,68,68,0.25)" : persp.color + "25"}`,
                color: isPlaying ? "#ef4444" : persp.color,
                minWidth: 80,
              }}
            >
              {isPlaying ? "■  Stop" : "▶  Play"}
            </button>
          </div>
        ) : (
          <div className="w-20 hidden sm:block" />
        )}
      </div>

      {/* SCREENS */}
      <div className="absolute inset-0 pt-14 pb-12 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {screen === "welcome" ? (
            <motion.div key="welcome" className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }}>
              <WelcomeScreen onSelect={handleEcosystemSelect} lang={lang} />
            </motion.div>
          ) : (
            <motion.div key="journey" className="w-full h-full relative flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              
              {/* Perspective Selector (Floating above visualization) */}
              <div className="hidden sm:flex absolute top-[4.5rem] sm:top-8 left-1/2 -translate-x-1/2 items-center rounded-xl overflow-x-auto overflow-y-hidden max-w-[95vw] sm:max-w-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(2,8,24,0.7)", backdropFilter: "blur(16px)" }}>
                {(Object.entries(PERSPECTIVES) as [PerspectiveId, typeof persp][]).map(([id, p]) => (
                  <button
                    key={id}
                    onClick={() => { setActivePerspective(id); stopPlay(); }}
                    className="px-4 sm:px-10 py-3 sm:py-4 text-[10px] sm:text-sm lg:text-base font-black transition-all cursor-pointer whitespace-nowrap tracking-wide"
                    style={{
                      background: activePerspective === id ? p.color + "20" : "transparent",
                      color: activePerspective === id ? p.color : "rgba(255,255,255,0.35)",
                      borderRight: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* ─── Case Study Sidebar (desktop) ─── */}
              <div className="hidden lg:flex absolute left-5 xl:left-6 top-1/2 -translate-y-1/2 z-20 flex-col gap-0"
                style={{ width: 220 }}>
                {/* Header */}
                <div className="rounded-t-2xl border border-b-0 border-white/10 px-4 pt-4 pb-3"
                  style={{ background: "rgba(2,8,24,0.75)", backdropFilter: "blur(20px)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🛍️</span>
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Case Study</span>
                  </div>
                  <div className="font-black text-white text-sm leading-tight mb-1.5">
                    {lang === "pl" ? "Wiosenna Wyprzedaż" : "Spring Sale"}
                  </div>
                  <div className="text-[10px] text-white/50 leading-relaxed">
                    {lang === "pl"
                      ? "Kampania Web2App dla stałych klientów. Deferred Deep Link przez Sklep → Apka."
                      : "Web2App campaign for loyal users. Deferred Deep Link via Store → App."}
                  </div>
                </div>

                {/* Journey steps */}
                <div className="rounded-b-2xl border border-white/10 overflow-hidden divide-y divide-white/[0.06]"
                  style={{ background: "rgba(2,8,24,0.65)", backdropFilter: "blur(20px)" }}>
                  {NODES.map((node, idx) => {
                    const isActive = idx === activeNodeIdx;
                    const isPast = idx < activeNodeIdx;
                    const nodeColor = getNodeColor(node);
                    return (
                      <button
                        key={node.id}
                        onClick={() => { goToNode(idx); stopPlay(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer transition-all"
                        style={{
                          background: isActive ? nodeColor + "15" : "transparent",
                        }}
                      >
                        {/* Step indicator */}
                        <div className="shrink-0 flex items-center justify-center rounded-full text-base"
                          style={{
                            width: 28, height: 28,
                            background: isActive ? nodeColor + "25" : isPast ? nodeColor + "10" : "rgba(255,255,255,0.04)",
                            border: `1.5px solid ${isActive ? nodeColor + "80" : isPast ? nodeColor + "30" : "rgba(255,255,255,0.08)"}`,
                          }}>
                          {isPast && !isActive
                            ? <span style={{ fontSize: 11, color: nodeColor + "90" }}>✓</span>
                            : <span style={{ fontSize: 14 }}>{node.icon}</span>}
                        </div>
                        {/* Label */}
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-semibold truncate"
                            style={{ color: isActive ? "#fff" : isPast ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)" }}>
                            {node.label}
                          </div>
                          {isActive && (
                            <div className="text-[9px] mt-0.5 truncate" style={{ color: nodeColor }}>
                              {node.sublabel(ecosystem)}
                            </div>
                          )}
                        </div>
                        {/* Active dot */}
                        {isActive && (
                          <div className="shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: nodeColor, boxShadow: `0 0 8px ${nodeColor}` }} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Cart badge */}
                <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10"
                  style={{ background: "rgba(2,8,24,0.6)", backdropFilter: "blur(10px)" }}>
                  <span className="text-base">🛒</span>
                  <div>
                    <div className="text-[10px] font-black text-white">349 PLN</div>
                    <div className="text-[9px] text-white/40">Koszyk do atrybucji</div>
                  </div>
                </div>

                {/* Desktop Verdict */}
                {activeNodeIdx === NODES.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 p-4 rounded-2xl border border-white/10"
                    style={{ background: "rgba(2,8,24,0.9)", backdropFilter: "blur(20px)" }}
                  >
                    <div className="text-[10px] uppercase font-mono tracking-widest text-white/50 mb-3 flex items-center gap-1.5">
                      <span style={{ color: eco.color }}>{eco.icon}</span> 
                      {lang === "pl" ? "Werdykt Ekosystemu" : "Ecosystem Verdict"}
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <div>
                        {/* Matrix UI */}
                        <div className="text-[9px] text-white/40 font-bold mb-1.5 uppercase tracking-wider">{lang === "pl" ? "Dostępność w tym narzędziu:" : "Data Availability:"}</div>
                        <div className="grid grid-cols-1 gap-2 text-[10px]">
                          <div className="bg-white/5 p-2 rounded border border-white/5">
                            <div className="font-bold text-white/80 mb-1 flex items-center gap-1.5">
                              {activePerspective === 'ga4' ? 'GA4 (Firebase)' : activePerspective === 'mmp' ? 'MMP (AppsFlyer/Adjust)' : 'Poziom OS / SKAdNetwork'}
                            </div>
                            <div className="flex items-start gap-1 mb-1">
                              <span className="shrink-0 opacity-70">🤖</span>
                              <span className={`leading-tight ${eco.summary.dataAvailability[activePerspective].android.status === 'full' ? 'text-green-400' : eco.summary.dataAvailability[activePerspective].android.status === 'none' ? 'text-red-400' : eco.summary.dataAvailability[activePerspective].android.status === 'na' ? 'text-white/30' : 'text-yellow-400'}`}>{eco.summary.dataAvailability[activePerspective].android.text[lang as "pl" | "en"]}</span>
                            </div>
                            <div className="flex items-start gap-1">
                              <span className="shrink-0 opacity-70">🍏</span>
                              <span className={`leading-tight ${eco.summary.dataAvailability[activePerspective].ios.status === 'full' ? 'text-green-400' : eco.summary.dataAvailability[activePerspective].ios.status === 'none' ? 'text-red-400' : eco.summary.dataAvailability[activePerspective].ios.status === 'na' ? 'text-white/30' : 'text-yellow-400'}`}>{eco.summary.dataAvailability[activePerspective].ios.text[lang as "pl" | "en"]}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-green-400/80 font-bold mb-1 uppercase tracking-wider">{lang === "pl" ? "Kluczowa Korzyść" : "Key Benefit"}</div>
                        <div className="text-[11px] text-white/90 leading-snug">{eco.summary.benefit[lang as "pl" | "en"]}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-red-400/80 font-bold mb-1 uppercase tracking-wider">{lang === "pl" ? "Ryzyko Biznesowe" : "Business Risk"}</div>
                        <div className="text-[11px] text-white/90 leading-snug">{eco.summary.risk[lang as "pl" | "en"]}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* ─── Case Study Mobile Chip (hidden now) ─── */}
              <div className="hidden">
              {/* Simple expandable chip in bottom-left, above bottom bar */}
              <div className="lg:hidden absolute bottom-16 left-3 z-30">
                <button
                  id="cs-chip-toggle"
                  onClick={() => {
                    const panel = document.getElementById('cs-mobile-panel');
                    if (panel) panel.classList.toggle('hidden');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full cursor-pointer text-[11px] font-bold"
                  style={{ background: "rgba(2,8,24,0.85)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(16px)", color: "rgba(255,255,255,0.8)" }}
                >
                  <span>🛍️</span>
                  <span>Case Study</span>
                  <span className="text-white/40">ⓘ</span>
                </button>
                {/* Expanded panel */}
                <div id="cs-mobile-panel" className="hidden absolute bottom-full mb-2 left-0 w-72 rounded-2xl border border-white/15 overflow-hidden shadow-2xl"
                  style={{ background: "rgba(2,8,24,0.95)", backdropFilter: "blur(24px)" }}>
                  <div className="px-4 pt-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-2xl">🛍️</span>
                      <div>
                        <div className="font-black text-white text-sm">{lang === "pl" ? "Wiosenna Wyprzedaż" : "Spring Sale"}</div>
                        <div className="text-[10px] text-white/40">Case Study · Web2App</div>
                      </div>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed m-0">
                      {lang === "pl"
                        ? "Kampania kieruje stałych klientów do apki przez Sklep (Deferred Deep Link). Obserwuj co widzi GA4, MMP i OS na każdym etapie."
                        : "Campaign sends loyal users to the app via Store (Deferred Deep Link). Watch what GA4, MMP & OS see at each stage."}
                    </p>
                  </div>
                  {/* Mini journey */}
                  <div className="px-4 py-3 flex flex-col gap-1.5">
                    {NODES.map((node, idx) => {
                      const isActive = idx === activeNodeIdx;
                      const isPast = idx < activeNodeIdx;
                      const nodeColor = getNodeColor(node);
                      return (
                        <button
                          key={node.id}
                          onClick={() => { goToNode(idx); stopPlay(); document.getElementById('cs-mobile-panel')?.classList.add('hidden'); }}
                          className="flex items-center gap-2.5 cursor-pointer"
                        >
                          <span className="text-base">{isPast && !isActive ? "✓" : node.icon}</span>
                          <span className="text-xs" style={{ color: isActive ? "#fff" : isPast ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)", fontWeight: isActive ? 700 : 400 }}>
                            {node.label}
                          </span>
                          {isActive && <span className="ml-auto text-[9px] font-mono" style={{ color: nodeColor }}>← tu jesteś</span>}
                        </button>
                      );
                    })}
                  </div>
                  <div className="px-4 pb-3 flex items-center gap-2">
                    <span className="text-base">🛒</span>
                    <span className="text-xs font-black text-white">349 PLN</span>
                    <span className="text-[10px] text-white/40 ml-1">– cel kampanii</span>
                  </div>
                </div>
              </div>

              </div>

              {/* Left dots nav */}
              <div className="hidden lg:flex absolute left-5 top-1/2 -translate-y-1/2 flex-col items-center gap-3 z-10">
                {NODES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { goToNode(idx); stopPlay(); }}
                    className="transition-all cursor-pointer rounded-full"
                    style={{
                      width: idx === activeNodeIdx ? 14 : 8,
                      height: idx === activeNodeIdx ? 14 : 8,
                      background: idx === activeNodeIdx ? persp.color : idx < activeNodeIdx ? persp.color + "50" : "#ffffff18",
                      boxShadow: idx === activeNodeIdx ? `0 0 12px ${persp.color}` : "none",
                    }}
                  />
                ))}
                <div className="text-[10px] font-mono text-white/60 mt-1">{activeNodeIdx + 1}/{NODES.length}</div>
              </div>

              {/* Center: Vertical nodes */}
              <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ width: 140 }}>
                {/* Background global orbit rings for the journey view */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5 opacity-50 pointer-events-none" style={{ animation: 'orbit 120s linear infinite' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border border-white/5 border-dashed opacity-30 pointer-events-none" style={{ animation: 'counter-orbit 180s linear infinite' }} />

                {NODES.map((node, idx) => {
                  const color = getNodeColor(node);
                  const isActive = idx === activeNodeIdx;
                  const dist = Math.abs(idx - activeNodeIdx);
                  const opacity = isActive ? 1 : Math.max(0.10, 1 - dist * 0.26);
                  const scale = isActive ? 1 : Math.max(0.52, 1 - dist * 0.16);
                  const translateY = (idx - activeNodeIdx) * 220;

                  return (
                    <motion.div
                      key={node.id}
                      className="absolute flex flex-col items-center cursor-pointer"
                      animate={{ y: translateY, opacity, scale }}
                      transition={{ type: "spring", stiffness: 130, damping: 22 }}
                      onClick={() => { goToNode(idx); stopPlay(); }}
                    >
                      {idx > 0 && (
                        <div className="absolute" style={{ top: -110, width: 3, height: 110, background: node.data[ecosystem][activePerspective].status === "hidden" ? "#ffffff06" : `linear-gradient(to bottom, ${getNodeColor(NODES[idx - 1])}25, ${color}55)`, left: "50%", transform: "translateX(-50%)" }}>
                          {node.data[ecosystem][activePerspective].status !== "hidden" && (
                            <motion.div
                              className="absolute left-1/2 -translate-x-1/2 w-1.5 h-6 rounded-full"
                              style={{ background: color, boxShadow: `0 0 12px ${color}` }}
                              animate={{ y: [-110, 110], opacity: [0, 1, 0] }}
                              transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: idx * 0.35 }}
                            />
                          )}
                        </div>
                      )}

                      <motion.div
                        className="relative flex items-center justify-center rounded-full z-10"
                        style={{
                          width: isActive ? 140 : 90,
                          height: isActive ? 140 : 90,
                          background: node.isBlackHole ? "radial-gradient(circle, #1a0030 0%, #000 60%)" : `radial-gradient(circle, ${color}10 0%, ${color}03 100%)`,
                          border: `2px solid ${node.isBlackHole ? "#7c3aed" : color}${isActive ? "bb" : "40"}`,
                          boxShadow: isActive ? `0 0 50px ${node.isBlackHole ? "#7c3aed" : color}45, 0 0 100px ${node.isBlackHole ? "#7c3aed" : color}15` : "none",
                        }}
                        animate={node.isBlackHole && isActive ? { rotate: 360 } : {}}
                        transition={node.isBlackHole ? { duration: 8, repeat: Infinity, ease: "linear" } : {}}
                      >
                        {node.isBlackHole && <motion.div className="absolute inset-0 rounded-full" style={{ border: "1px dashed #7c3aed30" }} animate={{ rotate: -360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />}
                        
                        {/* Saturn-like rings around active node */}
                        {isActive && !node.isBlackHole && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[-1]">
                            <div className="absolute w-[130%] h-[130%] rounded-full border border-white/10" style={{ animation: 'orbit 12s linear infinite', borderColor: `${color}30` }} />
                            <div className="absolute w-[160%] h-[160%] rounded-full border border-dashed border-white/10" style={{ animation: 'counter-orbit 20s linear infinite', borderColor: `${color}20` }} />
                          </div>
                        )}

                        <span style={{ fontSize: isActive ? 52 : 36 }}>{node.icon}</span>
                        {isActive && !node.isBlackHole && (
                          <motion.div className="absolute inset-0 rounded-full" style={{ border: `2px solid ${color}` }} animate={{ scale: [1, 2.0], opacity: [0.45, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
                        )}
                      </motion.div>

                      <motion.div className="mt-4 text-center" animate={{ opacity: isActive ? 1 : 0.3 }}>
                        <div className="text-lg font-black text-white whitespace-nowrap">{node.label}</div>
                        <div className="text-sm text-white/90 mt-1 whitespace-nowrap max-w-[240px] truncate">{node.sublabel(ecosystem)}</div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Right: Detail panel */}
              <div className="hidden lg:block">
              <AnimatePresence mode="wait">
                {showDetail && (
                  <motion.div
                    key={`${activeNodeIdx}-${activePerspective}-${ecosystem}`}
                    className="absolute bottom-12 lg:bottom-auto left-0 right-0 lg:left-auto lg:right-5 lg:top-1/2 lg:-translate-y-1/2 z-40 w-full lg:w-[min(560px,calc(100vw-320px))]"
                    initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="rounded-t-3xl lg:rounded-2xl overflow-y-auto overflow-x-hidden backdrop-blur-xl w-full max-h-[55vh] lg:max-h-[85vh] border-t lg:border-t-0 border-white/10" onTouchStart={(e) => e.stopPropagation()} style={{
                      background: "rgba(2,8,24,0.88)",
                      border: `1px solid ${nodeData.status === "hidden" ? "#ffffff10" : persp.color + "28"}`,
                      boxShadow: nodeData.status !== "hidden" ? `0 0 40px ${persp.color}10` : "none",
                    }}>
                      {/* Drag handle for mobile */}
                      <div className="flex justify-center pt-3 pb-1 lg:hidden">
                        <div className="w-10 h-1 rounded-full bg-white/20" />
                      </div>
                      {/* Header */}
                      <div className="flex items-start gap-4 px-6 py-4 border-b" style={{ borderColor: persp.color + "18", background: persp.color + "06" }}>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-black text-white mb-1">{activeNode.label}</div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-[11px] font-semibold" style={{ color: persp.color }}>{persp.label}</span>
                            <span className="flex items-center gap-1.5 text-[10px] font-semibold" style={{
                              color: nodeData.status === "visible" ? "#22c55e" : nodeData.status === "hidden" ? "#ef4444" : nodeData.status === "blackhole" ? "#a78bfa" : "#eab308",
                            }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: nodeData.status === "visible" ? "#22c55e" : nodeData.status === "hidden" ? "#ef4444" : nodeData.status === "blackhole" ? "#7c3aed" : "#eab308" }} />
                              {nodeData.status === "visible" ? "widoczne" : nodeData.status === "hidden" ? "niewidoczne" : nodeData.status === "blackhole" ? "czarna dziura" : "częściowe"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Data rows */}
                      {nodeData.dataState.length > 0 ? (
                        <div className="px-6 py-5">
                          <div className="text-[10px] font-mono text-white/60 uppercase tracking-widest mb-4">Stan danych kampanii</div>
                          <div className="space-y-3">
                            {nodeData.dataState.map((row, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <span className="text-xs sm:text-sm font-mono text-white/90 shrink-0" style={{ minWidth: 100 }}>{row.label}</span>
                                <span className="text-white/90 shrink-0 text-xs">→</span>
                                <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold" style={{
                                  background: STATUS_COLOR[row.status] + "10",
                                  color: row.status === "lost" ? STATUS_COLOR[row.status] + "80" : STATUS_COLOR[row.status],
                                  textDecoration: row.status === "lost" ? "line-through" : "none",
                                }}>
                                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: STATUS_COLOR[row.status], opacity: row.status === "lost" ? 0.5 : 1 }} />
                                  {row.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="px-6 py-10 text-center">
                          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-3">
                            <span className="text-white/60 text-xl">—</span>
                          </div>
                          <div className="text-sm text-white/60">System nieaktywny na tym etapie</div>
                        </div>
                      )}

                      {/* Note */}
                      <div className="px-6 py-5 border-t" style={{ borderColor: "#ffffff08", background: "#ffffff03" }}>
                        <p className="text-sm sm:text-base text-white/90 leading-relaxed m-0">{nodeData.note}</p>
                      </div>
                    </div>

                    {/* Perspective desc below panel – hidden on mobile */}
                    <div className="hidden sm:block mt-4 px-1 text-xs text-white/60 leading-relaxed">
                      {persp.desc(ecosystem)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>

              {/* ─── Mobile Journey Feed (Scrollable Column) ─── */}
              <div className="lg:hidden absolute inset-0 overflow-y-auto overflow-x-hidden pt-28 pb-32 px-4 z-20">
                {/* Mobile Case Study Intro */}
                <div className="mb-8 rounded-2xl border border-white/10 p-5" style={{ background: "rgba(2,8,24,0.85)", backdropFilter: "blur(16px)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🛍️</span>
                    <div>
                      <div className="font-black text-white text-base">{lang === "pl" ? "Wiosenna Wyprzedaż" : "Spring Sale"}</div>
                      <div className="text-xs text-white/50">Case Study · Web2App</div>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed mt-3 mb-4">
                    {lang === "pl"
                      ? "Kampania kieruje stałych klientów do apki przez Sklep (Deferred Deep Link). Przewijaj w dół i obserwuj co widzi GA4, MMP i OS na każdym etapie."
                      : "Campaign sends loyal users to the app via Store (Deferred Deep Link). Scroll down and watch what GA4, MMP & OS see at each stage."}
                  </p>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 w-fit">
                    <span className="text-xl">🛒</span>
                    <div>
                      <div className="text-[11px] font-black text-white">349 PLN</div>
                      <div className="text-[10px] text-white/50">{lang === "pl" ? "Koszyk do atrybucji" : "Target Cart"}</div>
                    </div>
                  </div>
                </div>

                {/* Mobile Feed Nodes */}
                <div className="flex flex-col gap-6 relative">
                  {/* Vertical connecting line */}
                  <div className="absolute left-7 top-6 bottom-6 w-0.5 bg-white/10 z-0" />
                  
                  {NODES.map((node, idx) => {
                    const nodeData = node.data[ecosystem][activePerspective];
                    const statusColor = nodeData.status === "visible" ? "#22c55e" : nodeData.status === "hidden" ? "#ef4444" : nodeData.status === "blackhole" ? "#7c3aed" : "#eab308";
                    
                    return (
                      <div key={node.id} className="relative z-10 flex flex-col gap-3">
                        {/* Node Header Row */}
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-3xl shadow-lg border border-white/20" 
                               style={{ background: "rgba(2,8,24,0.95)" }}>
                            {node.icon}
                          </div>
                          <div>
                            <div className="font-black text-lg text-white">{node.label}</div>
                            <div className="text-xs text-white/60">{node.sublabel(ecosystem)}</div>
                          </div>
                        </div>
                        
                        {/* Data Card */}
                        <div className="ml-6 pl-8 border-l-2" style={{ borderColor: nodeData.status === "hidden" ? "#ffffff10" : persp.color + "40" }}>
                          <div className="rounded-2xl border border-white/10 overflow-hidden" 
                               style={{ background: "rgba(2,8,24,0.85)", backdropFilter: "blur(12px)" }}>
                            <div className="px-4 py-3 border-b flex justify-between items-center" style={{ borderColor: persp.color + "18", background: persp.color + "06" }}>
                              <span className="text-xs font-bold" style={{ color: persp.color }}>{persp.label}</span>
                              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: statusColor }}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                                {nodeData.status === "visible" ? (lang === "pl" ? "widoczne" : "visible") : nodeData.status === "hidden" ? (lang === "pl" ? "utracone" : "lost") : nodeData.status === "blackhole" ? (lang === "pl" ? "czarna dziura" : "black hole") : (lang === "pl" ? "częściowe" : "partial")}
                              </span>
                            </div>
                            
                            {nodeData.dataState.length > 0 ? (
                              <div className="px-4 py-4 space-y-3">
                                {nodeData.dataState.map((row, i) => (
                                  <div key={i} className="flex flex-col gap-1.5">
                                    <span className="text-xs font-mono text-white/50 uppercase">{row.label}</span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold w-fit" style={{
                                      background: STATUS_COLOR[row.status] + "10",
                                      color: row.status === "lost" ? STATUS_COLOR[row.status] + "80" : STATUS_COLOR[row.status],
                                      textDecoration: row.status === "lost" ? "line-through" : "none",
                                    }}>
                                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLOR[row.status], opacity: row.status === "lost" ? 0.5 : 1 }} />
                                      {row.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="px-4 py-6 text-center">
                                <span className="text-white/40 text-xs">{lang === "pl" ? "Brak widocznych danych" : "No visible data"}</span>
                              </div>
                            )}
                            
                            <div className="px-4 py-4 border-t" style={{ borderColor: "#ffffff08", background: "#ffffff03" }}>
                              <p className="text-sm text-white/80 leading-relaxed m-0">{nodeData.note}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Mobile Verdict */}
                <div className="mt-8 p-5 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden" style={{ background: "rgba(2,8,24,0.95)" }}>
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ background: eco.color }} />
                  <div className="text-[11px] uppercase font-mono tracking-widest text-white/50 mb-4 flex items-center gap-2 mt-1">
                    <span className="text-base" style={{ color: eco.color }}>{eco.icon}</span> 
                    {lang === "pl" ? "Werdykt Ekosystemu" : "Ecosystem Verdict"}
                  </div>
                  
                  <div className="flex flex-col gap-5">
                    <div>
                      {/* Matrix UI Mobile */}
                      <div className="text-[10px] text-white/40 font-bold mb-2 uppercase tracking-wider">{lang === "pl" ? "Dostępność w tym narzędziu:" : "Data Availability:"}</div>
                      <div className="flex flex-col gap-2 text-xs">
                        <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                          <div className="font-bold text-white/80 mb-1.5 pb-1.5 border-b border-white/5 flex items-center gap-1.5">
                            {activePerspective === 'ga4' ? 'GA4 (Firebase)' : activePerspective === 'mmp' ? 'MMP (AppsFlyer/Adjust)' : 'Poziom OS / SKAdNetwork'}
                          </div>
                          <div className="flex items-start gap-2 mb-1.5">
                            <span className="shrink-0 opacity-70 text-sm">🤖</span>
                            <span className={`leading-tight ${eco.summary.dataAvailability[activePerspective].android.status === 'full' ? 'text-green-400' : eco.summary.dataAvailability[activePerspective].android.status === 'none' ? 'text-red-400' : eco.summary.dataAvailability[activePerspective].android.status === 'na' ? 'text-white/30' : 'text-yellow-400'}`}>{eco.summary.dataAvailability[activePerspective].android.text[lang as "pl" | "en"]}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="shrink-0 opacity-70 text-sm">🍏</span>
                            <span className={`leading-tight ${eco.summary.dataAvailability[activePerspective].ios.status === 'full' ? 'text-green-400' : eco.summary.dataAvailability[activePerspective].ios.status === 'none' ? 'text-red-400' : eco.summary.dataAvailability[activePerspective].ios.status === 'na' ? 'text-white/30' : 'text-yellow-400'}`}>{eco.summary.dataAvailability[activePerspective].ios.text[lang as "pl" | "en"]}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-green-400/80 font-bold mb-1.5 uppercase tracking-wider">{lang === "pl" ? "Kluczowa Korzyść" : "Key Benefit"}</div>
                      <div className="text-xs text-white/90 leading-relaxed">{eco.summary.benefit[lang as "pl" | "en"]}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-red-400/80 font-bold mb-1.5 uppercase tracking-wider">{lang === "pl" ? "Ryzyko Biznesowe" : "Business Risk"}</div>
                      <div className="text-xs text-white/90 leading-relaxed">{eco.summary.risk[lang as "pl" | "en"]}</div>
                    </div>
                  </div>
                </div>

                {/* Mobile perspective description at the bottom of feed */}
                <div className="mt-6 mb-8 p-4 rounded-xl border border-white/5 bg-white/5 text-xs text-white/60 leading-relaxed">
                  {persp.desc(ecosystem)}
                </div>
              </div>

              {!showDetail && (
                <motion.div className="absolute bottom-16 sm:bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none"
                  animate={{ y: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  <div className="text-white/60 text-xs font-mono">wybierz węzeł ze ścieżki</div>
                  <div className="text-white/90 text-lg mt-0.5">↕</div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM BAR (journey only) */}
      {screen === "journey" && (
        <div className="hidden lg:flex absolute bottom-0 left-0 right-0 z-50 items-center justify-between px-5 h-12"
          style={{ background: "rgba(2,8,24,0.9)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button onClick={() => { goToNode(Math.max(0, activeNodeIdx - 1)); stopPlay(); }}
            disabled={activeNodeIdx === 0}
            className="text-xs text-white/90 hover:text-white/90 disabled:opacity-15 disabled:cursor-not-allowed transition-colors cursor-pointer">
            ← Poprzedni
          </button>

          <div className="text-center">
            <span className="text-[10px] font-mono" style={{ color: persp.color }}>{persp.emoji} {persp.label}</span>
            <span className="mx-2 text-white/10">·</span>
            <span className="text-[10px] font-mono" style={{ color: eco.color }}>{eco.icon} {eco.name}</span>
          </div>

          <button onClick={() => { goToNode(Math.min(NODES.length - 1, activeNodeIdx + 1)); stopPlay(); }}
            disabled={activeNodeIdx === NODES.length - 1}
            className="text-xs text-white/90 hover:text-white/90 disabled:opacity-15 disabled:cursor-not-allowed transition-colors cursor-pointer">
            Następny →
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Stars ─────────────────────────────────────────────────── */

function Stars() {
  const stars = useRef<Array<{ x: number; y: number; size: number; delay: number; dur: number }>>([]);
  if (stars.current.length === 0) {
    stars.current = Array.from({ length: 160 }, () => ({
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.4,
      delay: Math.random() * 4, dur: Math.random() * 3 + 2,
    }));
  }
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.current.map((s, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0.08, 0.85, 0.08] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #3b82f6, transparent)", filter: "blur(70px)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #7c3aed, transparent)", filter: "blur(55px)" }} />
      <div className="absolute top-2/3 left-1/3 w-80 h-80 rounded-full opacity-4" style={{ background: "radial-gradient(circle, #22c55e, transparent)", filter: "blur(80px)" }} />
    </div>
  );
}
