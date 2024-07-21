import { forwardRef, useMemo, useRef } from "react";
import { Post, PostItemProps } from "./PostItem";
import { Options } from "../config";
import EmbedPostItem from "./EmbedPostItem";

interface PostContainerProps {
  post: Post;
  height: number;
  width: number;
  options: Options;
}

export default function EmbeddedPostContainer({
  post,
  height,
  width,
  options,
}: PostContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  const PostItemReffed = useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      forwardRef<HTMLDivElement, PostItemProps>((props, ref) => (
        <EmbedPostItem {...props} refInstance={ref} />
      )),
    [post],
  );

  return (
    <div className="">
      {/** Scaling, width 600px + 8px for handles */}
      <div ref={sizeRef}>
        <div
          className={`theme-${options.theme} gradient-box ${
            width == 0 && height == 0 ? "" : "gradient"
          } dynamic-padding`}
          style={{
            padding: `${height / 2}px ${width / 2}px`,
            borderRadius: "0",
            background: width == 0 && height == 0 ? "" : options.background,
          }}
        >
          <div>
            <PostItemReffed
              ref={ref}
              interactionsPref={options.interactions}
              post={post}
              onImageLoadError={() => null}
              options={options}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
