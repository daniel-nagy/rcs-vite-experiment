import { type SetStateAction, useCallback, useState, useEffect } from "react";

/*
 * This is a very primitive global store that allows data to be held orthogonal
 * to the component tree (and therefore have a lifespan independent of the
 * component lifespan)
 */
const store = new Map();

export const useStore = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() =>
    store.has(key) ? store.get(key) : initialValue
  );

  const setValueProxy = useCallback(
    (action: SetStateAction<T>) => {
      setValue((value) => {
        const nextValue = isFunction(action) ? action(value) : action;
        store.set(key, nextValue);
        return nextValue;
      });
    },
    [key]
  );

  useEffect(() => {
    setValue(store.has(key) ? store.get(key) : initialValue);
  }, [key]);

  return [value, setValueProxy] as const;
};

function isFunction<T, F extends Function>(value: T | F): value is F {
  return typeof value === "function";
}
