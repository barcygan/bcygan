"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ─── Types ─────────────────────────────────────────────────── */

type Screen = "welcome" | "journey";
type EcosystemId = "meta" | "google" | "tiktok" | "asa";
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
    description: "Meta nie ma bezpośredniej integracji z GA4. Atrybucja przez sklep wymaga MMP (np. AppsFlyer, Adjust) i SKAdNetwork na iOS.",
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
    description: "Google Ads ma natywną integrację z Firebase/GA4 przez Google Play Install Referrer i SKAN. Często nie potrzeba third-party MMP dla kampanii czysto Google.",
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
    description: "TikTok nie ma natywnej integracji z GA4. Własna atrybucja TikTok jest silnie stronnicza (self-attribution). MMP wymagany dla wiarygodnych danych.",
  },
  {
    id: "asa" as EcosystemId,
    icon: <AppleIcon />,
    name: "Apple Search Ads",
    sub: "App Store · AdAttributionKit",
    color: "#a8b3cf",
    glow: "rgba(168,179,207,0.3)",
    dim: "rgba(168,179,207,0.1)",
    defaultCampaign: "asa_fitness_brand",
    badge: "Wbudowane w iOS",
    badgeColor: "#3b82f6",
    description: "Apple Search Ads jest wyjątkowy — bezpośrednio zintegrowany z iOS i AdAttributionKit. Nie potrzebuje SKAN ani third-party MMP. Atrybucja deterministyczna bez ATT.",
  },
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
      : "GA4 widzi zachowanie wewnątrz aplikacji, ale na iOS gubi kontekst (źródło) podczas przejścia przez Sklep.",
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
        : "MMP stara się połączyć kliknięcie z instalacją używając technologii Deferred Deep Linkingu.",
  },
  skan: {
    label: "Poziom Systemu (SKAN / OS)",
    emoji: "⚙️",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.4)",
    dim: "rgba(59,130,246,0.12)",
    desc: (eco) => eco === "asa"
      ? "ASA korzysta z deterministycznego AdAttributionKit. Brak okna ATT, brak anonimizacji."
      : "Na iOS: zanonimizowany SKAdNetwork z opóźnieniami. Na Androidzie: natywny Google Play Install Referrer w tle.",
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
        ga4: { status: "hidden", dataState: [], note: "Firebase SDK jest uśpiony. GA4 webowe może widzieć kliknięcie, ale sesja mobilna jeszcze się nie zaczęła." },
        mmp: { status: "visible", dataState: [
          { label: "utm_campaign", value: "spring_sale_vip", status: "ok" },
          { label: "MMP Click Link", value: "wygenerowany ✓", status: "ok" },
          { label: "Kierowanie", value: "sprawdza czy masz apkę", status: "ok" }
        ], note: "MMP linkuje kliknięcie. Rozpoznaje urządzenie i sprawdza: 'Ma apkę? → Deep Link. Brak apki? → Sklep'." },
        skan: { status: "partial", dataState: [
          { label: "Ad Network ID", value: "podpisany", status: "ok" },
          { label: "User ID (ATT)", value: "zależne od zgody", status: "partial" }
        ], note: "Na poziomie systemu podpisuje się intencję reklamową. Jeśli użytkownik ma iOS i zablokował śledzenie, brak User ID." },
      },
      google: {
        ga4: { status: "visible", dataState: [
          { label: "utm_campaign", value: "spring_sale_vip", status: "ok" },
          { label: "gclid", value: "wygenerowany ✓", status: "ok" }
        ], note: "Dzięki ekosystemowi Google, gclid i utm zostają dopisane do kliknięcia na poziomie przeglądarki Web/Youtube." },
        mmp: { status: "visible", dataState: [
          { label: "utm_campaign", value: "spring_sale_vip", status: "ok" },
          { label: "gclid", value: "zarejestrowany", status: "ok" }
        ], note: "MMP zbiera informację o kliknięciu z kampanii UAC / Search i przygotowuje się na ewentualny Deferred Deep Link." },
        skan: { status: "partial", dataState: [
          { label: "[iOS] SKAN ID", value: "aktywny", status: "ok" },
          { label: "[Android] Play", value: "rejestruje start", status: "ok" }
        ], note: "Na iOS generowany jest podpis SKAN. Na Androidzie Google Play szykuje się do przekazania Install Referrer." },
      },
      tiktok: {
        ga4: { status: "hidden", dataState: [], note: "Brak integracji TikTok Ads z Firebase na etapie kliknięcia w in-app browser." },
        mmp: { status: "visible", dataState: [
          { label: "utm_campaign", value: "spring_sale_vip", status: "ok" },
          { label: "ttclid", value: "wygenerowany ✓", status: "ok" }
        ], note: "MMP rejestruje kliknięcie z TikTok i generuje fingerprint dla przeglądarki In-App TikToka, żeby rozpoznać instalację." },
        skan: { status: "partial", dataState: [
          { label: "SKAN ID", value: "TikTok iOS", status: "ok" },
          { label: "User ID", value: "zazwyczaj brak (ATT)", status: "lost" }
        ], note: "TikTok podpisuje kliknięcie w SKAN. Jeśli użytkownik odmawia śledzenia, gubimy identyfikator reklamowy." },
      },
      asa: {
        ga4: { status: "partial", dataState: [
          { label: "utm_campaign", value: "N/A", status: "lost" },
          { label: "AdAttrib token", value: "wygenerowany", status: "ok" }
        ], note: "Kampania ASA nie używa tradycyjnych tagów UTM, opiera się wyłącznie na tokenie systemowym iOS." },
        mmp: { status: "partial", dataState: [
          { label: "MMP SDK", value: "czeka w aplikacji", status: "partial" }
        ], note: "MMP nie ma bezpośredniego linku przekierowującego (bo ASA dzieje się wewnątrz App Store). Czeka aż użytkownik otworzy aplikację." },
        skan: { status: "visible", dataState: [
          { label: "AdAttributionKit", value: "aktywny ✓", status: "ok" },
          { label: "Privacy Limits", value: "brak okna ATT ✓", status: "ok" }
        ], note: "Poziom Systemu: Apple w pełni i deterministycznie rejestruje kliknięcie reklamowe bezpośrednio w swoim sklepie, ignorując ATT." },
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
        ], note: "Czarna dziura. Dla użytkownika bez aplikacji przejście przez App Store całkowicie czyści parametry UTM. GA4 ślepnie." },
        mmp: { status: "partial", dataState: [
          { label: "[Android] Referrer", value: "niezawodny ✓", status: "ok" },
          { label: "[iOS] Fingerprint", value: "niedokładny ⚠️", status: "partial" }
        ], note: "Użytkownik nie miał apki. Na Androidzie Install Referrer poda nam skąd przyszedł. Na iOS MMP musi zgadywać (Fingerprinting) lub czekać na powolny SKAN." },
        skan: { status: "visible", dataState: [
          { label: "[iOS] SKAN", value: "rejestruje pobranie", status: "ok" },
          { label: "[Android]", value: "Play Store Play API", status: "ok" }
        ], note: "Systemy operacyjne zawsze wiedzą, że użytkownik kliknął i pobrał aplikację. Systemowy tracker zaczyna działać niezależnie." },
      },
      google: {
        ga4: { status: "visible", dataState: [
          { label: "[Android] gclid", value: "zapisany w Play ✓", status: "ok" },
          { label: "[iOS] gclid", value: "UTRACONY ❌", status: "lost" }
        ], note: "Dzięki symbiozie na Androidzie, Sklep Play chroni parametr gclid i czeka z nim na Firebase. Na iOS niestety gclid bezpowrotnie ginie w App Store." },
        mmp: { status: "partial", dataState: [
          { label: "[Android] Referrer", value: "gclid + utm ✓", status: "ok" },
          { label: "[iOS] Deferred DL", value: "niestabilny ⚠️", status: "partial" }
        ], note: "Na Androidzie MMP radzi sobie doskonale. Na iOS Apple walczy z Deferred Deep Linkingiem opartym na dopasowywaniu adresów IP." },
        skan: { status: "partial", dataState: [
          { label: "[iOS] SKAN", value: "pobranie odnotowane", status: "ok" },
          { label: "Timer", value: "zaczyna odliczać", status: "delayed" }
        ], note: "Z punktu widzenia systemu pobranie się udaje, ale na iOS uruchamia się kilkudziesięciogodzinny stoper zanim Apple wyśle dane." },
      },
      tiktok: {
        ga4: { status: "blackhole", dataState: [
          { label: "utm_campaign", value: "wyczyszczone", status: "lost" },
          { label: "ttclid", value: "wyczyszczone", status: "lost" }
        ], note: "Rozpoczyna się czarna dziura dla GA4. Ruch przychodzi jako Organic / Direct po pobraniu." },
        mmp: { status: "partial", dataState: [
          { label: "[Android] Referrer", value: "podaje ttclid ✓", status: "ok" },
          { label: "[iOS] IP Match", value: "niska skuteczność", status: "partial" }
        ], note: "MMP na Androidzie świetnie odzyskuje ttclid z Referrera. Na iOS utrata danych jest potężna z powodu izolacji przeglądarki TikToka od Safari." },
        skan: { status: "visible", dataState: [
          { label: "[iOS] SKAN", value: "rejestracja Apple", status: "ok" },
          { label: "[Android] Play", value: "rejestracja Google", status: "ok" }
        ], note: "Systemy operacyjne działają niezawodnie i w pełni przypisują instalację TikToka pod spodem, mimo braku dostępu dla narzędzi analitycznych." },
      },
      asa: {
        ga4: { status: "partial", dataState: [
          { label: "App Store", value: "generuje token ✓", status: "ok" },
          { label: "utm_campaign", value: "N/A", status: "lost" }
        ], note: "GA4 czeka na uruchomienie aplikacji. App Store przechowuje bezpieczny token instalacyjny dla aplikacji." },
        mmp: { status: "visible", dataState: [
          { label: "App Store", value: "natywna atrybucja ✓", status: "ok" }
        ], note: "MMP nie uczestniczy aktywnie w przekazywaniu linku, bo ASA działa na serwerach Apple. Czeka aż aplikacja pobierze dane systemowe." },
        skan: { status: "visible", dataState: [
          { label: "[iOS] AdAttribKit", value: "natychmiastowe ✓", status: "ok" },
          { label: "Deterministyczne", value: "100% pewności ✓", status: "ok" }
        ], note: "Dla Apple Search Ads sklep App Store nie jest czarną dziurą – to główny punkt idealnej atrybucji deterministycznej." },
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
        ], note: "Aplikacja się otwiera. Jednak bez zintegrowanego MMP, Firebase GA4 kompletnie nie wie, że instalacja pochodzi z Meta Ads. Kampania spring_sale_vip przypisana do Organic." },
        mmp: { status: "visible", dataState: [
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "deep link", value: "przenosi na promocję ✓", status: "ok" },
          { label: "→ Meta CAPI", value: "wysyła postback ✓", status: "ok" }
        ], note: "MMP budzi się jako pierwsze. Odzyskuje informacje ze Sklepu, odbudowuje sesję i wymusza Deferred Deep Link na odpowiednią zakładkę (Wyprzedaż) w aplikacji." },
        skan: { status: "partial", dataState: [
          { label: "[iOS] CV", value: "aktualizacja 1 (app)", status: "partial" },
          { label: "Postback", value: "⏳ oczekuje", status: "delayed" }
        ], note: "Aplikacja na iOS przypisuje domyślną Wartość Konwersji (CV), ale postback wciąż czeka w kolejce systemu Apple." },
      },
      google: {
        ga4: { status: "visible", dataState: [
          { label: "[Android] kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "[iOS] kampania", value: "(direct) ❌", status: "lost" },
          { label: "[Android] deep link", value: "auto-redirect ✓", status: "ok" }
        ], note: "Niesamowita przewaga na Androidzie! GA4 natychmiast przechwytuje dane i użytkownik trafia na ekran Wyprzedaży. Na iOS niestety proces ten zawodzi i ruch ląduje w (direct)." },
        mmp: { status: "visible", dataState: [
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "→ Google Ads", value: "potwierdzenie ✓", status: "ok" }
        ], note: "Podobnie jak w GA4, MMP poprawnie atrybuuje instalację na Androidzie. Na iOS wspiera się modelowaniem lub SKANem." },
        skan: { status: "partial", dataState: [
          { label: "[iOS] CV", value: "aktualizacja", status: "partial" },
          { label: "Postback", value: "⏳ oczekuje", status: "delayed" }
        ], note: "System operacyjny na bieżąco monitoruje aplikację dla SKAdNetwork. Nic się nie zmienia wizualnie." },
      },
      tiktok: {
        ga4: { status: "partial", dataState: [
          { label: "event", value: "first_open ✓", status: "ok" },
          { label: "kampania", value: "(direct) ❌", status: "lost" }
        ], note: "GA4 widzi first_open, ale przypisuje go do (direct). Nie mamy pojęcia, że użytkownik przyszedł z TikToka." },
        mmp: { status: "visible", dataState: [
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "[Android]", value: "100% atrybucja ✓", status: "ok" },
          { label: "[iOS]", value: "niska szansa dopasowania", status: "partial" }
        ], note: "Na Androidzie MMP poprawnie kieruje na ekran Wiosennej Wyprzedaży. Na iOS użytkownik może trafić na ekran główny apki (broken deferred deep link)." },
        skan: { status: "partial", dataState: [
          { label: "[iOS] CV", value: "aktualizacja", status: "partial" }
        ], note: "Zanonimizowany identyfikator instalacji przypisany w SKAdNetwork na iOS." },
      },
      asa: {
        ga4: { status: "visible", dataState: [
          { label: "event", value: "first_open ✓", status: "ok" },
          { label: "AdAttribKit", value: "odczyt tokenu ✓", status: "ok" },
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" }
        ], note: "Jeżeli deweloper napisał kod odczytujący Apple AdAttributionKit w momencie first_open i wysłał to do GA4 – otrzymujemy idealną, natywną atrybucję na iOS!" },
        mmp: { status: "visible", dataState: [
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "Atrybucja", value: "deterministyczna iOS ✓", status: "ok" }
        ], note: "MMP bezbłędnie przechwytuje token od Apple. Pełna gwarancja atrybucji na urządzeniach z iOS." },
        skan: { status: "visible", dataState: [
          { label: "AdAttributionKit", value: "sukces ✓", status: "ok" },
          { label: "Postback", value: "brak opóźnień ✓", status: "ok" }
        ], note: "Rozwiązanie systemowe zadziałało natychmiastowo. Zero czarnej dziury, zero opóźnień." },
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
        ], note: "Zakup zakończony sukcesem! Jednak w panelu GA4 revenue (349 PLN) przypisze się do ruchu (direct), co sprawia, że analityk obcina budżet Meta Ads (niski ROAS)." },
        mmp: { status: "visible", dataState: [
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "revenue", value: "349.00 PLN ✓", status: "ok" },
          { label: "→ Meta CAPI", value: "wysyła ROAS ✓", status: "ok" }
        ], note: "MMP przypisuje zakup 349 PLN do Meta Ads i wysyła Server-to-Server postback (CAPI). Algorytmy FB uczą się, do kogo kierować reklamy wyprzedaży." },
        skan: { status: "partial", dataState: [
          { label: "[iOS] CV Update", value: "349 PLN (skrzynka 4)", status: "partial" },
          { label: "[iOS] Postback", value: "⏳ w końcu wysłany", status: "delayed" }
        ], note: "SKAN na iOS podbija wartość konwersji (CV) do najwyższego progu odpowiadającego 349 PLN i blokuje timer, szykując się do opóźnionego postbacku do Meta." },
      },
      google: {
        ga4: { status: "visible", dataState: [
          { label: "event", value: "purchase ✓", status: "ok" },
          { label: "[Android] kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "[iOS] kampania", value: "(direct) ❌", status: "lost" }
        ], note: "Ekosystem dzieli się w pół: Na Androidzie GA4 perfekcyjnie przypisuje 349 PLN do kampanii Google Ads i ROAS jest genialny. Na iOS pełna porażka – ruch wpada do (direct)." },
        mmp: { status: "visible", dataState: [
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "revenue", value: "349.00 PLN ✓", status: "ok" },
          { label: "→ Google API", value: "aktualizacja ROAS ✓", status: "ok" }
        ], note: "MMP ratuje sprawę wysyłając postback z zakupem 349 PLN bezpośrednio do Google Ads API." },
        skan: { status: "partial", dataState: [
          { label: "[iOS] CV", value: "349 PLN", status: "partial" },
          { label: "[Android]", value: "nie dotyczy", status: "ok" }
        ], note: "Google Ads na iOS ostatecznie polega na opóźnionym zanonimizowanym postbacku SKAN dla celów optymalizacyjnych." },
      },
      tiktok: {
        ga4: { status: "visible", dataState: [
          { label: "event", value: "purchase ✓", status: "ok" },
          { label: "revenue", value: "349.00 PLN ✓", status: "ok" },
          { label: "kampania", value: "(direct) ❌", status: "lost" }
        ], note: "Zakup odnotowany, ale w GA4 pojawia się wielka pusta plama w raportach TikTok Ads (przypisane do direct)." },
        mmp: { status: "visible", dataState: [
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "revenue", value: "349.00 PLN ✓", status: "ok" },
          { label: "→ TikTok Events", value: "wysyła ROAS ✓", status: "ok" }
        ], note: "MMP pozwala reklamodawcy udowodnić zwrot z inwestycji z TikTok Ads, wysyłając postback konwersyjny." },
        skan: { status: "partial", dataState: [
          { label: "[iOS] CV", value: "349 PLN", status: "partial" },
          { label: "[iOS] Postback", value: "⏳ opóźnienie 24-48h", status: "delayed" }
        ], note: "System Apple na iOS anonimizuje i opóźnia dane o zakupie 349 PLN zanim poinformuje TikToka." },
      },
      asa: {
        ga4: { status: "visible", dataState: [
          { label: "event", value: "purchase ✓", status: "ok" },
          { label: "revenue", value: "349.00 PLN ✓", status: "ok" },
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" }
        ], note: "Dzięki deterministycznej integracji AdAttributionKit z GA4, zakup na iOS jest perfekcyjnie powiązany ze słowem kluczowym i kampanią ASA." },
        mmp: { status: "visible", dataState: [
          { label: "kampania", value: "spring_sale_vip ✓", status: "ok" },
          { label: "revenue", value: "349.00 PLN ✓", status: "ok" }
        ], note: "MMP otrzymuje perfekcyjne dane na systemie iOS – żadnych strat, modelowania, opóźnień." },
        skan: { status: "visible", dataState: [
          { label: "[iOS] AdAttribKit", value: "potwierdzenie ✓", status: "ok" },
          { label: "wartość", value: "pełna, bez agregacji ✓", status: "ok" }
        ], note: "Poziom systemu raportuje pełen sukces atrybucji natychmiast do panelu Apple Search Ads, dostarczając dokładny pomiar ROAS." },
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
      className="flex flex-col lg:flex-row items-center justify-between w-full h-full px-6 pt-12 pb-8 sm:pt-20 text-center lg:text-left relative overflow-hidden gap-8 lg:gap-16 max-w-7xl mx-auto"
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
        className="text-[11px] text-white/60 font-mono mt-2 absolute bottom-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}
      >
        {isPl ? "najedź na planetę, aby zobaczyć szczegóły" : "hover a planet to see details"}
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
                
                {/* Mobile perspective description at the bottom of feed */}
                <div className="mt-8 mb-8 p-4 rounded-xl border border-white/5 bg-white/5 text-xs text-white/60 leading-relaxed">
                  {persp.desc(ecosystem)}
                </div>
              </div>

              {!showDetail && (
                <motion.div className="absolute bottom-16 sm:bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none"
                  animate={{ y: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  <div className="text-white/60 text-xs font-mono">scroll lub kliknij węzeł</div>
                  <div className="text-white/90 text-lg mt-0.5">↕</div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM BAR (journey only) */}
      {screen === "journey" && (
        <div className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-between px-5 h-12"
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
