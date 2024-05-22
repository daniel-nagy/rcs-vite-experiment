import { readFileSync } from "fs";
import type { Manifest } from "vite";

/*
 * Functions for working with Vite manifests.
 */

export function getEntryChunk(manifest: Manifest) {
  return Object.values(manifest).find((chunk) => chunk.isEntry)!;
}

export function fromFile(path: string): Manifest {
  return JSON.parse(readFileSync(path, { encoding: "utf-8" }));
}
