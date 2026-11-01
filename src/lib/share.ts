import { siteConfig } from "@/lib/config";

export const formatResultGrid = (results: boolean[]) =>
    results.map((correct) => (correct ? "⬜" : "🎣")).join("");

export const formatShareText = (dayNumber: number, results: boolean[]) => {
    const score = results.filter(Boolean).length;
    return [
        `${siteConfig.name} #${dayNumber} ${score}/${results.length}`,
        formatResultGrid(results),
        new URL(siteConfig.url).host,
    ].join("\n");
};
