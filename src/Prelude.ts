declare global {
  var __webpack_chunk_load__: (chunk: string) => unknown;
  var __webpack_require__: (chunk: string) => unknown;
}

/*
 * Implemented in the client runtime. This needs to be declared before importing
 * React or else you wil get the following error:
 *
 * ReferenceError: __webpack_require__ is not defined
 */
globalThis.__webpack_require__ = (_chunk) => {};

/*
 * React will try to call this so it must be defined. However, it doesn't seem
 * necessary to implement.
 */
globalThis.__webpack_chunk_load__ = async (_chunk) => {
  // not implemented
};
