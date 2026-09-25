import { Link } from "react-router-dom";

/**
 * One link element for the whole site, so a call site can keep writing
 * `href="#services"` or `href="/about"` and get the right behaviour:
 *
 * - `#section` → the home route plus that hash, because every section anchor
 *   lives on the home page. Written as a router link so clicking it from
 *   `/about` navigates home first instead of dead-ending on `/about#services`.
 * - `/path`    → a plain client-side route change.
 * - anything else (http…, mailto:, no href) → an ordinary anchor.
 */
export default function SiteLink({ href = "", children, ...props }) {
  if (href.startsWith("#")) {
    return (
      <Link to={{ pathname: "/", hash: href }} {...props}>
        {children}
      </Link>
    );
  }

  if (href.startsWith("/")) {
    return (
      <Link to={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href || undefined} {...props}>
      {children}
    </a>
  );
}
