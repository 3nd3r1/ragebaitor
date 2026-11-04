import type { SiteConfig } from "@/validators/config";

const url =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ragebaitor.host.ender.fi";

export const siteConfig: SiteConfig = {
    // Basic info
    name: "Ragebaitor",
    shortName: "Ragebaitor",
    description:
        "Ragebait or genuine? Ten real posts a day. Everyone thinks they can spot bait.",
    url,

    // Locale
    locale: "en_US",
    language: "en",

    // Author info
    author: {
        name: "Viljami",
        url,
    },

    // Keywords for SEO
    keywords: ["ragebait", "daily game", "guessing game", "social media"],

    // App category
    category: "games",
};
