/*
 * This is the entry point for our client application in node. It is a
 * "client runtime" as far as React is concerned. Because it is a client runtime,
 * it can render client components but not server components.
 */

import "./Prelude.js";

import { PassThrough, Readable } from "node:stream";
import { type FC, type ReactNode, use } from "react";
import { StaticRouter } from "react-router-dom/server.js";
import { createFromNodeStream } from "react-server-dom-webpack/client.node";
import { renderToPipeableStream } from "react-dom/server";

import "./RscRuntimeClient.js";
import { manifest } from "./RscRuntimeClient.js";

/*
 * Takes the RSC payload stream and transforms it to HTML for SSR. We are able
 * to do this in the same process as our Node server thanks to Vite. We use Vite
 * to load this module with the correct conditions.
 *
 *  See file://./NodeServer.tsx ssr
 */
export function renderToHtml(rscPayload: Readable, url: string): Readable {
  const promise = createFromNodeStream<ReactNode>(rscPayload, manifest);
  const Async: FC = () => use(promise);
  const { pathname, search } = new URL(url);

  const { pipe } = renderToPipeableStream(
    <StaticRouter location={`${pathname}${search}`}>
      <Async />
    </StaticRouter>
  );

  return pipe(new PassThrough());
}
