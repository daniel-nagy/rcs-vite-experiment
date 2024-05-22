/*
 * Crude types for react-server-dom-webpack since none are currently available.
 */

declare module "shared/ReactTypes" {
  export type ReactCustomFormAction = {
    name?: string;
    action?: string;
    encType?: string;
    method?: string;
    target?: string;
    data?: null | FormData;
  };
}

declare module "react-client" {
  type ReactServerObject = { [key: string]: ReactServerValue };

  export type ReactServerValue =
    // References are passed by their value
    | ServerReference<any>
    // The rest are passed as is. Sub-types can be passed in but lose their
    // subtype, so the receiver can only accept once of these.
    | string
    | boolean
    | number
    | null
    | void
    | bigint
    | AsyncIterable<ReactServerValue>
    | AsyncIterator<ReactServerValue, ReactServerValue, void>
    | Iterable<ReactServerValue>
    | Iterator<ReactServerValue>
    | Array<ReactServerValue>
    | Map<ReactServerValue, ReactServerValue>
    | Set<ReactServerValue>
    | FormData
    | Date
    | ReactServerObject
    | Promise<ReactServerValue>; // Thenable<ReactServerValue>

  interface Reference {}
  export type ServerReference<T> = T;
  export type TemporaryReferenceSet = Map<string, Reference | symbol>;
}

declare module "react-server" {
  export type ClientReference<T> = unknown;
  export type ServerReference<T> = unknown;
  export type React$Element<T> = unknown;
  export type LazyComponent<T> = unknown;
  export type React$AbstractComponent<T, U> = unknown;

  // Serializable values
  export type ReactClientValue =
    // Server Elements and Lazy Components are unwrapped on the Server
    | React$Element<React$AbstractComponent<any, any>>
    | LazyComponent<ReactClientValue, any>
    // References are passed by their value
    | ClientReference<any>
    | ServerReference<any>
    // The rest are passed as is. Sub-types can be passed in but lose their
    // subtype, so the receiver can only accept once of these.
    | React$Element<string>
    | React$Element<ClientReference<any> & any>
    | string
    | boolean
    | number
    | symbol
    | null
    | void
    | bigint
    | ReadableStream
    | AsyncIterable<ReactClientValue>
    | AsyncIterator<ReactClientValue, ReactClientValue, void>
    | Iterable<ReactClientValue>
    | Iterator<ReactClientValue>
    | Array<ReactClientValue>
    | Map<ReactClientValue, ReactClientValue>
    | Set<ReactClientValue>
    | FormData
    | ArrayBufferView
    | ArrayBuffer
    | Date
    | ReactClientObject
    | Promise<ReactClientValue>; // Thenable<ReactClientValue>

  type ReactClientObject = { [key: string]: ReactClientValue };
}

declare module "react-server-dom-webpack/client.browser" {
  import type { Thenable } from "react";
  import type { TemporaryReferenceSet } from "react-client";

  type CallServerCallback = <A, T>(string, args: A) => Promise<T>;

  type Options = {
    callServer?: CallServerCallback;
    temporaryReferences?: TemporaryReferenceSet;
  };

  export function createFromFetch<T>(
    promiseForResponse: Promise<Response>,
    options?: Options
  ): Thenable<T>;

  export function createFromReadableStream<T>(
    stream: ReadableStream,
    options?: Options
  ): Thenable<T>;

  export function encodeReply(
    value: ReactServerValue,
    options?: { temporaryReferences?: TemporaryReferenceSet }
  ): Promise<string | URLSearchParams | FormData>;
}

declare module "react-server-dom-webpack/client.node" {
  import type { Readable } from "node:stream";
  import type { Thenable } from "react";
  import type { ReactCustomFormAction } from "shared/ReactTypes";

  type ClientReference<T> = {
    specifier: string;
    name: string;
    async?: boolean;
  };

  type SSRModuleMap = {
    [clientId: string]: {
      [clientExportName: string]: ClientReference<any>;
    };
  };

  type ModuleLoading = null | {
    prefix: string;
    crossOrigin?: "use-credentials" | "";
  };

  type EncodeFormActionCallback = <A>(
    id: any,
    args: Promise<A>
  ) => ReactCustomFormAction;

  type SSRManifest = {
    moduleMap: SSRModuleMap;
    moduleLoading: ModuleLoading;
  };

  export type Options = {
    nonce?: string;
    encodeFormAction?: EncodeFormActionCallback;
  };

  export function createFromNodeStream<T>(
    stream: Readable,
    ssrManifest: SSRManifest,
    options?: Options
  ): Thenable<T>;
}

declare module "react-server-dom-webpack/node-loader" {
  import type { LoadHook, ResolveHook } from "node:module";
  export const load: LoadHook;
  export const resolve: ResolveHook;

  type Source = string | ArrayBuffer | Uint8Array;

  type TransformSourceContext = {
    format: string;
    url: string;
  };

  type TransformSourceFunction = (
    Source,
    TransformSourceContext,
    TransformSourceFunction
  ) => Promise<{ source: Source }>;

  export function transformSource(
    source: Source,
    context: TransformSourceContext,
    defaultTransformSource: TransformSourceFunction
  ): Promise<{ source: Source }>;
}

declare module "react-server-dom-webpack/server" {
  import type { Writable } from "node:stream";
  import type { Thenable } from "react";
  import type { TemporaryReferenceSet } from "react-client";
  import type { ReactClientValue } from "react-server";

  export type ImportManifestEntry = {
    id: string;
    // chunks is a double indexed array of chunkId / chunkFilename pairs
    chunks: Array<string>;
    name: string;
  };

  type ServerManifest = void;
  type ClientReferenceManifestEntry = ImportManifestEntry;

  type Options = {
    environmentName?: string;
    onError?: (error: unknown) => void;
    onPostpone?: (reason: string) => void;
    identifierPrefix?: string;
    temporaryReferences?: TemporaryReferenceSet;
  };

  type PipeableStream = {
    abort(reason: unknown): void;
    pipe<T extends Writable>(destination: T): T;
  };

  export type ClientManifest = {
    [id: string]: ClientReferenceManifestEntry;
  };

  export function decodeReply<T>(
    body: string | FormData,
    webpackMap: ServerManifest,
    options?: { temporaryReferences?: TemporaryReferenceSet }
  ): Thenable<T>;

  export function registerServerReference<
    T extends (...args: any[]) => unknown
  >(reference: T, id: string, exportName: null | string): ServerReference<T>;

  export function renderToPipeableStream(
    model: ReactClientValue,
    webpackMap: ClientManifest,
    options?: Options
  ): PipeableStream;
}
