"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ─── Types ─────────────────────────────────────────────────── */

type Screen = "welcome" | "journey";
type EcosystemId = "meta" | "google" | "tiktok" | "asa";
type PerspectiveId = "ga4" | "mmp" | "skan" | "android";
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
      ? "GA4 z Google Ads ma natywną integrację — widzi skąd przyszedł użytkownik."
      : "GA4 widzi zachowanie wewnątrz aplikacji. Bez MMP, kampania reklamowa jest niewidoczna.",
  },
  mmp: {
    label: "MMP (AppsFlyer / Adjust)",
    emoji: "🟢",
    color: "#22c55e",
    glow: "rgba(34,197,94,0.4)",
    dim: "rgba(34,197,94,0.12)",
    desc: (eco) => eco === "asa"
      ? "ASA nie potrzebuje MMP — AdAttributionKit zastępuje jego rolę natywnie."
      : eco === "google"
        ? "MMP jest opcjonalny dla Google Ads, ale wymagany przy kampaniach multi-network."
        : "MMP łączy kliknięcie z instalacją przez czarną dziurę sklepu. Jedyne narzędzie pełnej atrybucji.",
  },
  skan: {
    label: "SKAdNetwork / AdAttributionKit",
    emoji: "🍏",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.4)",
    dim: "rgba(59,130,246,0.12)",
    desc: (eco) => eco === "asa"
      ? "ASA używa AdAttributionKit zamiast SKAN. Atrybucja deterministyczna — pełna widoczność bez anonimizacji."
      : "Apple SKAN: atrybucja iOS zachowująca prywatność. Dane zanonimizowane, opóźnione i zagregowane.",
  },
  android: {
    label: "Android (Google Play)",
    emoji: "🤖",
    color: "#a4c639",
    glow: "rgba(164,198,57,0.4)",
    dim: "rgba(164,198,57,0.12)",
    desc: (eco) => eco === "asa"
      ? "Apple Search Ads występuje wyłącznie na platformie iOS. Ten scenariusz nie ma zastosowania na urządzeniach z Androidem."
      : "Na Androidzie główną rolę odgrywa Google Play Install Referrer. Pozwala na atrybucję deterministyczną bez okna ATT.",
  },
};

/* ─── Journey node data ─────────────────────────────────────── */

