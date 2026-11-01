import Image from "next/image";

import type { Post } from "@/validators/post";

const PostCard = ({ post }: { post: Post }) => {
    return (
        <div className="flex flex-1 items-center justify-center">
            <Image
                src={post.media.url}
                alt={post.alt}
                width={post.media.width}
                height={post.media.height}
                sizes="(min-width: 1024px) 560px, 100vw"
                loading="eager"
                className="h-auto max-h-[55dvh] w-auto max-w-full rounded-2xl shadow-2xl ring-1 ring-foreground/10 motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in lg:max-h-[75dvh]"
            />
        </div>
    );
};

export default PostCard;
