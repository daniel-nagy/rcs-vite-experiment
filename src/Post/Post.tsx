import type { FC } from "react";

import * as PostData from "../PostData.js";
import { LikeButton } from "./LikeButton.js";
import { Markdown } from "../Markdown.js";
import { Link } from "../Router.js";

export namespace Post {
  export type Props = {
    postId: number;
  };
}

/*
 * A `Post` is a server component. It renders on the server and only on the
 * server. Therefore, it may return a promise and access server side resources
 * directly, such as the file system.
 */
export const Post: FC<Post.Props> = async ({ postId }) => {
  const post = PostData.get(postId);

  if (!post) throw new Error("unknown post");

  // vite-node gives us the ability to import non-javascript files as strings
  // using the `?raw` query parameter in the URL. Vite will take care of
  // rewriting these URLs so they work in dev and in prod.
  const { default: content } = (await import(`./${post.id}.md?raw`)) as {
    default: string;
  };

  return (
    <article>
      <h1>{post.title}</h1>
      <Markdown>{content}</Markdown>
      <LikeButton
        like={PostData.like}
        likeCount={post.likes}
        postId={post.id}
      />
      <NavLinks post={post} />
    </article>
  );
};

const NavLinks: FC<{ post: PostData.Post }> = ({ post }) => (
  <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
    {post.prev && (
      <Link relative="path" to={`../${post.prev}`}>
        Prev
      </Link>
    )}
    {post.next && (
      <Link relative="path" to={`../${post.next}`}>
        Next
      </Link>
    )}
  </div>
);
