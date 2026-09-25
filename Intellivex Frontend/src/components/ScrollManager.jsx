import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Keeps scrolling sane across client-side navigations:
 *
 * - `/about` (no hash) lands at the top of the page, instantly — the global
 *   `scroll-behavior: smooth` would otherwise animate the whole document.
 * - `/#services` clicked from another route still reaches its section, which
 *   the browser cannot do on its own because the target only exists once the
 *   home route has mounted.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    const target = document.querySelector(hash);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }, [pathname, hash]);

  return null;
}
