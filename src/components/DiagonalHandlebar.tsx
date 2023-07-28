import { useCallback, useRef, useState } from "react";
import { maxWidth } from "../config";

interface HandlebarProps {
  width: number;
  setWidth: (width: number) => void;
  height: number;
  setHeight: (width: number) => void;
  side: "right" | "left";
}
export default function DiagonalHandlerbar({
  width,
  setWidth,
  height,
  setHeight,
  side,
}: HandlebarProps) {
  const [holding, setHolding] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseDown = useCallback(() => {
    setHolding(true);

    const ratio = isNaN(height / width) ? 0.5 : height / width;

    const x =
      side === "left"
        ? (ref.current?.getBoundingClientRect().left || 0) + width / 2 + 4 // 4 for centering
        : (ref.current?.getBoundingClientRect().right || 0) - width / 2 - 4;
    const mouseMove = (event: MouseEvent) => {
      const difference = side === "left" ? x - event.pageX : event.pageX - x;
      const newWidth = Math.min(Math.max(difference * 2, 0), maxWidth);

      setWidth(newWidth);
      setHeight(newWidth * ratio);
    };

    document.addEventListener(
      "mouseup",
      () => {
        setHolding(false);
        document.removeEventListener("mousemove", mouseMove);
      },
      { once: true },
    );

    document.addEventListener("mousemove", mouseMove);
  }, [width, height]);

  return (
    <div
      className={`handlebar diagonal-${side}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      ref={ref}
    >
      <svg
        viewBox="0 0 16 16"
        height={8}
        width={8}
        className={holding ? "active" : ""}
      >
        <circle cx="8" cy="8" r={8} fill={"currentColor"} />
      </svg>
    </div>
  );
}
