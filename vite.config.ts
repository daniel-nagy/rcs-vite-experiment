import react from "@vitejs/plugin-react";
import { builtinModules } from "node:module";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  appType: "custom",
  build: {
    emptyOutDir: true,
    manifest: true,
    modulePreload: {
      polyfill: false,
    },
    outDir: "../build/browser-client",
    rollupOptions: {
      input: "src/BrowserClient.tsx",
    },
    sourcemap: true,
  },
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  root: "src",
  server: {
    middlewareMode: true,
  },
  /*
   * For SSR we bundle all dependencies except Node builtins into a single file.
   * We must bundle React or any other dependencies that are affected by the
   * react-server conditional export. Otherwise, the wrong version of these
   * packages will be imported at runtime.
   *
   * This allows a client runtime and a server runtime to coexist in a single
   * process. Otherwise, you would need to run the server and client in
   * different processes to avoid conditional export conflicts.
   */
  ssr: {
    external: [...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
    noExternal: process.env.NODE_ENV === "production" ? [/.*/] : undefined,
  },
});
