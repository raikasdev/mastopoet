import { useEffect, useState } from "react";
import { Post } from "../components/PostItem";
import useMinmaxState from "../utils/use-minmax-state";
import {
  InteractionsPreference,
  Options,
  Theme,
  defaultHeight,
  defaultWidth,
  maxHeight,
  maxWidth,
  themes,
} from "../config";
import fetchPost from "../instance/_main";
import EmbeddedPostContainer from "../components/EmbeddedPostContainer";

function parseNumber(val: string | undefined) {
  if (!val) return undefined;
  return isNaN(parseInt(val)) ? 0 : parseInt(val);
}

function EmbedPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [message, setMessage] = useState("");
  const [width, setWidth] = useMinmaxState(defaultWidth, 0, maxWidth);
  const [height, setHeight] = useMinmaxState(defaultHeight, 0, maxHeight);
  const [options, setOptions] = useState<Options>({
    theme: "bird-ui",
    interactions: "feed",
    background: "linear-gradient(to right, #fc5c7d, #6a82fb)",
    scale: 2,
    language: "en",
  });

  useEffect(() => {
    const params = Object.fromEntries(
      new URLSearchParams(window.location.search).entries(),
    ) as Record<string, string | undefined>;
    const { url, width, height, background } = params;
    let { theme, interactions } = params;

    if (!url) return setMessage("Embed URL is invalid.");
    if (theme && !themes.includes(theme as Theme)) theme = undefined;
    if (
      interactions &&
      ![
        "feed",
        "feed no-date",
        "normal",
        "normal no-replies",
        "hidden",
      ].includes(interactions)
    )
      interactions = undefined;

    (async () => {
      try {
        const response = await fetchPost(url);
        setPost(response);
        setOptions({
          theme: (theme ?? "bird-ui") as Theme,
          interactions: (interactions ?? "feed") as InteractionsPreference,
          background:
            background ?? "linear-gradient(to right, #fc5c7d, #6a82fb)",
          scale: 2,
          language: "en",
        });
        setWidth(parseNumber(width) ?? 0);
        setHeight(parseNumber(height) ?? 0);
        setMessage("");
      } catch (e) {
        setMessage("The embedded post was not found.");
      }
    })();
  }, []);

  /** End screenshotting */

  return (
    <>
      {message && <p>{message}</p>}
      {post && (
        <EmbeddedPostContainer
          post={post}
          height={height}
          width={width}
          options={options}
        />
      )}
    </>
  );
}

export default EmbedPage;
