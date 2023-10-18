import { useEffect, useRef, useState } from "react";
import { Post } from "../components/PostItem";
import html2canvas from "html2canvas";
import { copyAltText, downloadURI, generateAltText } from "../utils/util";
import emojiRegex from "emoji-regex";
import emoji from "emojilib";
import PostContainer from "../components/PostContainer";
import useMinmaxState from "../utils/use-minmax-state";
import {
  Options,
  defaultHeight,
  defaultWidth,
  maxHeight,
  maxWidth,
  welcomePost,
} from "../config";
import SearchForm from "../components/SearchForm";
import { useObjectState } from "../utils/use-object-state";
import OptionsEditor from "../components/OptionsEditor";
import fetchPost from "../instance/_main";

import CORSAlert from "../components/CORSAlert";
import addExif from "../utils/piexif";

function IndexPage() {
  const [post, setPost] = useState<Post>(welcomePost);
  const [message, setMessage] = useState("");
  const [rendering, setRendering] = useState(false);
  const [options, setOptions] = useObjectState<Options>(
    localStorage.getItem("options")
      ? JSON.parse(localStorage.getItem("options") as string)
      : {
          theme: "bird-ui",
          interactions: "feed",
          background: "linear-gradient(to right, #fc5c7d, #6a82fb)",
          scale: 2,
          language: "en",
        },
  );
  const [width, setWidth] = useMinmaxState(defaultWidth, 0, maxWidth);
  const [height, setHeight] = useMinmaxState(defaultHeight, 0, maxHeight);

  const [corsHost, setCorsHost] = useState("");

  // Saving options to local storage
  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(options));
  }, [options]);

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

        const dataUri = canvas.toDataURL("image/jpeg", 1.0);
        const altText = generateAltText(post, options).replaceAll(
          emojiRegex(),
          (value) => {
            if (!emoji[value]) return "unknown emoji";
            return `${(emoji[value][0] ?? "unknown").replaceAll(
              "_",
              " ",
            )} emoji`;
          },
        ); // Need to make it safe for EXIF

        try {
          downloadURI(
            addExif(dataUri, altText),
            `mastopoet-${
              post?.plainUsername || "unknown-user"
            }-${timeStamp}.jpg`,
          );
        } catch (e) {
          console.error(e);
          try {
            downloadURI(
              dataUri,
              `mastopoet-${
                post?.plainUsername || "unknown-user"
              }-${timeStamp}.jpg`,
            );
          } catch (e) {
            setMessage("Saving failed due to CORS issues.");
            return;
          }
          setMessage("Saving with EXIF metadata failed.");
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
          const response = await fetchPost(url);
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
            <button
              className="render-button"
              onClick={() => copyAltText(post, options)}
            >
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

export default IndexPage;
