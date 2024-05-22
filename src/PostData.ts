"use server";

/*
 * This file contains post data and functions for CRUD on that data. In a real
 * app this would be your data access layer.
 */

export type Post = {
  id: number;
  title: string;
  description: string;
  likes: number;
  next?: number;
  prev?: number;
};

const posts: Post[] = [
  {
    id: 1,
    title: "Keeping Your Coat Purrr-Fect",
    description: `In "Keeping Your Coat Purrr-Fect," Coco, the ultimate over-confident and edgy feline, shares his top tips for maintaining a flawless fur coat. From mastering self-grooming techniques to strategic napping in sunny spots, Coco's guide combines practical advice with his signature swagger. Dive into this purr-sonal care manual and learn how to keep your fur looking fabulous and fierce, just like the feline king himself.`,
    likes: 2,
    next: 2,
  },
  {
    id: 2,
    title: "My Top 5 Spots to Nap in 2024",
    description: `In "My Top 5 Spots to Nap in 2024," Coco, the king of cat naps, reveals his favorite snoozing spots for the year. From the classic sunbeam sweet spot to the luxurious human lap, Coco shares his expert picks for the ultimate napping experience. Follow his guide to ensure your cat naps are as cozy and stylish as possible in 2024.`,
    likes: 1,
    prev: 1,
  },
];

export function list() {
  return posts;
}

export function get(id: number) {
  return posts.find((post) => post.id === id);
}

export async function like(id: number) {
  const post = get(id);

  if (!post) throw new Error("post not found");

  if (post.likes === Number.MAX_SAFE_INTEGER)
    throw new Error("Coco's blog is too popular");

  post.likes += 1;
  return post;
}
