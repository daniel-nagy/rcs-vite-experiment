"use client";
import { type FC } from "react";
import { ServerComponent } from "react-distributed-components";
import { Route, Routes, useParams } from "react-router-dom";

type Home = typeof import("./Home/Home.js")["Home"];
type Post = typeof import("./Post/Post.js")["Post"];
type Posts = typeof import("./Posts/Posts.js")["Posts"];

const Home: FC = () => (
  <ServerComponent<Home> suspense={{ fallback: "Loading Home" }} type="Home" />
);

const Post: FC = () => {
  const { id } = useParams();

  return (
    <ServerComponent<Post>
      // This key ensures the suspense fallback is activated when switching
      // between blog posts. I feel like React Router should do this
      // automatically but I don't think it does.
      key={`post:${id}`}
      // The server component will rerender whenever its props change. I'm
      // counting on the React compiler to optimize this (which it does).
      // However, if you're not using the compiler, then it is VERY important
      // that you memoize this yourself! Otherwise, you'll get a loop of HTTP
      // requests to your BE until React errors from too many rerenders. Don't
      // DoS yourself, bro.
      props={{ postId: Number(id!) }}
      suspense={{ fallback: "Loading Post" }}
      type="Post"
    />
  );
};

const Posts: FC = () => (
  <ServerComponent<Posts>
    suspense={{ fallback: "Loading Posts" }}
    type="Posts"
  />
);

/*
 * App Routes is a client component. React Router uses the the context API.
 * Therefore, React Router components are "client components" (since the context
 * API only works on the client). However, React Router components do not
 * include the "use client" directive. So they must be use in a client component
 * or re-exported from a file with the "use client" directive.
 *
 * Each element rendered by a route is a "server component". To enable
 * composition of server components in client components we are using the react-
 * distributed-components library.
 */
export const AppRoutes: FC = () => (
  <Routes>
    <Route element={<Home />} path="/" />
    <Route element={<Posts />} path="/posts" />
    <Route element={<Post />} path="/posts/:id" />
  </Routes>
);
