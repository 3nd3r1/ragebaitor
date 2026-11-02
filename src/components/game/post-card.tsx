import type { Post } from "@/validators/post";

import PostContent from "@/components/game/post-content";

const PostCard = ({ post }: { post: Post }) => {
    return (
        <div className="flex flex-1 items-center justify-center motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in">
            <PostContent content={post.content} />
        </div>
    );
};

export default PostCard;
