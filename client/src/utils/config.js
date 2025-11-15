const trimTrailingSlash = (value = "") =>
  value.endsWith("/") ? value.replace(/\/+$/, "") : value;

const DEFAULT_API_BASE = "http://localhost:5000/api/v1";

const apiBaseCandidate = trimTrailingSlash(
  import.meta.env.VITE_API_URL ?? DEFAULT_API_BASE
);

const apiOriginCandidate =
  import.meta.env.VITE_API_ORIGIN ??
  apiBaseCandidate.replace(/\/api\/v1$/i, "");

const resolvedOrigin =
  trimTrailingSlash(apiOriginCandidate) ||
  trimTrailingSlash(
    (() => {
      try {
        const url = new URL(apiBaseCandidate);
        return url.origin;
      } catch {
        return "http://localhost:5000";
      }
    })()
  );

export const API_BASE_URL = apiBaseCandidate;

const assetBaseCandidate =
  import.meta.env.VITE_ASSET_BASE_URL ?? resolvedOrigin;
const socketBaseCandidate =
  import.meta.env.VITE_SOCKET_URL ?? resolvedOrigin;

const sanitizedAssetBase = trimTrailingSlash(assetBaseCandidate);
const sanitizedSocketBase = trimTrailingSlash(socketBaseCandidate);

export const SOCKET_BASE_URL =
  sanitizedSocketBase || "http://localhost:5000";

export const buildAssetUrl = (path = "") => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalizedPath = path.replace(/^\/+/, "");
  const base = sanitizedAssetBase || "http://localhost:5000";
  return `${base}/${normalizedPath}`;
};
