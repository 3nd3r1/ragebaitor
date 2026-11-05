import { type GameState, gameStateSchema } from "@/validators/game";

import { createInitialState } from "@/lib/game";

export const STORAGE_KEY = "ragebaitor:v1";

const CHANGE_EVENT = "ragebaitor:storage";

// Used when localStorage throws (blocked storage), so the round still works until reload.
let memory: string | null = null;

export const readRaw = (): string | null => {
    try {
        return window.localStorage.getItem(STORAGE_KEY);
    } catch {
        return memory;
    }
};

export const parseState = (raw: string | null): GameState => {
    if (!raw) {
        return createInitialState();
    }
    try {
        const result = gameStateSchema.safeParse(JSON.parse(raw));
        return result.success ? result.data : createInitialState();
    } catch {
        return createInitialState();
    }
};

export const writeState = (state: GameState) => {
    const raw = JSON.stringify(state);
    try {
        window.localStorage.setItem(STORAGE_KEY, raw);
    } catch {
        memory = raw;
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
};

export const subscribe = (onChange: () => void) => {
    const onStorage = (event: StorageEvent) => {
        if (event.key === STORAGE_KEY) onChange();
    };
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
        window.removeEventListener(CHANGE_EVENT, onChange);
        window.removeEventListener("storage", onStorage);
    };
};

const INTRO_KEY = "ragebaitor:intro-seen";

export const hasSeenIntro = (): boolean => {
    try {
        return window.localStorage.getItem(INTRO_KEY) !== null;
    } catch {
        return false;
    }
};

export const markIntroSeen = () => {
    try {
        window.localStorage.setItem(INTRO_KEY, "1");
    } catch {}
};
