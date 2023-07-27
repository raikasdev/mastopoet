import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import PostItem, { Post } from "./components/Post";

// Main styles
import "./styles/App.scss";

// Themes
import "./themes/BirdUi.scss";
import html2canvas from "html2canvas";
import {
  downloadURI,
  getPostApiPath,
  mastodonStatusToPost,
  parseUrl,
} from "./util";
import HorizontalHandlerbar from "./components/HorizontalHandlebar";
import VerticalHandlerbar from "./components/VerticalHandlebar";

const minWidth = 0;
const maxWidth = 400; // Max width after message width height

const minHeight = 0;
const maxHeight = 200; // ^

function App() {
  const [rendering, setRendering] = useState(false);
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [post, setPost] = useState<Post | null>(null);

  const [width, setWidthState] = useState(200);
  const [height, setHeightState] = useState(100);

  const setWidth = (value: number) => {
    if (value < minWidth) value = minWidth;
    if (value > maxWidth) value = maxWidth;
    setWidthState(value);
  };

  const setHeight = (value: number) => {
    if (value < minHeight) value = minHeight;
    if (value > maxHeight) value = maxHeight;
    setHeightState(value);
  };

  const submitUrl = async () => {
    const urlParsed = parseUrl(url);
    if (!urlParsed) return setMessage("Invalid Toot URL");
    if (urlParsed.protocol !== "https:")
      return setMessage("Protocol must be HTTPS");
    setMessage(`Loading ${urlParsed.postId}`);

    try {
      const targetUrl = new URL(
        `https://${urlParsed.host}${getPostApiPath(urlParsed.postId)}`
      );
      const res = await axios.get(targetUrl.toString(), {
        headers: {
          "User-Agent": "mastopoet/1.0.0",
        },
      });

      setPost(mastodonStatusToPost(res.data, urlParsed.host));
      setMessage("");
      setHeight(100);
      setWidth(200);
    } catch (e) {
      if (e instanceof AxiosError) {
        if (!e.response) return setMessage("Failed to reach API");
        if (e.response.status === 404)
          return setMessage("Toot not found. Is it private?");
      }
      setMessage("Unknown error trying to reach Mastodon instance");
    }
  };

  const itemRef = useRef<HTMLDivElement>(null);
  const exportImage = async () => {
    setRendering(true);
  };

  useEffect(() => {
    if (!rendering) return;
    (async () => {
      if (itemRef.current) {
        const canvas = await html2canvas(itemRef.current, {
          allowTaint: true,
          useCORS: true,
          scale: 2,
          backgroundColor: "#1e2028", // TODO: From theme!
          ignoreElements: (element) => element.classList.contains("handlebar"),
        });
        try {
          downloadURI(canvas.toDataURL("image/png", 1.0), `mastopoat.png`);
        } catch (e) {
          setMessage("Saving failed due to CORS issues.");
        }
      }
      setRendering(false);
    })();
  }, [rendering]);

  const ref = useRef<HTMLDivElement>(null);
  const PostItemReffed = useMemo(
    () =>
      forwardRef<HTMLDivElement>((props: unknown, ref) => (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <PostItem post={(props as any).post} refInstance={ref} />
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      )) as any,
    [post]
  );

  const isMobile = window.innerWidth < 1024;

  return (
    <>
      <div className="center-text">
        <h1>Mastopoet</h1>
        <p>
          Toot screenshot tool, running commit{" "}
          <a
            href="https://github.com/raikasdev/mastopoet"
            className="commit-link"
          >
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/** @ts-ignore */}
            {__COMMIT_HASH__}
          </a>
          <div className="hide-desktop alert">
            <span className="alert-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-devices-off"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M13 9a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v8m-1 3h-6a1 1 0 0 1 -1 -1v-6"></path>
                <path d="M18 8v-3a1 1 0 0 0 -1 -1h-9m-4 0a1 1 0 0 0 -1 1v12a1 1 0 0 0 1 1h9"></path>
                <path d="M16 9h2"></path>
                <path d="M3 3l18 18"></path>
              </svg>
              <strong>Not optimized for mobile devices</strong>
            </span>
            <p>
              Sorry! Mastopoet is not optimized for mobile devices yet. Custom
              backgrounds have been disabled.
            </p>
          </div>
        </p>
        <p>{message}</p>
      </div>
      <form
        className="search-form"
        onSubmit={(event) => {
          event.preventDefault();
          submitUrl();
        }}
      >
        <input
          className="search"
          type="url"
          placeholder="Link to Toot"
          value={url}
          onChange={(event) => setUrl(event.currentTarget.value)}
          required
        />
        <button className="search-button" type="submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-search"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label="Lookup"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
            <path d="M21 21l-6 -6"></path>
          </svg>
        </button>
      </form>
      <div className="flex-center" style={{ marginBottom: "2rem" }}>
        {post && (
          <button className="render-button" onClick={exportImage}>
            Download .png
          </button>
        )}
      </div>
      <div className="flex-center">
        {/** Scaling, width 600px + 8px for handles */}
        {post && (
          <div
            className="gradient-container"
            style={{
              padding: isMobile
                ? "0"
                : `${(maxHeight - height) / 2}px ${(maxWidth - width) / 2}px`,
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
              className={`theme-bird-ui gradient-box ${
                width == 0 && height == 0 ? "" : "gradient"
              } dynamic-padding`}
              style={{
                padding: isMobile ? "0" : `${height / 2}px ${width / 2}px`,
                borderRadius: rendering ? "0" : "2rem",
              }}
              ref={itemRef}
            >
              <HorizontalHandlerbar
                width={width}
                setWidth={setWidth}
                side="left"
              />
              {/** Disabled due to working weirdly in a flexbox */}
              <VerticalHandlerbar
                height={height}
                setHeight={setHeight}
                side={"top"}
              />
              <div>
                <PostItemReffed ref={ref} post={post} />
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
        )}
      </div>
    </>
  );
}

export default App;
