import { describe, expect, it } from "vitest";

import { getCssVar, getThemeColors, oklchToHex } from "@/lib/theme";

describe("oklchToHex", () => {
    it("should convert white and black", () => {
        expect(oklchToHex("oklch(1 0 0)")).toBe("#ffffff");
        expect(oklchToHex("oklch(0 0 0)")).toBe("#000000");
    });

    it("should convert tailwind purple-700", () => {
        expect(oklchToHex("oklch(0.496 0.265 301.924)")).toBe("#8200db");
    });

    it("should throw on unsupported colors", () => {
        expect(() => oklchToHex("#fff")).toThrow();
    });
});

describe("getCssVar", () => {
    const css = [
        "@custom-variant dark (&:is(.dark *));",
        ":root { --primary: oklch(0.5 0.2 300); --background: oklch(1 0 0); }",
        ".dark { --primary: oklch(0.4 0.2 300); }",
    ].join("\n");

    it("should read light-mode values from :root", () => {
        expect(getCssVar(css, "primary")).toBe("oklch(0.5 0.2 300)");
    });

    it("should read dark-mode values from .dark", () => {
        expect(getCssVar(css, "primary", "dark")).toBe("oklch(0.4 0.2 300)");
    });

    it("should fall back to :root in dark mode", () => {
        expect(getCssVar(css, "background", "dark")).toBe("oklch(1 0 0)");
    });

    it("should throw when the variable is missing", () => {
        expect(() => getCssVar(css, "missing")).toThrow();
    });
});

describe("getThemeColors", () => {
    it("should read hex colors from globals.css", () => {
        const colors = getThemeColors();
        expect(colors.primary).toMatch(/^#[0-9a-f]{6}$/);
        expect(colors.primaryForeground).toMatch(/^#[0-9a-f]{6}$/);
        expect(colors.background).toMatch(/^#[0-9a-f]{6}$/);
    });
});
