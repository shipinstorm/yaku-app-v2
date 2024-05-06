"use client";

import { isFunction } from "lodash";
import { useState, useEffect } from "react";

// ----------------------------------------------------------------------

export default function useLocalStorage<ValueType>(
  key: string,
  defaultValue: ValueType
) {
  // Check if window is defined to ensure we are in the client-side environment
  const isClient = typeof window !== "undefined";

  const [value, setValue] = useState(() => {
    if (isClient) {
      const storedValue = localStorage.getItem(key);
      try {
        return storedValue === null ? defaultValue : JSON.parse(storedValue);
      } catch (error: any) {
        return storedValue || defaultValue;
      }
    }
    return defaultValue;
  });

  useEffect(() => {
    if (isClient) {
      const listener = (e: StorageEvent) => {
        if (e.storageArea === localStorage && e.key === key) {
          setValue(e.newValue ? JSON.parse(e.newValue) : e.newValue);
        }
      };
      window.addEventListener("storage", listener);
  
      return () => {
        window.removeEventListener("storage", listener);
      };
    }
  }, [key, defaultValue, isClient]);

  const setValueInLocalStorage = (newValue: ValueType) => {
    if (isClient) {
      if (!isFunction(newValue)) {
        localStorage.setItem(key, JSON.stringify(newValue));
        setValue(newValue);
      } else {
        setValue((currentValue: any) => {
          const result = newValue(currentValue);
          localStorage.setItem(key, JSON.stringify(result));
          return result;
        });
      }
    }
  };

  const removeValueInLocalStorage = () => {
    if (isClient) {
      localStorage.removeItem(key);
    }
  };

  return [value, setValueInLocalStorage, removeValueInLocalStorage];
}
