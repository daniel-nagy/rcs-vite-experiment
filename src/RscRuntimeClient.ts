import type { SSRManifest } from "react-server-dom-webpack/client.node";

import * as Components from "./ClientComponents.js";

/*
 * React expects this function to return a module synchronously. However,
 * dynamic import is inherently synchronous.
 *
 * It is possible to synchronously return a module that exports a lazy component.
 * This works during SSR but fails in the browser because you end up with a lazy
 * component inside a lazy component some how.
 *
 * To simplify things, I'm just exporting all the client components from a
 * single module that I can import ahead of time.
 */
globalThis.__webpack_require__ = () => Components;

/*
 * The react-server-dom-webpack library uses a manifest produced by the webpack
 * plugin.
 *
 * Instead of writing a Vite plugin for React server components, I'm going to
 * cheat and use proxies to return data based on the module specifier.
 */
export const manifest: SSRManifest = {
  moduleMap: new Proxy(
    {},
    {
      get(_target, prop0) {
        return new Proxy(
          {},
          {
            get(_target, prop1) {
              return {
                id: prop0,
                chunks: [prop0],
                name: prop1,
              };
            },
          }
        );
      },
    }
  ),
  moduleLoading: {
    prefix: "",
  },
};
