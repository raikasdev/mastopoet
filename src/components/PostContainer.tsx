import { Ref, forwardRef, useMemo, useRef } from "react";
import PostItem, { Post, PostItemProps } from "./PostItem";
import { Options, maxHeight, maxWidth } from "../config";
import HorizontalHandlerbar from "./HorizontalHandlebar";
import VerticalHandlerbar from "./VerticalHandlebar";
import DiagonalHandlerbar from "./DiagonalHandlebar";

interface PostContainerProps {
  post: Post;
  height: number;
  setHeight: (val: number) => void;
  width: number;
  setWidth: (val: number) => void;
  rendering: boolean;
  screenshotRef: Ref<HTMLDivElement>;
  options: Options;
  onImageLoadError: () => void;
}

export default function PostContainer({
  post,
  height,
  setHeight,
  width,
  setWidth,
  rendering,
  screenshotRef,
  options,
  onImageLoadError,
}: PostContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  const PostItemReffed = useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      forwardRef<HTMLDivElement, PostItemProps>((props, ref) => (
        <PostItem {...props} refInstance={ref} />
      )),
    [post],
  );

  useMemo(() => {
    if (!sizeRef.current) return;
    sizeRef.current.style.height = rendering
      ? `${Math.ceil(sizeRef.current.clientHeight)}px`
      : "";
  }, [rendering]);

  return (
    <div className="flex-center">
      {/** Scaling, width 600px + 8px for handles */}
      <div
        style={{
          padding:
            window.screen.width > 608 + maxWidth
              ? `${(maxHeight - height) / 2}px ${(maxWidth - width) / 2}px`
              : "0",
          transform: `scale(${
            window.screen.width > 608 + maxWidth
              ? 1
              : rendering
              ? 1
              : window.innerWidth / (608 + width)
          })`,
        }}
        ref={sizeRef}
      >
        <div
          className={`theme-${options.theme} gradient-box ${
            width == 0 && height == 0 ? "" : "gradient"
          } dynamic-padding`}
          style={{
            padding: `${height / 2}px ${width / 2}px`,
            borderRadius: rendering ? "0" : "1rem",
            background: width == 0 && height == 0 ? "" : options.background,
          }}
          ref={screenshotRef}
        >
          <HorizontalHandlerbar width={width} setWidth={setWidth} side="left" />
          <DiagonalHandlerbar
            width={width}
            setWidth={setWidth}
            height={height}
            setHeight={setHeight}
            side="left"
          />
          <VerticalHandlerbar
            height={height}
            setHeight={setHeight}
            side={"top"}
          />
          <div>
            <PostItemReffed
              ref={ref}
              interactionsPref={options.interactions}
              post={post}
              onImageLoadError={onImageLoadError}
              options={options}
            />
          </div>
          <VerticalHandlerbar
            height={height}
            setHeight={setHeight}
            side={"bottom"}
          />
          <DiagonalHandlerbar
            width={width}
            setWidth={setWidth}
            height={height}
            setHeight={setHeight}
            side="right"
          />
          <HorizontalHandlerbar
            width={width}
            setWidth={setWidth}
            side="right"
          />
        </div>
      </div>
    </div>
  );
}
