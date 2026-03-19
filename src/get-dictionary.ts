import "server-only";

const dictionaries = {
    pl: () => import("./dictionaries/pl.json").then((module) => module.default),
    en: () => import("./dictionaries/en.json").then((module) => module.default),
};

export const getDictionary = async (locale: "pl" | "en") => dictionaries[locale]();
