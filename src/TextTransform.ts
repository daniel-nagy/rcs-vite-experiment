import { Transform } from "node:stream";

/*
 * String.replace() but for streams
 */
export function createTransform(
  searchValue: string,
  replaceValue: string | (() => string)
) {
  const getReplaceValue =
    typeof replaceValue === "function" ? replaceValue : () => replaceValue;

  return new Transform({
    transform(chunk: Buffer, encoding, callback) {
      // @ts-expect-error This comparison appears to be unintentional because
      // the types 'BufferEncoding' and '"buffer"' have no overlap.
      const enc = encoding === "buffer" ? undefined : encoding;

      if (chunk.includes(searchValue)) {
        this.push(chunk.toString(enc).replace(searchValue, getReplaceValue()));
      } else {
        this.push(chunk, enc);
      }

      callback();
    },
  });
}
