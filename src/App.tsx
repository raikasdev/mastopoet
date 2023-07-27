import { useEffect, useRef, useState } from "react";
import { Post } from "./components/PostItem";
import html2canvas from "html2canvas";
import { downloadURI, submitUrl } from "./utils/util";
import MobileAlert from "./components/MobileAlert";
import PostContainer from "./components/PostContainer";
import useMinmaxState from "./utils/use-minmax-state";
import {
  Options,
  defaultHeight,
  defaultWidth,
  maxHeight,
  maxWidth,
} from "./config";
import SearchForm from "./components/SearchForm";
import { useObjectState } from "./utils/use-object-state";
import OptionsEditor from "./components/OptionsEditor";

// Main styles
import "./styles/App.scss";

// Themes
import "./themes/BirdUi.scss";
import "./themes/Mastodon.scss";

function App() {
  const [message, setMessage] = useState("");
  const [post, setPost] = useState<Post | null>(null);
  const [rendering, setRendering] = useState(false);
  const [options, setOptions] = useObjectState<Options>({
    theme: "bird-ui",
    interactions: "feed",
    background: "linear-gradient(to right, #fc5c7d, #6a82fb)",
  });
  const [width, setWidth] = useMinmaxState(defaultWidth, 0, maxWidth);
  const [height, setHeight] = useMinmaxState(defaultHeight, 0, maxHeight);

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
  /** End screenshotting */

  return (
    <>
      <div className="center-text">
        <h1>Mastopoet</h1>
        <p>
          The Toot screenshot tool, running commit{" "}
          <a
            href="https://github.com/raikasdev/mastopoet"
            className="commit-link"
          >
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/** @ts-ignore */}
            {__COMMIT_HASH__}
          </a>
        </p>
        <MobileAlert />
        <p>{message}</p>
      </div>
      <SearchForm
        submitUrl={async (url) => {
          setMessage("");
          try {
            const response = await submitUrl(url);
            setPost(response);
            setHeight(defaultHeight);
            setWidth(defaultWidth);
          } catch (e) {
            if (e instanceof Error) {
              return setMessage(e.message);
            }
            setMessage("Unknown error occurred");
          }
        }}
      />
      {post && <OptionsEditor options={options} setOptions={setOptions} />}
      <div className="flex-center" style={{ marginBottom: "2rem" }}>
        {post && (
          <button className="render-button" onClick={exportImage}>
            Download .png
          </button>
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
        />
      )}
    </>
  );
}

export default App;
