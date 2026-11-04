import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config";
import { getThemeColors } from "@/lib/theme";

export default function manifest(): MetadataRoute.Manifest {
    // The app is forced to dark mode, so use the dark theme colors
    const colors = getThemeColors("dark");

    return {
        name: siteConfig.name,
        short_name: siteConfig.shortName,
        description: siteConfig.description,
        start_url: "/",
        display: "standalone",
        background_color: colors.background,
        theme_color: colors.primary,
        icons: [
            {
                src: "/web-app-manifest-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/web-app-manifest-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}
