import { useCallback, useRef, useState } from "react";

interface HandlebarProps {
  width: number;
  setWidth: (width: number) => void;
  side: "right" | "left";
}
export default function HorizontalHandlerbar({
  width,
  setWidth,
  side,
}: HandlebarProps) {
  const [holding, setHolding] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseDown = useCallback(() => {
    setHolding(true);

    const x =
      side === "left"
        ? (ref.current?.getBoundingClientRect().left || 0) + width / 2 + 4 // 4 for centering
        : (ref.current?.getBoundingClientRect().right || 0) - width / 2 - 4;

    const mouseMove = (event: MouseEvent) => {
      const difference = side === "left" ? x - event.pageX : event.pageX - x;
      setWidth(difference * 2);
    };

    document.addEventListener(
      "mouseup",
      () => {
        setHolding(false);
        document.removeEventListener("mousemove", mouseMove);
      },
      { once: true }
    );

    document.addEventListener("mousemove", mouseMove);
  }, []);

  return (
    <div
      className={`handlebar ${side}`}
      onMouseDown={handleMouseDown}
      ref={ref}
    >
      <svg viewBox="0 0 16 16" height={8} className={holding ? "active" : ""}>
        <circle cx="8" cy="8" r={8} fill={"currentColor"} />
      </svg>
    </div>
  );
}
