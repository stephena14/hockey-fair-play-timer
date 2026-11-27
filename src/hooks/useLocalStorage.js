import { useEffect, useState } from "react";
import { load } from "../gameUtils";

export function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(() => load(key, fallback));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be unavailable in privacy or quota-limited modes.
    }
  }, [key, value]);

  return [value, setValue];
}
