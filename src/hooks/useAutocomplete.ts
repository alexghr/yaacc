import { useCallback, useEffect, useRef, useState } from "react";

type Options<T> = {
  search: (value: string, signal: AbortSignal) => T[] | Promise<T[]>;
};

type Autocomplete<T> = {
  suggestions: T[];
  value: string;
  search: (value: string) => void;
};

export default function useAutocomplete<T>({
  search,
}: Options<T>): Autocomplete<T> {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<T[]>([]);

  // wrap search function in ref to avoid re-running effect
  const searchFnRef = useRef(search);
  searchFnRef.current = search;

  useEffect(() => {
    const abortController = new AbortController();

    Promise.resolve(searchFnRef.current(value, abortController.signal))
      .then((suggestions) => {
        setSuggestions(suggestions);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          return;
        }
        throw err;
      });

    return () => {
      abortController.abort();
    };
  }, [value]);

  const setSearchValue = useCallback((value: string) => {
    setValue(value);
  }, []);

  return {
    suggestions,
    value,
    search: setSearchValue,
  };
}
