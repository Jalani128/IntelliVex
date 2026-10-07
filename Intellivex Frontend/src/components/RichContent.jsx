import { useMemo } from "react";
import DOMPurify from "dompurify";

/* Same tag set the admin editor can produce; anything else is stripped. */
const ALLOWED_TAGS = ["p", "br", "h2", "h3", "strong", "b", "em", "i", "u", "s", "ul", "ol", "li", "blockquote", "a"];
const ALLOWED_ATTR = ["href", "target", "rel"];

/* Links from the CMS may only open web pages, site paths, mail or phone. */
const SAFE_HREF = /^(https?:\/\/|\/|mailto:|tel:)/i;

export function sanitizeHtml(html) {
  const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
  const doc = new DOMParser().parseFromString(clean, "text/html");
  doc.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (!SAFE_HREF.test(href)) a.removeAttribute("href");
    // External links open in a new tab, without handing over window.opener.
    if (/^https?:\/\//i.test(href)) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    } else {
      a.removeAttribute("target");
    }
  });
  return doc.body.innerHTML;
}

/**
 * Rich text from the API (service descriptions, …). The backend sanitises it
 * too — this is the second layer, so the page never trusts raw HTML.
 */
export default function RichContent({ html, className = "" }) {
  const clean = useMemo(() => sanitizeHtml(html || ""), [html]);
  return <div className={`rich-content ${className}`} dangerouslySetInnerHTML={{ __html: clean }} />;
}
