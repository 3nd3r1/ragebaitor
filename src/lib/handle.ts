const ADJECTIVES = [
    "quiet",
    "mossy",
    "loud",
    "sleepy",
    "brave",
    "dusty",
    "lucky",
    "salty",
    "sunny",
    "fuzzy",
    "rusty",
    "tidy",
    "witty",
    "misty",
    "jolly",
    "plain",
];
const NOUNS = [
    "lemon",
    "teapot",
    "otter",
    "pebble",
    "walrus",
    "cactus",
    "falcon",
    "noodle",
    "comet",
    "pickle",
    "badger",
    "button",
    "kettle",
    "maple",
    "puffin",
    "radish",
];

const pick = (items: string[]) =>
    items[Math.floor(Math.random() * items.length)];

export const makeHandle = () =>
    `@${pick(ADJECTIVES)}${pick(NOUNS)}${Math.floor(Math.random() * 90) + 10}`;
