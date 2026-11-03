import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start";

/* Absolute origin for OG tags and sitemap links. Sandbox preview only: trust
 * x-forwarded-host on localhost, else trust the request URL. */
export const getRequestOrigin = createServerFn({ method: "GET" }).handler(() => {
  const req = getRequest();
  const url = new URL(req.url);
  const sandboxHost = url.hostname === "localhost" ? req.headers.get("x-forwarded-host") : null;
  return sandboxHost ? `https://${sandboxHost}` : url.origin;
});
