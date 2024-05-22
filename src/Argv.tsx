import { Environment } from "./Environment.js";

export type Args = {
  env: Environment;
};

/*
 * Primitive command line arguments parsing. Good enough for this demo.
 */
export function parse(argv: string[]) {
  const args =
    Object.fromEntries(argv.slice(2).map((arg) => arg.split("="))) ?? {};

  const { "--env": env = Environment.Development } = args;

  return { env } as Args;
}
