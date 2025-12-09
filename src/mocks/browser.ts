import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

export function enableMockServiceWorker() {
  // changed here so my images will load without spamming in console.
  return worker.start({
    onUnhandledRequest: "bypass",
  });
}
