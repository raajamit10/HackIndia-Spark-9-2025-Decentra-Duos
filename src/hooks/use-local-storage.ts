'use client';

import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    if (typeof window === 'undefined') {
        console.warn(`Tried setting localStorage key “${key}” even though environment is not a client`);
        return;
    }
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, storedValue]);


  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          setStoredValue(JSON.parse(event.newValue));
        } catch (error) {
           console.error(`Error parsing localStorage key “${key}” on storage event:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Check if value has changed since initial load (e.g., in another tab)
     try {
      const item = window.localStorage.getItem(key);
      const currentValue = item ? JSON.parse(item) : initialValue;
      if (JSON.stringify(storedValue) !== JSON.stringify(currentValue)) {
          setStoredValue(currentValue);
      }
     } catch(error){
         console.error(`Error re-validating localStorage key “${key}”:`, error);
     }


    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue, storedValue]);

  return [storedValue, setValue];
}

export { useLocalStorage };
