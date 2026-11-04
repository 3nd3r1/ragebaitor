import type { Metadata, Viewport } from "next";
import { Geist_Mono, IBM_Plex_Sans, Instrument_Serif } from "next/font/google";

import { siteConfig } from "@/lib/config";
import { getThemeColors } from "@/lib/theme";
import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/sonner";

import ThemeProvider from "@/components/common/layouts/theme-provider";

import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
    variable: "--font-sans",
    subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
    variable: "--font-heading",
    subsets: ["latin"],
    weight: "400",
});

const geistMono = Geist_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    creator: siteConfig.author.name,
    robots: "index, follow",
    openGraph: {
        type: "website",
        locale: siteConfig.locale,
        url: siteConfig.url,
        siteName: siteConfig.name,
        title: siteConfig.name,
        description: siteConfig.description,
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
    },
    category: siteConfig.category,
    other: { "darkreader-lock": "true" },
};

export const viewport: Viewport = {
    themeColor: getThemeColors("dark").primary,
};

const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
        "@type": "Person",
        name: siteConfig.author.name,
        url: siteConfig.author.url,
    },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang={siteConfig.language}
            className={cn(
                ibmPlexSans.variable,
                instrumentSerif.variable,
                geistMono.variable,
                "h-full antialiased"
            )}
            suppressHydrationWarning
        >
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData),
                    }}
                />
            </head>
            <body className="flex min-h-full flex-col">
                <ThemeProvider
                    attribute="class"
                    forcedTheme="dark"
                    disableTransitionOnChange
                >
                    <div className="flex flex-1 flex-col">{children}</div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
