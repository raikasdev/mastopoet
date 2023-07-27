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

  // 27.7.2023: I have no f*cking idea how I got this working, but it works now.
  // https://tenor.com/view/do-not-touch-it-programmer-walking-cow-coding-gif-17252607

  const handleMouseDown = useCallback(() => {
    setHolding(true);

    let y =
      side === "top"
        ? (ref.current?.getBoundingClientRect().top || 0) + height
        : (ref.current?.getBoundingClientRect().bottom || 0) - height * 2;

    let localHeight = height;

    const setLocalHeight = (val: number) => {
      if (val < 0) val = 0;
      if (val > 200) val = 200;
      localHeight = val;
      console.log("new", val);

      setHeight(val);
    };

    const mouseMove = (event: MouseEvent) => {
      const difference = side === "top" ? y - event.pageY : event.pageY - y;
      y =
        side === "top"
          ? (ref.current?.getBoundingClientRect().top || 0) + localHeight
          : (ref.current?.getBoundingClientRect().bottom || 0) - localHeight;
      setLocalHeight(difference);
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
      onTouchStart={handleMouseDown}
      ref={ref}
    >
      <svg viewBox="0 0 16 16" height={8} className={holding ? "active" : ""}>
        <circle cx="8" cy="8" r={8} fill={"currentColor"} />
      </svg>
    </div>
  );
}
