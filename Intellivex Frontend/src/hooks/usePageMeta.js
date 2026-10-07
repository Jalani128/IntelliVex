import { useEffect } from "react";

/** Sets the document title / meta description from CMS SEO fields, restoring them on leave. */
export function usePageMeta(title, description) {
  useEffect(() => {
    if (!title && !description) return undefined;
    const previous = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content");
    if (title) document.title = title;
    if (meta && description) meta.setAttribute("content", description);
    return () => {
      document.title = previous;
      if (meta && previousDescription != null) meta.setAttribute("content", previousDescription);
    };
  }, [title, description]);
}
