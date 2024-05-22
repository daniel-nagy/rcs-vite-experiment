import {
  type CallServerCallback,
  createFromFetch,
  encodeReply,
} from "react-server-dom-webpack/client.browser";

/*
 * React will delegate to this function when it needs to call a server action.
 *
 * See file://./NodeServer.tsx callServerAction
 */
export const callServer: CallServerCallback = async (id, args) => {
  const fetchPromise = fetch(`/action`, {
    method: "POST",
    headers: { "rsc-action": id },
    body: await encodeReply(args),
  });

  return createFromFetch(fetchPromise);
};
