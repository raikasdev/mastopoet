import { useState } from "react";

/**
 * Numeric useState with min and max values
 */
export default function useMinmaxState(
  defaultValue: number,
  min: number,
  max: number
): [number, (value: number) => void] {
  const [value, setStateValue] = useState<number>(defaultValue);
  const setValue = (value: number) =>
    setStateValue(Math.min(Math.max(value, min), max));

  return [value, setValue];
}
