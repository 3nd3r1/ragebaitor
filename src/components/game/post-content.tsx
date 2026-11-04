import Image from "next/image";

import type { Content, Media } from "@/validators/post";

import { hashString } from "@/lib/random";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Full class names so Tailwind picks them up.
const AVATAR_COLORS = [
    "bg-chart-1",
    "bg-chart-2",
    "bg-chart-3",
    "bg-chart-4",
    "bg-chart-5",
];

const PostImage = ({
    media,
    className,
}: {
    media: Media;
    className: string;
}) => (
    <Image
        src={media.url}
        alt={media.alt ?? ""}
        width={media.width}
        height={media.height}
        sizes="(min-width: 1024px) 560px, 100vw"
        loading="eager"
        className={className}
    />
);

const PostContent = ({
    content,
    className,
}: {
    content: Content;
    className?: string;
}) => {
    if (!content.handle && !content.text) {
        return (
            <Card className={cn("w-fit max-w-full gap-2 py-0", className)}>
                {content.media.map((media) => (
                    <PostImage
                        key={media.url}
                        media={media}
                        className="h-auto max-h-[55dvh] w-auto max-w-full lg:max-h-[75dvh]"
                    />
                ))}
            </Card>
        );
    }

    return (
        <Card size="sm" className={cn("w-full", className)}>
            {content.handle && (
                <CardHeader className="flex items-center gap-3">
                    <Avatar size="lg" aria-hidden>
                        <AvatarFallback
                            className={
                                AVATAR_COLORS[
                                    hashString(content.handle) %
                                        AVATAR_COLORS.length
                                ]
                            }
                        />
                    </Avatar>
                    <span className="font-semibold">{content.handle}</span>
                </CardHeader>
            )}
            <CardContent className="flex flex-col gap-3">
                {content.text && (
                    <p className="text-base leading-relaxed whitespace-pre-wrap lg:text-lg">
                        {content.text}
                    </p>
                )}
                {content.media.length > 0 && (
                    <div
                        className={cn(
                            "grid gap-1 overflow-hidden",
                            content.media.length > 1 && "grid-cols-2"
                        )}
                    >
                        {content.media.map((media) => (
                            <PostImage
                                key={media.url}
                                media={media}
                                className="h-auto max-h-[40dvh] w-full object-cover"
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PostContent;
