import { createServer as createViteServer, createViteRuntime } from "vite";

/*
 * Creates a Vite dev server and runtime
 */

export const server = await createViteServer({
  configFile: "./vite.config.ts",
});

export const runtime = await createViteRuntime(server);

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    // Not sure if this is necessary or not in middleware mode.
    server.close();
  });
}
