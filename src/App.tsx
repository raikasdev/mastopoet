import { useEffect, useRef, useState } from "react";
import { Post } from "./components/PostItem";
import html2canvas from "html2canvas";
import { copyAltText, downloadURI, submitUrl } from "./utils/util";
import PostContainer from "./components/PostContainer";
import useMinmaxState from "./utils/use-minmax-state";
import {
  Options,
  defaultHeight,
  defaultWidth,
  maxHeight,
  maxWidth,
  welcomePost,
} from "./config";
import SearchForm from "./components/SearchForm";
import { useObjectState } from "./utils/use-object-state";
import OptionsEditor from "./components/OptionsEditor";
import fetchPost from "./instance/_main";

// Main styles
import "./styles/App.scss";

// Themes
import "./themes/BirdUi.scss";
import "./themes/Mastodon.scss";
import CORSAlert from "./components/CORSAlert";

function App() {
  const [message, setMessage] = useState("");
  const [post, setPost] = useState<Post | null>(welcomePost);
  const [rendering, setRendering] = useState(false);
  const [options, setOptions] = useObjectState<Options>({
    theme: "bird-ui",
    interactions: "feed",
    background: "linear-gradient(to right, #fc5c7d, #6a82fb)",
    scale: 2,
  });
  const [width, setWidth] = useMinmaxState(defaultWidth, 0, maxWidth);
  const [height, setHeight] = useMinmaxState(defaultHeight, 0, maxHeight);

  const [corsHost, setCorsHost] = useState("");

  /** Screenshotting */
  const screenshotRef = useRef<HTMLDivElement>(null);
  const exportImage = async () => {
    setRendering(true);
  };

  useEffect(() => {
    if (!rendering) return;
    (async () => {
      if (screenshotRef.current) {
        const canvas = await html2canvas(screenshotRef.current, {
          allowTaint: true,
          useCORS: true,
          scale: options.scale,
          backgroundColor: "#1e2028", // TODO: From theme!
          ignoreElements: (element) => element.classList.contains("handlebar"),
        });
        const timeStamp = post?.date
          .toLocaleDateString("en-GB")
          .split("/")
          .join(""); // DDMMYYYY
        try {
          downloadURI(
            canvas.toDataURL("image/jpeg", 1.0),
            `mastopoet-${
              post?.plainUsername || "unknown-user"
            }-${timeStamp}.jpg`,
          );
        } catch (e) {
          setMessage("Saving failed due to CORS issues.");
        }
      }
      setRendering(false);
    })();
  }, [rendering]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get("url");

    if (url) {
      (async () => {
        try {
          const response = await submitUrl(url);
          setPost(response);
          setHeight(defaultHeight);
          setWidth(defaultWidth);
          setCorsHost("");
        } catch (e) {
          setMessage("Query URL is not a valid post");
        }
      })();
    }
  }, []);

  /** End screenshotting */

  return (
    <>
      <div className="center-text">
        <h1>Mastopoet</h1>
        <p>
          The Mastodon post screenshot tool, running v{__APP_VERSION__} (
          <a
            href="https://github.com/raikasdev/mastopoet"
            className="commit-link"
          >
            {__COMMIT_HASH__}
          </a>
          )
        </p>
        <p>{message}</p>
      </div>
      {corsHost !== "" && <CORSAlert host={corsHost} />}

      <SearchForm
        submitUrl={async (url) => {
          setMessage("");
          try {
            const response = await fetchPost(url);
            setPost(response);
            setHeight(defaultHeight);
            setWidth(defaultWidth);
            setCorsHost("");
          } catch (e) {
            if (e instanceof Error) {
              return setMessage(e.message);
            }
            setMessage("Unknown error occurred");
          }
        }}
      />
      {post && (
        <OptionsEditor
          options={options}
          setOptions={setOptions}
          width={width}
        />
      )}
      <div
        className="flex-center button-grid"
        style={{ marginBottom: "0.5rem" }}
      >
        {post && (
          <>
            <button className="render-button" onClick={exportImage}>
              Download .jpg
            </button>
            <button className="render-button" onClick={() => copyAltText(post)}>
              Copy ALT text
            </button>
          </>
        )}
      </div>
      {post && (
        <PostContainer
          post={post}
          height={height}
          setHeight={setHeight}
          width={width}
          setWidth={setWidth}
          rendering={rendering}
          screenshotRef={screenshotRef}
          options={options}
          onImageLoadError={(host) => setCorsHost(host)}
        />
      )}
    </>
  );
}

export default App;
