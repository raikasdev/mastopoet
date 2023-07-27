import { useState } from "react";

export function useObjectState<T>(defaultValue: T): [T, (value: T) => void] {
  const [value, setStateValue] = useState<T>(defaultValue);
  const setValue = (value: T) => setStateValue({ ...value });

  return [value, setValue];
}
