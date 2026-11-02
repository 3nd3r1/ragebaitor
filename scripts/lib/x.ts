import { type Tweet, tweetSchema } from "@/validators/tweet";

const ENTITIES: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
};

export const parseTweetId = (url: string): string | null =>
    url.match(
        /^https?:\/\/(?:www\.|mobile\.)?(?:x|twitter)\.com\/\w+\/status\/(\d+)/
    )?.[1] ?? null;

// Same token the embed widget computes (and Vercel's react-tweet copies).
export const getTweetToken = (id: string) =>
    ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, "");

// display_text_range counts code points, and drops reply @mentions and media links.
export const getTweetText = (tweet: Tweet): string => {
    const [start, end] = tweet.display_text_range;
    let text = Array.from(tweet.text).slice(start, end).join("");
    for (const { url, display_url } of tweet.entities?.urls ?? []) {
        text = text.replace(url, display_url);
    }
    return text.replace(/&(amp|lt|gt|quot|#39);/g, (match) => ENTITIES[match]);
};

export const getTweetPhotoUrls = (tweet: Tweet): string[] => {
    const media = tweet.mediaDetails ?? [];
    if (media.some((item) => item.type !== "photo")) {
        throw new Error("Videos and GIFs aren't supported yet");
    }
    return media.map((item) => `${item.media_url_https}?name=large`);
};

export const fetchTweet = async (id: string): Promise<Tweet> => {
    const response = await fetch(
        `https://cdn.syndication.twimg.com/tweet-result?id=${id}&lang=en&token=${getTweetToken(id)}`
    );
    const json = response.ok ? await response.json().catch(() => null) : null;
    if (json?.__typename !== "Tweet") {
        throw new Error(
            `Couldn't load tweet ${id}. It may be deleted, private or age-restricted.`
        );
    }
    return tweetSchema.parse(json);
};