const NODES: JourneyNode[] = [
  {
    id: "ad",
    icon: "📣",
    label: "Kliknięcie Reklamy",
    sublabel: (eco) => {
      const e = ECOSYSTEMS.find(e => e.id === eco)!;
      return `${e.name} · utm_campaign=${e.defaultCampaign}`;
    },
    data: {
      meta: {
        ga4: { status: "hidden", dataState: [], note: "GA4 nie istnieje w tej przestrzeni. Piksel Meta i serwer MMP rejestrują kliknięcie — Firebase SDK jest uśpiony." },
        mmp: { status: "visible", dataState: [
          { label: "utm_campaign", value: "testowa_kampania", status: "ok" },
          { label: "utm_source",   value: "meta",             status: "ok" },
          { label: "utm_content",  value: "kreacja_video_v2", status: "ok" },
          { label: "click_id",     value: "c3f8a29b...",      status: "ok" },
          { label: "fingerprint",  value: "IP + UA saved",    status: "ok" },
        ], note: "MMP rejestruje kliknięcie z pełnym kontekstem Meta. Dane kampanii, kreacji i click_id zapisane na serwerach MMP, gotowe do dopasowania z instalacją." },
        skan: { status: "partial", dataState: [
          { label: "utm_campaign",    value: "testowa_kampania", status: "ok" },
          { label: "SKAN Network ID", value: "Meta (podpisany)", status: "ok" },
          { label: "User ID",         value: "brak",             status: "anon" },
        ], note: "Meta podpisuje kliknięcie kryptograficznie. Dane kampanii istnieją w systemie Apple, ale User ID jest niedostępny z zasad prywatności." },
        android: { status: "visible", dataState: [ { label: "utm_campaign", value: "testowa_kampania ✓", status: "ok" }, { label: "ATT limit", value: "brak ✓", status: "ok" } ], note: "Na Androidzie nie ma okna ATT. Aplikacje mogą korzystać z Google Advertising ID (GAID) do identyfikacji użytkownika przy kliknięciu." },
      },
      google: {
        ga4: { status: "visible", dataState: [
          { label: "utm_campaign",   value: "uac_fitness_kwiecien", status: "ok" },
          { label: "gclid",          value: "Cj0KCQiA... ✓",        status: "ok" },
          { label: "Firebase link",  value: "natywna integracja",    status: "ok" },
        ], note: "Google Ads i GA4 komunikują się przez gclid i natywną integrację Firebase. GA4 widzi kliknięcie bezpośrednio — to unikalna przewaga Google Ads nad innymi sieciami." },
        mmp: { status: "partial", dataState: [
          { label: "utm_campaign",  value: "uac_fitness_kwiecien", status: "ok" },
          { label: "gclid",         value: "opcjonalnie",          status: "partial" },
          { label: "Google Ads API", value: "bezpośrednia integracja", status: "ok" },
        ], note: "MMP rejestruje kliknięcie Google Ads przez Play Install Referrer. Jednak przy kampaniach czysto Google, MMP jest opcjonalny — GA4 radzi sobie natywnie." },
        skan: { status: "partial", dataState: [
          { label: "SKAN Network ID", value: "Google (iOS)",  status: "ok" },
          { label: "gclid",           value: "brak na iOS",   status: "lost" },
          { label: "User ID",         value: "brak",          status: "anon" },
        ], note: "Na iOS, Google Ads też używa SKAdNetwork. gclid jest niedostępny po kliknięciu na iOS — Apple blokuje identyfikatory." },
        android: { status: "visible", dataState: [ { label: "gclid", value: "natywny ✓", status: "ok" }, { label: "Firebase", value: "bezpośredni", status: "ok" } ], note: "Dla Google Ads środowisko Android to domowy ekosystem. Pełna widoczność kliknięcia." },
      },
      tiktok: {
        ga4: { status: "hidden", dataState: [], note: "TikTok Ads nie ma integracji z GA4. Piksel TikTok działa osobno — Firebase SDK jest nieaktywny w momencie kliknięcia." },
        mmp: { status: "visible", dataState: [
          { label: "utm_campaign", value: "tt_viral_fitness", status: "ok" },
          { label: "utm_source",   value: "tiktok",           status: "ok" },
          { label: "ttclid",       value: "TkAd_c9x...",      status: "ok" },
          { label: "fingerprint",  value: "IP + UA saved",    status: "ok" },
        ], note: "MMP rejestruje kliknięcie TikTok z ttclid i parametrami UTM. Własna atrybucja TikTok Ads jest silnie self-attributed — MMP jest niezbędny dla neutralnych danych." },
        skan: { status: "partial", dataState: [
          { label: "utm_campaign",    value: "tt_viral_fitness", status: "ok" },
          { label: "SKAN Network ID", value: "TikTok (iOS)",     status: "ok" },
          { label: "User ID",         value: "brak",             status: "anon" },
        ], note: "TikTok jest zarejestrowany jako SKAN Network u Apple. Kliknięcie jest podpisane — ale bez User ID." },
        android: { status: "visible", dataState: [ { label: "ttclid", value: "przechwycony ✓", status: "ok" }, { label: "GAID", value: "dostępny ✓", status: "ok" } ], note: "TikTok zapisuje identyfikator ttclid. Na Androidzie proces ten jest niezaburzony ograniczeniami prywatności Apple." },
      },
      asa: {
        ga4: { status: "partial", dataState: [
          { label: "utm_campaign",  value: "brak (ASA nie używa UTM)", status: "partial" },
          { label: "AdAttrib token", value: "przekazany do app",        status: "ok" },
          { label: "GA4 event",     value: "wymaga implementacji",      status: "partial" },
        ], note: "ASA nie używa UTM. AdAttributionKit przekazuje token atrybucji bezpośrednio do aplikacji. GA4 może go odebrać, ale wymaga niestandardowej implementacji." },
        mmp: { status: "partial", dataState: [
          { label: "ASA attribution", value: "natywna, bez MMP",       status: "ok" },
          { label: "MMP rola",        value: "opcjonalna (agregacja)",  status: "partial" },
          { label: "ttclid / gclid",  value: "brak",                   status: "anon" },
        ], note: "ASA nie potrzebuje MMP do atrybucji — Apple dostarcza ją natywnie. MMP może integrować dane ASA jako jeden kanał w raportach multi-network." },
        skan: { status: "visible", dataState: [
          { label: "AdAttributionKit", value: "aktywny ✓",          status: "ok" },
          { label: "Atrybucja",        value: "deterministyczna ✓",  status: "ok" },
          { label: "User ID",          value: "dostępny (za zgodą)", status: "ok" },
        ], note: "Apple Search Ads używa AdAttributionKit — następcy SKAN. To unikalny przywilej: atrybucja deterministyczna na iOS bez konieczności ATT consent!" },
        android: { status: "hidden", dataState: [], note: "Apple Search Ads występuje wyłącznie w środowisku iOS. Ten krok nie dotyczy urządzeń z Androidem." },
      },
    },
  },
  {
    id: "store",
    icon: "🏬",
    label: "Sklep aplikacji",
    sublabel: (eco) => eco === "asa" ? "App Store — ASA zintegrowany natywnie" : eco === "google" ? "Google Play — Install Referrer" : "App Store / Google Play — silo",
    data: {
      meta: {
        ga4: { status: "hidden", dataState: [], note: "Firebase SDK nie ma dostępu do sklepu. Parametry UTM zostają odcięte na granicy App Store / Google Play." },
        mmp: { status: "partial", dataState: [
          { label: "Play Install Referrer", value: "Android: aktywny ✓", status: "ok" },
          { label: "Deferred Deep Link",    value: "iOS: clipboard",      status: "partial" },
          { label: "utm_campaign",          value: "w tranzyt...",        status: "partial" },
        ], note: "MMP używa Play Install Referrer (Android) i Deferred Deep Link (iOS) do przeniesienia kontekstu kampanii przez sklep. Android działa lepiej." },
        skan: { status: "visible", dataState: [
          { label: "SKAN weryfikacja", value: "Apple zatwierdza", status: "ok" },
          { label: "timer postbacku",  value: "24h–35 dni START", status: "delayed" },
        ], note: "App Store ma wbudowaną obsługę SKAN. Instalacja rejestrowana systemowo. Timer postbacku rusza." },
        android: { status: "visible", dataState: [ { label: "Play Install Referrer", value: "aktywny ✓", status: "ok" }, { label: "Deferred Deep Link", value: "działa ✓", status: "ok" } ], note: "Sklep Google Play oferuje API 'Install Referrer', które pozwala na bezpieczne i precyzyjne przekazanie informacji o kliknięciu z powrotem do aplikacji." },
      },
      google: {
        ga4: { status: "visible", dataState: [
          { label: "Play Install Referrer", value: "gclid przekazany ✓", status: "ok" },
          { label: "utm_campaign",          value: "uac_fitness_kwiecien ✓", status: "ok" },
          { label: "Firebase auto-link",    value: "aktywny ✓",          status: "ok" },
        ], note: "Google Play automatycznie przekazuje gclid do Firebase przez Install Referrer. To bezpośrednia droga — bez potrzeby MMP na Androidzie. Wyjątkowa przewaga Google Ads." },
        mmp: { status: "visible", dataState: [
          { label: "Play Install Referrer", value: "gclid + UTM ✓", status: "ok" },
          { label: "utm_campaign",          value: "uac_fitness_kwiecien ✓", status: "ok" },
        ], note: "Play Install Referrer działa również dla MMP. Google Ads dostarcza gclid i UTM przez sklep." },
        skan: { status: "partial", dataState: [
          { label: "SKAN (iOS)",    value: "aktywny",         status: "ok" },
          { label: "gclid iOS",     value: "niedostępny",     status: "lost" },
          { label: "timer",         value: "24h–35 dni",      status: "delayed" },
        ], note: "Na iOS, Google Ads traci gclid przez App Store — wraca do SKAN jak inne sieci. Android jest znacznie lepszy dla Google Ads." },
        android: { status: "visible", dataState: [ { label: "Sklep Play", value: "własny ekosystem ✓", status: "ok" }, { label: "gclid", value: "przechodzi dalej ✓", status: "ok" } ], note: "Sklep nie jest czarną dziurą. Google automatycznie przekazuje informacje o kampanii przez Play Store do aplikacji." },
      },
      tiktok: {
        ga4: { status: "hidden", dataState: [], note: "Sklep to bariera dla GA4 — parametry TikTok nie mają ścieżki przez App Store / Play Store do Firebase." },
        mmp: { status: "partial", dataState: [
          { label: "Play Install Referrer", value: "Android: ttclid ✓", status: "ok" },
          { label: "Deferred Deep Link",    value: "iOS: ograniczone",   status: "partial" },
          { label: "ttclid iOS",            value: "trudny do przeniesienia", status: "partial" },
        ], note: "TikTok Ads na iOS ma trudności z przekazaniem ttclid przez App Store. Android działa przez Play Install Referrer. MMP pomaga, ale dane iOS są niepewne." },
        skan: { status: "visible", dataState: [
          { label: "SKAN (iOS)", value: "weryfikuje Apple", status: "ok" },
          { label: "timer",      value: "start",           status: "delayed" },
        ], note: "SKAN obsługuje TikTok iOS niezawodnie. Instalacja zarejestrowana systemowo." },
        android: { status: "visible", dataState: [ { label: "Play Install Referrer", value: "aktywny ✓", status: "ok" }, { label: "ttclid", value: "w tranzycie ✓", status: "ok" } ], note: "Podobnie jak Meta, TikTok wykorzystuje Google Play Install Referrer do przeniesienia swoich parametrów przez sklep." },
      },
      asa: {
        ga4: { status: "partial", dataState: [
          { label: "AdAttrib token", value: "przekazany przez App Store ✓", status: "ok" },
          { label: "utm_campaign",   value: "brak",                         status: "lost" },
        ], note: "App Store przekazuje token AdAttributionKit bezpośrednio do aplikacji przy pierwszym uruchomieniu. Brak UTM — ale token zawiera pełne dane kampanii ASA." },
        mmp: { status: "partial", dataState: [
          { label: "AdAttrib token", value: "przechwycony przez MMP", status: "partial" },
          { label: "ASA atrybucja",  value: "natywna",               status: "ok" },
        ], note: "MMP może przechwycić token ASA przez AdAttributionKit SDK. Pozwala na włączenie ASA do raportów multi-network w jednym miejscu." },
        skan: { status: "visible", dataState: [
          { label: "AdAttributionKit", value: "natywna atrybucja ✓",    status: "ok" },
          { label: "bez timera",       value: "wynik natychmiastowy ✓", status: "ok" },
          { label: "bez SKAN",         value: "nie potrzeba",           status: "ok" },
        ], note: "ASA omija SKAN całkowicie. AdAttributionKit działa bezpośrednio między App Store a aplikacją. Atrybucja deterministyczna — to wyjątkowy przywilej Apple Search Ads." },
        android: { status: "hidden", dataState: [], note: "Brak reklamy Apple Search Ads w Google Play." },
      },
    },
  },
  {
    id: "install",
    icon: "⚫",
    label: "Instalacja",
    sublabel: () => "Czarna dziura atrybucji",
    isBlackHole: true,
    data: {
      meta: {
        ga4: { status: "blackhole", dataState: [
          { label: "utm_campaign", value: "UTRACONE",                     status: "lost" },
          { label: "utm_source",   value: "UTRACONE",                     status: "lost" },
          { label: "iOS atrybucja", value: "niemożliwa bez MMP",         status: "lost" },
          { label: "Android",      value: "wymaga Install Referrer config", status: "partial" },
        ], note: "Czarna dziura. Bez MMP, GA4 nie wie że kampania 'testowa_kampania' sprowadziła tego użytkownika. iOS jest kompletnie ślepy." },
        mmp: { status: "visible", dataState: [
          { label: "utm_campaign", value: "testowa_kampania ✓", status: "ok" },
          { label: "atrybucja",    value: "deterministyczna ✓", status: "ok" },
          { label: "postback",     value: "→ Meta Ads ✓",       status: "ok" },
        ], note: "MMP SDK budzi się i rekonstruuje ścieżkę. Sygnał przywrócony — instalacja przypisana do 'testowa_kampania'. Postback do Meta wysłany." },
        skan: { status: "partial", dataState: [
          { label: "Campaign ID",  value: "42 (numeryczny)",  status: "partial" },
          { label: "utm_campaign", value: "brak",             status: "anon" },
          { label: "User ID",      value: "brak",             status: "lost" },
        ], note: "iOS potwierdza instalację po Meta. Campaign ID zamiast nazwy kampanii. Anonimowe — brak User ID." },
        android: { status: "visible", dataState: [ { label: "Install Referrer", value: "odczytany ✓", status: "ok" }, { label: "atrybucja", value: "deterministyczna", status: "ok" } ], note: "Dzięki Play Install Referrer, SDK budzi się i precyzyjnie przypisuje instalację do kliknięcia na Meta." },
      },
      google: {
        ga4: { status: "visible", dataState: [
          { label: "utm_campaign",  value: "uac_fitness_kwiecien ✓", status: "ok" },
          { label: "gclid",         value: "dopasowany ✓",           status: "ok" },
          { label: "atrybucja",     value: "natywna Firebase ✓",     status: "ok" },
        ], note: "GA4 + Google Ads: sygnał NIE ginie! Play Install Referrer przekazuje gclid do Firebase. Instalacja jest poprawnie przypisana do kampanii UAC." },
        mmp: { status: "visible", dataState: [
          { label: "utm_campaign",  value: "uac_fitness_kwiecien ✓", status: "ok" },
          { label: "gclid",         value: "przekazany ✓",           status: "ok" },
          { label: "atrybucja",     value: "potwierdzona ✓",         status: "ok" },
        ], note: "MMP potwierdza instalację z Google Ads. Na Androidzie przepływ gclid jest niezawodny." },
        skan: { status: "partial", dataState: [
          { label: "iOS Campaign ID", value: "numeryczny",  status: "partial" },
          { label: "gclid",           value: "UTRACONE iOS", status: "lost" },
          { label: "User ID",         value: "brak",         status: "anon" },
        ], note: "Na iOS, nawet Google Ads traci gclid. Instalacja potwierdzona przez SKAN ale bez nazwy kampanii i bez User ID." },
        android: { status: "visible", dataState: [ { label: "Firebase", value: "auto-link ✓", status: "ok" }, { label: "atrybucja", value: "natywna ✓", status: "ok" } ], note: "GA4 i Google Ads łączą siły na Androidzie - first_open jest perfekcyjnie połączone z kampanią UAC bez użycia MMP." },
      },
      tiktok: {
        ga4: { status: "blackhole", dataState: [
          { label: "utm_campaign", value: "UTRACONE",                 status: "lost" },
          { label: "ttclid",       value: "UTRACONE",                 status: "lost" },
          { label: "atrybucja",    value: "niemożliwa bez MMP/TTClid", status: "lost" },
        ], note: "Czarna dziura dla TikTok → GA4. Dane kampanii TikTok są całkowicie utracone bez MMP." },
        mmp: { status: "visible", dataState: [
          { label: "utm_campaign", value: "tt_viral_fitness ✓", status: "ok" },
          { label: "atrybucja",    value: "deterministyczna ✓", status: "ok" },
          { label: "postback",     value: "→ TikTok Ads ✓",    status: "ok" },
        ], note: "MMP rekonstruuje ścieżkę TikTok → instalacja. Postback wysłany z powrotem do TikTok Ads Manager." },
        skan: { status: "partial", dataState: [
          { label: "TikTok Campaign ID", value: "numeryczny",   status: "partial" },
          { label: "ttclid",             value: "brak",          status: "anon" },
          { label: "User ID",            value: "brak",          status: "lost" },
        ], note: "SKAN potwierdza instalację po TikTok. Tylko numeryczny Campaign ID — brak szczegółów kampanii." },
        android: { status: "visible", dataState: [ { label: "Install Referrer", value: "odczytany ✓", status: "ok" }, { label: "atrybucja", value: "potwierdzona ✓", status: "ok" } ], note: "MMP na Androidzie z sukcesem dopasowuje nową instalację z historią kliknięcia w aplikacji TikTok." },
      },
      asa: {
        ga4: { status: "partial", dataState: [
          { label: "AdAttrib token", value: "dostępny w app ✓", status: "ok" },
          { label: "utm_campaign",   value: "brak",             status: "lost" },
          { label: "GA4 event",      value: "z tokenem",        status: "partial" },
        ], note: "ASA dostarcza token AdAttributionKit zamiast UTM. GA4 może go odczytać jeśli aplikacja jest zaimplementowana z obsługą AAKit." },
        mmp: { status: "visible", dataState: [
          { label: "ASA kampania",     value: "asa_fitness_brand ✓", status: "ok" },
          { label: "AdAttrib token",   value: "zweryfikowany ✓",     status: "ok" },
          { label: "atrybucja",        value: "deterministyczna ✓",  status: "ok" },
        ], note: "MMP odbiera token ASA i przypisuje instalację do kampanii. Atrybucja jest natywna i deterministyczna — najwyższa jakość na iOS." },
        skan: { status: "visible", dataState: [
          { label: "AdAttributionKit", value: "instalacja potwierdzona ✓", status: "ok" },
          { label: "atrybucja",        value: "deterministyczna ✓",        status: "ok" },
          { label: "bez anonimizacji", value: "pełne dane",                status: "ok" },
        ], note: "ASA + AdAttributionKit = deterministyczna atrybucja iOS bez anonimizacji. Zero czarnej dziury — to wyjątek od reguły dla iOS." },
        android: { status: "hidden", dataState: [], note: "Nie dotyczy Androida." },
      },
    },
  },
  {
    id: "first_open",
    icon: "🚀",
    label: "first_open",
    sublabel: () => "Pierwsze uruchomienie aplikacji",
    data: {
      meta: {
        ga4: { status: "partial", dataState: [
          { label: "event",        value: "first_open ✓",  status: "ok" },
          { label: "utm_campaign", value: "(direct)",      status: "lost" },
          { label: "utm_source",   value: "(none)",        status: "lost" },
        ], note: "GA4 widzi first_open — ale bez MMP, kampania Meta jest niewidoczna. Raport: (direct) / (none)." },
        mmp: { status: "visible", dataState: [
          { label: "utm_campaign", value: "testowa_kampania ✓",  status: "ok" },
          { label: "atrybucja",    value: "potwierdzona ✓",      status: "ok" },
          { label: "→ GA4",        value: "wzbogacone dane",     status: "ok" },
        ], note: "MMP rejestruje first_open z atrybucją Meta. Wzbogaca dane GA4 o źródło pozyskania przez integrację." },
        skan: { status: "partial", dataState: [
          { label: "Conversion Value", value: "CV 0–63 (app)",   status: "partial" },
          { label: "postback",         value: "⏳ po timerze",   status: "delayed" },
          { label: "identyfikacja",    value: "anonimowa",       status: "anon" },
        ], note: "Aplikacja ustawia Conversion Value. Po timerze Apple wyśle anonimowy postback do Meta." },
        android: { status: "visible", dataState: [ { label: "Install Referrer", value: "odczytany ✓", status: "ok" }, { label: "atrybucja", value: "deterministyczna", status: "ok" } ], note: "Dzięki Play Install Referrer, SDK budzi się i precyzyjnie przypisuje instalację do kliknięcia na Meta." },
      },
      google: {
        ga4: { status: "visible", dataState: [
          { label: "event",        value: "first_open ✓",               status: "ok" },
          { label: "utm_campaign", value: "uac_fitness_kwiecien ✓",     status: "ok" },
          { label: "gclid",        value: "przypisany ✓",               status: "ok" },
          { label: "atrybucja",    value: "w GA4 ✓",                    status: "ok" },
        ], note: "GA4 widzi first_open Z pełną atrybucją do Google Ads. Kampania UAC widoczna w raportach — to unikalna przewaga ekosystemu Google." },
        mmp: { status: "visible", dataState: [
          { label: "utm_campaign",  value: "uac_fitness_kwiecien ✓", status: "ok" },
          { label: "postback",      value: "→ Google Ads ✓",         status: "ok" },
        ], note: "MMP potwierdza first_open dla Google Ads. Postback wysłany — opcjonalny ale dostępny." },
        skan: { status: "partial", dataState: [
          { label: "Conversion Value", value: "CV (iOS)",      status: "partial" },
          { label: "postback",         value: "⏳ opóźniony",  status: "delayed" },
          { label: "gclid iOS",        value: "brak",          status: "lost" },
        ], note: "Na iOS even Google Ads czeka na SKAN postback. gclid jest utracony — dane opóźnione i zanonimizowane." },
        android: { status: "visible", dataState: [ { label: "Firebase", value: "auto-link ✓", status: "ok" }, { label: "atrybucja", value: "natywna ✓", status: "ok" } ], note: "GA4 i Google Ads łączą siły na Androidzie - first_open jest perfekcyjnie połączone z kampanią UAC bez użycia MMP." },
      },
      tiktok: {
        ga4: { status: "partial", dataState: [
          { label: "event",        value: "first_open ✓", status: "ok" },
          { label: "utm_campaign", value: "(direct)",     status: "lost" },
          { label: "ttclid",       value: "UTRACONE",     status: "lost" },
        ], note: "GA4 widzi first_open — ale kampania TikTok jest niewidoczna. Raport: (direct). Bez MMP nie ma wyjścia." },
        mmp: { status: "visible", dataState: [
          { label: "utm_campaign", value: "tt_viral_fitness ✓", status: "ok" },
          { label: "atrybucja",    value: "potwierdzona ✓",     status: "ok" },
          { label: "postback",     value: "→ TikTok Ads ✓",    status: "ok" },
        ], note: "MMP rejestruje first_open dla TikTok. Postback zasila algorytm TikTok Ads — umożliwia optymalizację." },
        skan: { status: "partial", dataState: [
          { label: "Conversion Value", value: "CV 0–63",       status: "partial" },
          { label: "postback",         value: "⏳ po timerze", status: "delayed" },
          { label: "identyfikacja",    value: "anonimowa",     status: "anon" },
        ], note: "TikTok SKAN postback wysłany po timerze Apple. Anonimowe dane zagregowane." },
        android: { status: "visible", dataState: [ { label: "Install Referrer", value: "odczytany ✓", status: "ok" }, { label: "atrybucja", value: "potwierdzona ✓", status: "ok" } ], note: "MMP na Androidzie z sukcesem dopasowuje nową instalację z historią kliknięcia w aplikacji TikTok." },
      },
      asa: {
        ga4: { status: "visible", dataState: [
          { label: "event",          value: "first_open ✓",      status: "ok" },
          { label: "ASA kampania",   value: "asa_fitness_brand ✓", status: "ok" },
          { label: "AdAttrib token", value: "zweryfikowany ✓",    status: "ok" },
        ], note: "ASA + AdAttributionKit: first_open z pełną atrybucją nawet w GA4 — jeśli implementacja jest poprawna." },
        mmp: { status: "visible", dataState: [
          { label: "ASA kampania",  value: "asa_fitness_brand ✓", status: "ok" },
          { label: "atrybucja",     value: "deterministyczna ✓",  status: "ok" },
          { label: "konsolidacja",  value: "multi-network raport", status: "ok" },
        ], note: "MMP łączy dane ASA z innymi kanałami w jednym widoku. Wartość w raportach cross-channel." },
        skan: { status: "visible", dataState: [
          { label: "AdAttributionKit", value: "first_open ✓",          status: "ok" },
          { label: "atrybucja",        value: "deterministyczna ✓",     status: "ok" },
          { label: "bez opóźnienia",   value: "natychmiastowe dane ✓",  status: "ok" },
        ], note: "ASA first_open z AdAttributionKit = natychmiastowa, deterministyczna atrybucja. Zero opóźnień, zero anonimizacji — wyjątek iOS." },
        android: { status: "hidden", dataState: [], note: "Nie dotyczy Androida." },
      },
    },
  },
  {
    id: "conversion",
    icon: "💰",
    label: "Konwersja",
    sublabel: () => "Purchase · 49.99 PLN",
    data: {
      meta: {
        ga4: { status: "visible", dataState: [
          { label: "event",             value: "purchase ✓",         status: "ok" },
          { label: "revenue",           value: "49.99 PLN ✓",        status: "ok" },
          { label: "utm_campaign",      value: "(direct)",            status: "lost" },
          { label: "atrybucja kampanii", value: "niemożliwa",        status: "lost" },
        ], note: "GA4 rejestruje zakup bezbłędnie — ale kampania 'testowa_kampania' nie dostaje kredytu. Raport: (direct)." },
        mmp: { status: "visible", dataState: [
          { label: "utm_campaign", value: "testowa_kampania ✓",    status: "ok" },
          { label: "revenue",      value: "49.99 PLN → Meta CAPI", status: "ok" },
          { label: "ROAS",         value: "obliczony ✓",           status: "ok" },
          { label: "postback",     value: "→ Meta / GA4 ✓",        status: "ok" },
        ], note: "Pełna atrybucja konwersji Meta. Postback do Meta CAPI zasila algorytm reklamowy i optymalizację ROAS." },
        skan: { status: "partial", dataState: [
          { label: "SKAN postback 3", value: "⏳ do 35 dni",  status: "delayed" },
          { label: "wartość",         value: "zaokrąglona",  status: "anon" },
          { label: "atrybucja 1:1",   value: "niemożliwa",   status: "lost" },
        ], note: "SKAN postback z informacją o konwersji — opóźniony, zagregowany. iOS zakup nie zasila Meta bezpośrednio." },
        android: { status: "visible", dataState: [ { label: "ROAS", value: "pełen (CAPI) ✓", status: "ok" }, { label: "atrybucja 1:1", value: "możliwa ✓", status: "ok" } ], note: "Brak ograniczeń narzucanych przez SKAN, więc konwersje Android przypisywane są deterministycznie w czasie rzeczywistym." },
      },
      google: {
        ga4: { status: "visible", dataState: [
          { label: "event",        value: "purchase ✓",                status: "ok" },
          { label: "revenue",      value: "49.99 PLN ✓",               status: "ok" },
          { label: "utm_campaign", value: "uac_fitness_kwiecien ✓",   status: "ok" },
          { label: "Google Ads",   value: "konwersja przypisana ✓",    status: "ok" },
        ], note: "Pełna pętla Google Ads → GA4. Zakup z poprawną atrybucją do kampanii UAC. ROAS widoczny bezpośrednio w Google Ads." },
        mmp: { status: "visible", dataState: [
          { label: "utm_campaign", value: "uac_fitness_kwiecien ✓", status: "ok" },
          { label: "postback",     value: "→ Google Ads API ✓",     status: "ok" },
          { label: "ROAS",         value: "obliczony ✓",            status: "ok" },
        ], note: "MMP potwierdza zakup z Google Ads. Postback API zasilają algorytm Smart Bidding." },
        skan: { status: "partial", dataState: [
          { label: "SKAN postback", value: "⏳ iOS opóźnienie", status: "delayed" },
          { label: "wartość iOS",   value: "zaokrąglona",       status: "anon" },
          { label: "Android",       value: "pełna atrybucja ✓", status: "ok" },
        ], note: "Na Android — pełna atrybucja Google. Na iOS — SKAN opóźnienie. Dlatego Google Ads działa lepiej na Android." },
        android: { status: "visible", dataState: [ { label: "purchase", value: "49.99 PLN ✓", status: "ok" }, { label: "atrybucja 1:1", value: "deterministyczna", status: "ok" } ], note: "Zakup zasila Smart Bidding Google Ads natychmiast, pozwalając na szybką optymalizację ROAS." },
      },
      tiktok: {
        ga4: { status: "visible", dataState: [
          { label: "event",        value: "purchase ✓",      status: "ok" },
          { label: "revenue",      value: "49.99 PLN ✓",     status: "ok" },
          { label: "utm_campaign", value: "(direct)",         status: "lost" },
          { label: "TikTok atrybucja", value: "niemożliwa",  status: "lost" },
        ], note: "GA4 widzi zakup — ale bez MMP kampania TikTok jest niewidoczna. (direct) w raportach." },
        mmp: { status: "visible", dataState: [
          { label: "utm_campaign", value: "tt_viral_fitness ✓",  status: "ok" },
          { label: "revenue",      value: "49.99 PLN → TikTok ✓", status: "ok" },
          { label: "postback",     value: "→ TikTok Events API ✓", status: "ok" },
          { label: "ROAS",         value: "obliczony ✓",          status: "ok" },
        ], note: "MMP rejestruje zakup z TikTok. Postback do TikTok Events API zasila algorytm i optimizację kampanii." },
        skan: { status: "partial", dataState: [
          { label: "SKAN postback", value: "⏳ do 35 dni",  status: "delayed" },
          { label: "wartość",       value: "zaokrąglona",   status: "anon" },
          { label: "atrybucja 1:1", value: "niemożliwa",    status: "lost" },
        ], note: "SKAN iOS dla TikTok — opóźniony postback. Wartości zaokrąglone. Bez MMP nie ma pełnego obrazu." },
        android: { status: "visible", dataState: [ { label: "postback", value: "→ TikTok API ✓", status: "ok" }, { label: "ROAS", value: "obliczony ✓", status: "ok" } ], note: "Szybki postback z Androida pozwala TikTokowi poprawnie zaliczyć konwersję do konkretnego twórcy / wideo." },
      },
      asa: {
        ga4: { status: "visible", dataState: [
          { label: "event",         value: "purchase ✓",         status: "ok" },
          { label: "revenue",       value: "49.99 PLN ✓",        status: "ok" },
          { label: "ASA kampania",  value: "asa_fitness_brand ✓", status: "ok" },
        ], note: "ASA + GA4: zakup z pełną atrybucją do kampanii App Store Search Ads. Idealny przykład zamkniętego, działającego ekosystemu iOS." },
        mmp: { status: "visible", dataState: [
          { label: "ASA kampania",  value: "asa_fitness_brand ✓",    status: "ok" },
          { label: "revenue",       value: "49.99 PLN ✓",            status: "ok" },
          { label: "multi-channel", value: "ASA + inne sieci razem",  status: "ok" },
        ], note: "MMP scala ASA z innymi kanałami — jeden raport dla całego media mix. Wartość przy kampaniach multi-network." },
        skan: { status: "visible", dataState: [
          { label: "AdAttributionKit", value: "konwersja ✓",            status: "ok" },
          { label: "wartość",          value: "49.99 PLN (pełna) ✓",   status: "ok" },
          { label: "atrybucja 1:1",    value: "deterministyczna ✓",    status: "ok" },
        ], note: "ASA + AdAttributionKit: zakup z pełną deterministyczną atrybucją iOS. Wartość bez zaokrąglenia, natychmiastowo. Najlepsza jakość danych iOS." },
        android: { status: "hidden", dataState: [], note: "Nie dotyczy Androida." },
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
          className="text-sm sm:text-base lg:text-lg text-white/90 max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-10 leading-relaxed"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
        >
          {isPl
            ? "Wybierz ekosystem reklamowy — pokażemy co dzieje się z danymi kampanii na każdym etapie ścieżki."
            : "Choose your ad ecosystem — we'll show what happens to your campaign data at every stage."}
        </motion.p>
      </div>

      {/* Right Column: Solar System */}
      <motion.div 
        className="relative lg:w-1/2 w-full flex items-center justify-center min-h-[350px] lg:min-h-[500px]"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className="relative w-full max-w-[400px] lg:max-w-[550px] aspect-square group/solar pointer-events-auto">
          {/* Sun */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-white/10 bg-white/5 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)] z-10 backdrop-blur-sm">
            <span className="text-xl sm:text-3xl mb-0.5 sm:mb-1">📱</span>
            <span className="text-[8px] sm:text-[10px] font-mono text-white/90 uppercase tracking-widest">App</span>
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
                        width: "clamp(56px, 10vw, 84px)", 
                        height: "clamp(56px, 10vw, 84px)", 
                        borderColor: eco.color + "40", 
                        background: `radial-gradient(circle at 30% 30%, ${eco.color}30 0%, ${eco.color}05 70%, transparent 100%)`,
                        boxShadow: `0 0 20px ${eco.color}15, inset 0 0 15px ${eco.color}20`
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="text-2xl sm:text-4xl">{eco.icon}</span>

                      {/* Hover Card */}
                      <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-52 sm:w-60 p-4 sm:p-5 rounded-2xl border opacity-0 group-hover/planet:opacity-100 group-hover/planet:translate-y-0 translate-y-3 pointer-events-none transition-all duration-400 z-50 text-left"
                           style={{ 
                             background: 'rgba(2,8,24,0.95)', 
                             backdropFilter: 'blur(12px)',
                             borderColor: eco.color + "30", 
                             boxShadow: `0 20px 40px rgba(0,0,0,0.8), 0 0 30px ${eco.color}15` 
                           }}>
                          <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: eco.color + "60" }} />
                          <div className="font-black text-sm sm:text-base text-white mb-1.5">{eco.name}</div>
                          <div className="text-[10px] sm:text-[11px] text-white/90 mb-4 leading-tight">{eco.sub}</div>
                          <div className="flex items-center gap-1.5 mt-auto">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: eco.badgeColor }} />
                            <span className="text-[9px] sm:text-[10px] font-semibold" style={{ color: eco.badgeColor }}>{eco.badge}</span>
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
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-5 h-14"
        style={{ background: "rgba(2,8,24,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {screen === "welcome" ? (
          <Link href={backHref} className="flex items-center gap-2 text-xs font-mono text-white/90 hover:text-white/90 transition-colors">
            ← {lang === "pl" ? "artykuł" : "article"}
          </Link>
        ) : (
          <button
            onClick={() => { setScreen("welcome"); stopPlay(); }}
            className="flex items-center gap-2 text-xs font-mono text-white/90 hover:text-white/90 transition-colors cursor-pointer"
          >
            <span className="text-base">{eco.icon}</span>
            <span className="hidden sm:inline" style={{ color: eco.color }}>{eco.name}</span>
            <span className="text-white/60">· zmień</span>
          </button>
        )}

        {/* Center */}
        {screen === "welcome" ? (
          <div className="absolute left-1/2 -translate-x-1/2 text-[11px] font-mono text-white/60 uppercase tracking-widest hidden sm:block">
            {lang === "pl" ? "Mapa Atrybucji Mobilnej" : "Mobile Attribution Map"}
          </div>
        ) : (
          <div className="absolute left-1/2 -translate-x-1/2 text-[11px] font-mono text-white/60 uppercase tracking-widest hidden sm:block">
            {lang === "pl" ? "Ścieżka Atrybucji" : "Attribution Journey"}
          </div>
        )}

        {/* Right Play Button */}
        {screen === "journey" ? (
          <div className="flex items-center gap-3">
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
              <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center rounded-xl overflow-hidden z-30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(2,8,24,0.7)", backdropFilter: "blur(16px)" }}>
                {(Object.entries(PERSPECTIVES) as [PerspectiveId, typeof persp][]).map(([id, p]) => (
                  <button
                    key={id}
                    onClick={() => { setActivePerspective(id); stopPlay(); }}
                    className="px-5 sm:px-8 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-black transition-all cursor-pointer whitespace-nowrap tracking-wide"
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

              {/* Left dots nav */}
              <div className="absolute left-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-10">
                {NODES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { goToNode(idx); stopPlay(); }}
                    className="transition-all cursor-pointer rounded-full"
                    style={{
                      width: idx === activeNodeIdx ? 10 : 6,
                      height: idx === activeNodeIdx ? 10 : 6,
                      background: idx === activeNodeIdx ? persp.color : idx < activeNodeIdx ? persp.color + "50" : "#ffffff18",
                      boxShadow: idx === activeNodeIdx ? `0 0 12px ${persp.color}` : "none",
                    }}
                  />
                ))}
                <div className="text-[10px] font-mono text-white/60 mt-1">{activeNodeIdx + 1}/{NODES.length}</div>
              </div>

              {/* Center: Vertical nodes */}
              <div className="relative flex flex-col items-center" style={{ width: 140 }}>
                {/* Background global orbit rings for the journey view */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5 opacity-50 pointer-events-none" style={{ animation: 'orbit 120s linear infinite' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border border-white/5 border-dashed opacity-30 pointer-events-none" style={{ animation: 'counter-orbit 180s linear infinite' }} />

                {NODES.map((node, idx) => {
                  const color = getNodeColor(node);
                  const isActive = idx === activeNodeIdx;
                  const dist = Math.abs(idx - activeNodeIdx);
                  const opacity = isActive ? 1 : Math.max(0.10, 1 - dist * 0.26);
                  const scale = isActive ? 1 : Math.max(0.52, 1 - dist * 0.16);
                  const translateY = (idx - activeNodeIdx) * 162;

                  return (
                    <motion.div
                      key={node.id}
                      className="absolute flex flex-col items-center cursor-pointer"
                      animate={{ y: translateY, opacity, scale }}
                      transition={{ type: "spring", stiffness: 130, damping: 22 }}
                      onClick={() => { goToNode(idx); stopPlay(); }}
                    >
                      {idx > 0 && (
                        <div className="absolute" style={{ top: -81, width: 2, height: 81, background: node.data[ecosystem][activePerspective].status === "hidden" ? "#ffffff06" : `linear-gradient(to bottom, ${getNodeColor(NODES[idx - 1])}25, ${color}55)`, left: "50%", transform: "translateX(-50%)" }}>
                          {node.data[ecosystem][activePerspective].status !== "hidden" && (
                            <motion.div
                              className="absolute left-1/2 -translate-x-1/2 w-1.5 h-6 rounded-full"
                              style={{ background: color, boxShadow: `0 0 12px ${color}` }}
                              animate={{ y: [-81, 81], opacity: [0, 1, 0] }}
                              transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: idx * 0.35 }}
                            />
                          )}
                        </div>
                      )}

                      <motion.div
                        className="relative flex items-center justify-center rounded-full z-10"
                        style={{
                          width: isActive ? 100 : 70,
                          height: isActive ? 100 : 70,
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

                        <span style={{ fontSize: isActive ? 36 : 26 }}>{node.icon}</span>
                        {isActive && !node.isBlackHole && (
                          <motion.div className="absolute inset-0 rounded-full" style={{ border: `2px solid ${color}` }} animate={{ scale: [1, 2.0], opacity: [0.45, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
                        )}
                      </motion.div>

                      <motion.div className="mt-4 text-center" animate={{ opacity: isActive ? 1 : 0.3 }}>
                        <div className="text-sm font-black text-white whitespace-nowrap">{node.label}</div>
                        <div className="text-[11px] text-white/90 mt-1 whitespace-nowrap max-w-[160px] truncate">{node.sublabel(ecosystem)}</div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Right: Detail panel */}
              <AnimatePresence mode="wait">
                {showDetail && (
                  <motion.div
                    key={`${activeNodeIdx}-${activePerspective}-${ecosystem}`}
                    className="absolute right-5 top-1/2 -translate-y-1/2"
                    style={{ width: "min(460px, calc(100vw - 260px))" }}
                    initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="rounded-2xl overflow-hidden backdrop-blur-xl" style={{
                      background: "rgba(2,8,24,0.88)",
                      border: `1px solid ${nodeData.status === "hidden" ? "#ffffff10" : persp.color + "28"}`,
                      boxShadow: nodeData.status !== "hidden" ? `0 0 40px ${persp.color}10` : "none",
                    }}>
                      {/* Header */}
                      <div className="flex items-start gap-4 px-6 py-5 border-b" style={{ borderColor: persp.color + "18", background: persp.color + "06" }}>
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
                                <span className="text-[11px] font-mono text-white/90 shrink-0" style={{ minWidth: 120 }}>{row.label}</span>
                                <span className="text-white/90 shrink-0 text-xs">→</span>
                                <span className="flex items-center gap-2 px-3 py-1 rounded-lg text-[11px] font-mono font-semibold" style={{
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
                        <p className="text-sm text-white/90 leading-relaxed m-0">{nodeData.note}</p>
                      </div>
                    </div>

                    {/* Perspective desc below panel */}
                    <div className="mt-3 px-1 text-[11px] text-white/60 leading-relaxed">
                      {persp.desc(ecosystem)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile perspective switcher */}
              <div className="sm:hidden absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {(Object.entries(PERSPECTIVES) as [PerspectiveId, typeof persp][]).map(([id, p]) => (
                  <button key={id} onClick={() => setActivePerspective(id)}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer"
                    style={{ background: activePerspective === id ? p.color + "20" : "transparent", color: activePerspective === id ? p.color : "#ffffff30", border: `1px solid ${activePerspective === id ? p.color + "40" : "transparent"}` }}>
                    {p.emoji}
                  </button>
                ))}
              </div>

              {!showDetail && (
                <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none"
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
