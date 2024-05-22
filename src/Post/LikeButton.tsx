"use client";
import { type FC, useOptimistic, startTransition } from "react";

import type { Post } from "../PostData.js";
import { useStore } from "../Store.js";

/*
 * The `LikeButton` requires client-side interactivity, therefore it must be a
 * client component.
 */
export const LikeButton: FC<{
  like(id: number): Promise<Post>;
  likeCount: number;
  postId: number;
}> = ({ like, likeCount, postId }) => {
  /*
   * The like button is rendered by a server component. The output of that
   * server component is cached on the client to avoid a round trip to the
   * server every time the page is unmounted and re-mounted. (this caching is
   * preformed by the react-distributed-components library)
   *
   * Therefore, if the page is unmounted and re-mounted, the like count
   * that is passed as a prop from the server component to the client component
   * will be stale. To work around this, I'm going to cache changes to the like
   * count on the client.
   *
   * Replace `useStore` with  `useState` to see the difference.
   */
  const [likes, setLikes] = useStore(`LikeButton:Count:${postId}`, likeCount);

  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (state, _: void) => state + 1
  );

  const addLike = () => {
    startTransition(async () => {
      addOptimisticLike();
      // `like` is a server action, calling it will make a POST request to the
      // server
      const post = await like(postId);
      setLikes(post.likes);
    });
  };

  return (
    <button onClick={addLike} style={{ fontVariantEmoji: "text" }}>
      ❤️ {optimisticLikes}
    </button>
  );
};
