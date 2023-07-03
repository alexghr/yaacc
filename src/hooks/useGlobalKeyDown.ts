import { useEffect } from "react";

// helper function to react to a global keydown event
export default function useGlobalKeyDown(
  key: string,
  callback: (ev: KeyboardEvent) => void,
  deps: any[] = []
) {
  // this could be done more efficiently with a single global keydown handler and a list of callbacks
  useEffect(
    () => {
      const handler = (ev: KeyboardEvent) => {
        if (ev.key === key) {
          callback(ev);
        }
      };

      window.addEventListener("keydown", handler);

      return () => {
        window.removeEventListener("keydown", handler);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
}
