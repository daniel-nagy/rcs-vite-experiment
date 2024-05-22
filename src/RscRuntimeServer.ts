import type { ClientManifest } from "react-server-dom-webpack/server";

/*
 * The react-server-dom-webpack library uses a manifest produced by the webpack
 * plugin.
 *
 * Instead of writing a Vite plugin for React server components, I'm going to
 * cheat and use proxies to return data based on the module specifier.
 *
 * The server uses a different manifest than the client for some reason.
 */
export const manifest: ClientManifest = new Proxy(
  {},
  {
    get(target, prop, receiver) {
      if (typeof prop !== "string") return Reflect.get(target, prop, receiver);

      const [, exportName] = prop.split("#");

      return {
        id: prop,
        name: exportName,
        chunks: [],
      };
    },
  }
);
