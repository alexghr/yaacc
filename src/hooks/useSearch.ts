import { useCallback, useEffect, useRef, useState } from "react";

export type SearchHookOptions<T> = {
  search: (value: string, signal: AbortSignal) => T[] | Promise<T[]>;
};

export type SearchHook<T> = State<T> & {
  updateQuery: (query: string) => void;
};

type State<T> = {
  query: string;
  status: "idle" | "loading" | "error";
  results: T[];
};

/**
 * This hook performs search requests when the query is updated.
 * This deliberately returns stale date when the query changes until fresh results are ready.
 * @param param0 Search function
 * @returns
 */
export default function useSearch<T>({
  search,
}: SearchHookOptions<T>): SearchHook<T> {
  const [{ query, status, results }, setState] = useState<State<T>>({
    query: "",
    status: "idle",
    results: [],
  });

  // wrap search function in ref to avoid re-running effect
  const searchFnRef = useRef(search);
  searchFnRef.current = search;

  useEffect(() => {
    if (!query) {
      return;
    }

    const abortController = new AbortController();

    Promise.resolve(searchFnRef.current(query, abortController.signal))
      .then((results) => {
        setState({ query, status: "idle", results });
      })
      // retry here
      .catch((err) => {
        if (err.name === "AbortError") {
          return;
        }

        setState({ query, status: "error", results: [] });
      });

    return () => {
      abortController.abort();
    };
  }, [query]);

  const updateQuery = useCallback((value: string) => {
    setState((state) => ({ ...state, query: value, status: "loading" }));
  }, []);

  return {
    query,
    status,
    results,
    updateQuery,
  };
}
