import { useState } from "react";

interface SearchFormProps {
  submitUrl: (url: string) => void;
}
export default function SearchForm({ submitUrl }: SearchFormProps) {
  const [url, setUrl] = useState("");

  return (
    <form
      className="search-form"
      onSubmit={(event) => {
        event.preventDefault();
        submitUrl(url);
      }}
    >
      <input
        className="search"
        type="url"
        placeholder="Link to Mastodon post"
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
  );
}
