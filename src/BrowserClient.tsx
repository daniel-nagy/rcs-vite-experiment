/// <reference lib="dom" />

/*
 * This is the entry point for our client application in the browser. It is a
 * "client runtime" as far as React is concerned. Because it is a client runtime,
 * it can render client components but not server components.
 */

import "./Prelude.js";

import { type FC, type ReactNode, use } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { createFromReadableStream } from "react-server-dom-webpack/client.browser";

import "./RscRuntimeClient.js";
import { callServer } from "./CallServerCallback.js";

function main(rscPayload: Uint8Array) {
  const promise = createFromReadableStream<ReactNode>(
    new Response(rscPayload).body!,
    { callServer }
  );

  const Async: FC = () => use(promise);

  hydrateRoot(
    document,
    // need to enable the transition API to use Suspense with React Router. The
    // react-distributed-components library uses Suspense internally.
    <BrowserRouter future={{ v7_startTransition: true }}>
      <Async />
    </BrowserRouter>
  );
}

/*
 * The RSC payload rendered on the server is embedded in the document so it can
 * be hydrated on the client.
 *
 * See file://./NodeServer.tsx ssr
 */
const rscPayload = new Uint8Array(
  JSON.parse(document.getElementById("rsc_payload")!.textContent!)
);

main(rscPayload);
