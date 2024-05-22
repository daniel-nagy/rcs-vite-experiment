import { defineConfig } from "vite";

import { reactServerPlugin } from "./vite-plugin-react-server.js";

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: "../build/node-server",
    rollupOptions: {
      input: "src/NodeServer.tsx",
      output: {
        preserveModules: true,
      },
    },
    ssr: true,
    ssrEmitAssets: true,
    target: "node22",
  },
  plugins: [reactServerPlugin()],
  resolve: {
    // The react-server condition is required to create a "server runtime" that
    // can render React server components.
    conditions: ["react-server"],
  },
  root: "src",
  ssr: {
    optimizeDeps: {
      // We need Vite to optimize these dependencies so that they are resolved
      // with the correct conditions. Technically this is only required in dev
      // since we run node with --conditions react-server in prod.
      include: ["react/**/*", "react-server-dom-webpack/server"],
    },
  },
});
