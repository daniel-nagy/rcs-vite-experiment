"use client";
import type { FC } from "react";
import { ServerComponentContext } from "react-distributed-components";

import { AppRoutes } from "./AppRoutes.js";
import { callServer } from "./CallServerCallback.js";
import { Link } from "./Router.js";
import { manifest } from "./RscRuntimeClient.js";

export namespace App {
  export type Props = {
    url: string;
  };
}

/*
 * App is a client component. The reason it is a client component is because the
 * manifest passed to the ServerComponentContext is not serializable.
 *
 * When rendering a client component from a server component, its props must be
 * serializable using React's internal message protocol.
 */
export const App: FC<App.Props> = ({ url }) => {
  const { origin } = new URL(url);

  return (
    <ServerComponentContext
      value={{
        cache: new Map(),
        callServer,
        endpoint: `${origin}/render`,
        // manifest is a `Proxy` and is not serializable.
        ssrManifest: manifest,
      }}
    >
      <div
        style={{
          fontFamily: "sans-serif",
          fontSize: 17,
          marginInline: "auto",
          maxWidth: 900,
          paddingInline: 24,
        }}
      >
        <nav style={{ marginBlock: 48 }}>
          <Link to="/">Home</Link>
          <Link style={{ marginLeft: 16 }} to="/posts">
            Posts
          </Link>
        </nav>
        <main style={{ marginBlock: 56 }}>
          <AppRoutes />
        </main>
      </div>
    </ServerComponentContext>
  );
};
