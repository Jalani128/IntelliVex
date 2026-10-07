/*
 * Uploaded images come back as absolute URLs built from the server's APP_URL,
 * which currently points at a private address (https://100.0.0.250/...) that
 * browsers can't reach. VITE_MEDIA_URL replaces everything up to `/storage/`:
 *   dev   VITE_MEDIA_URL=/storage   → served through the Vite proxy (vite.config.js)
 *   prod  VITE_MEDIA_URL=https://api.example.com/storage   (or unset to keep the API's URLs)
 */
const MEDIA_URL = (import.meta.env.VITE_MEDIA_URL || "").replace(/\/+$/, "");

/** Image fields in API payloads: image_url, icon_url, card_image_url, og_image_url, and the Industries page's cta_image / og_image. */
const IMAGE_KEY = /(?:^|_)(?:image|icon|logo|photo|avatar)(?:_url)?$/;

export function mediaUrl(url) {
  if (!MEDIA_URL || typeof url !== "string") return url;
  const at = url.indexOf("/storage/");
  return at === -1 ? url : `${MEDIA_URL}/${url.slice(at + "/storage/".length)}`;
}

/** Rewrites every image URL in an API response (nested objects and lists included). */
export function rewriteMedia(value) {
  if (!MEDIA_URL || value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(rewriteMedia);
  return Object.fromEntries(
    Object.entries(value).map(([key, v]) => [key, IMAGE_KEY.test(key) ? mediaUrl(v) : rewriteMedia(v)]),
  );
}
