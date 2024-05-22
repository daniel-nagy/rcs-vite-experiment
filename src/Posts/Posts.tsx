import type { FC } from "react";

import { list } from "../PostData.js";
import { P } from "../Markdown.js";
import { Link } from "../Router.js";

export namespace Posts {
  export type Props = {};
}

/*
 * `Posts` is a server component. It renders a list of blog posts.
 */
export const Posts: FC<Posts.Props> = () => (
  <>
    <h1 style={{ marginBottom: 48 }}>Posts</h1>
    {list().map((post) => (
      <div key={post.id} style={{ marginBottom: 48 }}>
        <h2>{post.title}</h2>
        <P>{post.description}</P>
        <Link to={`/posts/${post.id}`}>Read</Link>
      </div>
    ))}
  </>
);
