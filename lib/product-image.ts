const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  "http://localhost:3001";

const blockedHosts = new Set([
  "via.placeholder.com",
  "external-content.duckduckgo.com",
]);

export const resolveProductImageUrl = (
  value?: string | null,
  fallback = "/placeholder-product.jpg",
) => {
  if (!value) return fallback;

  const normalized = value.replace(/\\/g, "/").trim();
  if (!normalized) return fallback;

  if (/^https?:\/\//i.test(normalized)) {
    try {
      const parsed = new URL(normalized);
      if (blockedHosts.has(parsed.hostname.toLowerCase())) {
        return fallback;
      }
      return encodeURI(normalized);
    } catch {
      return fallback;
    }
  }

  return encodeURI(`${backendUrl}/${normalized.replace(/^\/+/, "")}`);
};
