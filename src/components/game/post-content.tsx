import Image from "next/image";

import type { Content } from "@/validators/post";

import { hashString } from "@/lib/random";
import { cn } from "@/lib/utils";

const PostContent = ({
    content,
    className,
}: {
    content: Content;
    className?: string;
}) => {
    if (!content.handle && !content.text) {
        return (
            <div className={cn("flex flex-col gap-2", className)}>
                {content.media.map((media) => (
                    <Image
                        key={media.url}
                        src={media.url}
                        alt={media.alt ?? ""}
                        width={media.width}
                        height={media.height}
                        sizes="(min-width: 1024px) 560px, 100vw"
                        loading="eager"
                        className="h-auto max-h-[55dvh] w-auto max-w-full rounded-2xl shadow-2xl ring-1 ring-foreground/10 lg:max-h-[75dvh]"
                    />
                ))}
            </div>
        );
    }

    const hue = content.handle ? hashString(content.handle) % 360 : 0;

    return (
        <article
            className={cn(
                "flex w-full flex-col gap-3 rounded-2xl bg-card p-4 shadow-2xl ring-1 ring-foreground/10",
                className
            )}
        >
            {content.handle && (
                <header className="flex items-center gap-3">
                    <span
                        aria-hidden
                        className="size-10 shrink-0 rounded-full"
                        style={{ backgroundColor: `oklch(0.65 0.12 ${hue})` }}
                    />
                    <span className="font-semibold">{content.handle}</span>
                </header>
            )}
            {content.text && (
                <p className="text-base leading-relaxed whitespace-pre-wrap lg:text-lg">
                    {content.text}
                </p>
            )}
            {content.media.length > 0 && (
                <div
                    className={cn(
                        "grid gap-1 overflow-hidden rounded-xl",
                        content.media.length > 1 && "grid-cols-2"
                    )}
                >
                    {content.media.map((media) => (
                        <Image
                            key={media.url}
                            src={media.url}
                            alt={media.alt ?? ""}
                            width={media.width}
                            height={media.height}
                            sizes="(min-width: 1024px) 560px, 100vw"
                            loading="eager"
                            className="h-auto max-h-[40dvh] w-full object-cover"
                        />
                    ))}
                </div>
            )}
        </article>
    );
};

export default PostContent;
