import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently under the navbar, so the nav pill
 * follows the page instead of staying on the last item that was clicked.
 *
 * `ids` must be a stable array (declare it outside the component) — it is an
 * effect dependency.
 *
 * @param {string[]} ids     Section ids to watch, in document order.
 * @param {number}   offset  Distance below the viewport top that counts as
 *                           "current"; roughly the height of the fixed navbar.
 */
export default function useScrollSpy(ids, offset = 120) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;

    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.scrollY + offset;

      /* The last section is often too short to ever cross the line, so the
         foot of the page always belongs to it. */
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      let current = sections[0];
      if (atBottom) {
        current = sections[sections.length - 1];
      } else {
        for (const section of sections) {
          if (section.getBoundingClientRect().top + window.scrollY <= line) current = section;
        }
      }

      setActiveId(current.id);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, offset]);

  return activeId;
}
