import { useCallback, useEffect, useRef, useState } from "react";

export type AutocompleteOptions<T> = {
  search: (value: string, signal: AbortSignal) => T[] | Promise<T[]>;
};

export type AutocompleteReturn<T> = {
  suggestions: T[];
  value: string;
  search: (value: string) => void;
};

export default function useAutocomplete<T>({
  search,
}: AutocompleteOptions<T>): AutocompleteReturn<T> {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<T[]>([]);

  // wrap search function in ref to avoid re-running effect
  const searchFnRef = useRef(search);
  searchFnRef.current = search;

  useEffect(() => {
    if (!value) {
      return;
    }

    const abortController = new AbortController();

    Promise.resolve(searchFnRef.current(value, abortController.signal))
      .then((suggestions) => {
        setSuggestions(suggestions);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          return;
        }

        setSuggestions([]);
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
