import { useCallback, useEffect, useRef, useState } from "react";
import { fetchProjects } from "../services/portfolio";

/**
 * One fixed list of published projects — `{ home: 1 }` for Home, `{ featured: 1 }`
 * for Industries. `status`: "loading" | "ready" | "error".
 */
export function useProjects(params, limit) {
  const key = JSON.stringify(params);
  const [state, setState] = useState({ status: "loading", items: [] });

  useEffect(() => {
    let alive = true;
    setState({ status: "loading", items: [] });
    fetchProjects(JSON.parse(key))
      .then(({ data = [] }) => alive && setState({ status: "ready", items: limit ? data.slice(0, limit) : data }))
      .catch(() => alive && setState({ status: "error", items: [] }));
    return () => {
      alive = false;
    };
  }, [key, limit]);

  return state;
}

/**
 * Portfolio grid data: published projects for a category (null = all),
 * one API page at a time. `loadMore` appends the next page while `hasMore`.
 */
export function useProjectList(category) {
  const [state, setState] = useState({ items: [], page: 0, hasMore: false, status: "loading", error: null });
  const request = useRef(0);

  const load = useCallback(
    (page) => {
      const id = ++request.current;
      setState((s) => ({ ...s, status: page === 1 ? "loading" : "loadingMore", error: null }));
      fetchProjects({ ...(category && { category }), page })
        .then(({ data = [], meta = {} }) => {
          if (id !== request.current) return;
          setState((s) => ({
            items: page === 1 ? data : [...s.items, ...data],
            page,
            hasMore: Boolean(meta.has_more ?? meta.current_page < meta.last_page),
            status: "ready",
            error: null,
          }));
        })
        .catch((error) => {
          if (id !== request.current) return;
          setState((s) => ({ ...s, status: page === 1 ? "error" : "ready", error }));
        });
    },
    [category],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  // Also the retry after a failed request: page 1 when nothing loaded yet.
  const loadMore = () => load(state.page + 1);
  return { ...state, loadMore, retry: loadMore };
}
