import { useCallback, useRef, useState } from "react";

interface HandlebarProps {
  height: number;
  setHeight: (width: number) => void;
  side: "top" | "bottom";
}

export default function VerticalHandlerbar({
  height,
  setHeight,
  side,
}: HandlebarProps) {
  const [holding, setHolding] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const globalize = (num: number) => num + window.scrollY;

  const handleMouseDown = useCallback(() => {
    setHolding(true);

    const y =
      side === "top"
        ? globalize(ref.current?.getBoundingClientRect().top || 0) +
          height / 2 +
          12
        : globalize(ref.current?.getBoundingClientRect().bottom || 0) -
          height / 2 -
          4;

    const mouseMove = (event: MouseEvent) => {
      const difference = side === "top" ? y - event.pageY : event.pageY - y;
      setHeight(difference * 2);
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
  }, [height]);

  return (
    <div
      className={`handlebar ${side}`}
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
