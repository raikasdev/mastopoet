import { useRef, useState } from "react";
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

function App() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [post, setPost] = useState<Post | null>(null);

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
    if (!itemRef.current) return alert("No ref current");
    const canvas = await html2canvas(itemRef.current, {
      allowTaint: true,
      useCORS: true,
      scale: 2,
      backgroundColor: "#1e2028", // TODO: From theme!
    });
    try {
      downloadURI(canvas.toDataURL("image/png", 1.0), `mastopoat.png`);
    } catch (e) {
      setMessage("Saving failed due to CORS issues.");
    }
  };

  return (
    <>
      <div className="center-text">
        <h1>Mastopoet</h1>
        <p>Toot screenshot tool</p>
        <p>{message}</p>
        <div id="testicanvas"></div>
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
        {post && (
          <div className={`theme-bird-ui`} ref={itemRef}>
            <PostItem post={post} />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
