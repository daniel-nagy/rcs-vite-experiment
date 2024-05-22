import { type WritableOptions, Writable } from "node:stream";

/*
 * Collects bytes from a stream into a buffer.
 */
export class Uint8ArraySink extends Writable {
  data: Buffer = Buffer.from([]);

  constructor(options?: Omit<WritableOptions, "write">) {
    super({
      ...options,
      write: (chunk: Buffer, _, callback) => {
        this.data = Buffer.concat([this.data, chunk]);
        callback();
      },
    });
  }
}
