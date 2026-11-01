import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";

import { siteConfig } from "@/lib/config";

import { Toaster } from "@/components/ui/sonner";

import ThemeProvider from "@/components/common/layouts/theme-provider";

import "./globals.css";

const geistSans = Geist({
    variable: "--font-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
});

const display = Bricolage_Grotesque({
    variable: "--font-display",
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
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    category: siteConfig.category,
    other: { "darkreader-lock": "true" },
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
            className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
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
