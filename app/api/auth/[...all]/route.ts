import { auth } from "@/lib/auth"; // path to your auth file
import { resolveCorsOrigin } from "@/lib/auth-config";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
// Manually handle OPTIONS preflight
export async function OPTIONS(request: Request) {
  const origin = resolveCorsOrigin(request.headers.get("origin"));

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      Vary: "Origin",
    },
  });
}
