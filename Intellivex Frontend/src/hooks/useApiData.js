import { useEffect, useState } from "react";

/**
 * Load API data for a section, showing `fallback` (the site's built-in content)
 * until it arrives — and for good if the request fails or returns nothing.
 * The page never renders empty because the API is down or not deployed yet.
 *
 * @param fetcher   () => Promise<raw>
 * @param map       raw => display data; return null/empty to keep the fallback
 * @param fallback  built-in display data
 */
export function useApiData(fetcher, map, fallback, deps = []) {
  const [data, setData] = useState(fallback);

  useEffect(() => {
    let alive = true;
    fetcher()
      .then((raw) => {
        const mapped = map(raw);
        const empty = mapped == null || (Array.isArray(mapped) && mapped.length === 0);
        if (alive && !empty) setData(mapped);
      })
      .catch(() => {
        /* keep the fallback */
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return data;
}
