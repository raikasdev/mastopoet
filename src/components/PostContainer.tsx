import { Ref, forwardRef, useMemo, useRef } from "react";
import PostItem, { Post, PostItemProps } from "./PostItem";
import { Options, maxHeight, maxWidth } from "../config";
import HorizontalHandlerbar from "./HorizontalHandlebar";
import VerticalHandlerbar from "./VerticalHandlebar";

interface PostContainerProps {
  post: Post;
  height: number;
  setHeight: (val: number) => void;
  width: number;
  setWidth: (val: number) => void;
  rendering: boolean;
  screenshotRef: Ref<HTMLDivElement>;
  options: Options;
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
}: PostContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const PostItemReffed = useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      forwardRef<HTMLDivElement, PostItemProps>((props, ref) => (
        <PostItem {...props} refInstance={ref} />
      )),
    [post],
  );

  return (
    <div className="flex-center">
      {/** Scaling, width 600px + 8px for handles */}
      <div
        className="gradient-container"
        style={{
          padding: `${(maxHeight - height) / 2}px ${(maxWidth - width) / 2}px`,
          transform: `scale(${
            window.screen.width > 608 + maxWidth
              ? 1
              : rendering
              ? 1
              : window.innerWidth / 608
          })`,
        }}
      >
        <div
          className={`theme-${options.theme} gradient-box ${
            width == 0 && height == 0 ? "" : "gradient"
          } dynamic-padding`}
          style={{
            padding: `${height / 2}px ${width / 2}px`,
            borderRadius: rendering ? "0" : "2rem",
            background: options.background,
          }}
          ref={screenshotRef}
        >
          <HorizontalHandlerbar width={width} setWidth={setWidth} side="left" />
          {/** Disabled due to working weirdly in a flexbox */}
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
            />
          </div>
          <VerticalHandlerbar
            height={height}
            setHeight={setHeight}
            side={"bottom"}
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
