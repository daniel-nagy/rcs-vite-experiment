import type { FC, ReactNode } from "react";

import { Environment } from "./Environment.js";

export namespace Document {
  export type Props = {
    children: ReactNode;
    entry?: string;
    environment?: Environment;
  };
}

/*
 * `Document` is a server component. It renders the `head` and `body` tags of
 * the document.
 */
export const Document: FC<Document.Props> = ({
  children,
  entry,
  environment = Environment.Development,
}) => (
  <html lang="en">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Coco's blog</title>
      {/* building for prod will produce and entry file */}
      {entry && <script src={entry} type="module" />}
    </head>
    <body>
      {children}
      {environment === Environment.Development && (
        <>
          {/* For React Fast Refresh */}
          <script
            dangerouslySetInnerHTML={{
              __html: /* JavaScript */ `
                import RefreshRuntime from "/@react-refresh";
                RefreshRuntime.injectIntoGlobalHook(window);
                window.$RefreshReg$ = () => {};
                window.$RefreshSig$ = () => (type) => type;
                window.__vite_plugin_react_preamble_installed__ = true;
              `,
            }}
            type="module"
          />
          {/* For Vite's dev server */}
          <script src="/@vite/client" type="module" />
          <script src="/BrowserClient.tsx" type="module" />
        </>
      )}
    </body>
  </html>
);
