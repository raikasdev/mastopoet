import { Post } from "./components/PostItem";

export const maxWidth = 400; // Max width (of gradient) after message width
export const defaultWidth = 200;

export const maxHeight = 200; // Max height (of gradient) after message height
export const defaultHeight = 100;

export const themes = [
  "bird-ui",
  "bird-ui-light",
  "mastodon",
  "mastodon-light",
] as const;

export type Theme = (typeof themes)[number];
export type InteractionsPreference =
  | "normal"
  | "normal no-replies"
  | "feed"
  | "feed no-date"
  | "hidden";

export interface Options {
  theme: Theme;
  interactions: InteractionsPreference;
  background: string;
  scale: number;
}

export const welcomePost: Post = {
  username: "@raikas@mementomori.social",
  plainUsername: "raikas",
  displayName: "Roni Äikäs ⚛️",
  attachments: [],
  avatarUrl: "/raikasdev.jpg",
  boosts: 0,
  comments: 0,
  favourites: 0,
  date: new Date(1690503611282),
  content: `<p>Hello and welcome to <a href="https://mementomori.social/tags/Mastopoet" class="mention hashtag" rel="tag">#<span>Mastopoet</span></a> !<br />Paste a Mastodon post URL in the field above and play with the options to create perfect screenshots!</p><p>Source code (licensed under MIT) -&gt; <a href="https://github.com/raikasdev/mastopoet" target="_blank" rel="nofollow noopener noreferrer" translate="no"><span class="invisible">https://</span><span class="">github.com/raikasdev/mastopoet</span><span class="invisible"></span></a><br />Reach out to me -&gt; <a href="https://mementomori.social/@raikas" target="_blank" rel="nofollow noopener noreferrer" translate="no"><span class="invisible">https://</span><span class="">mementomori.social/@raikas</span><span class="invisible"></span></a>${
    import.meta.env.VITE_HIDE_DEVELOPER_KOFI_AD === "true"
      ? ""
      : '<br /><br />If you enjoy Mastopoet, consider buying me a coffee ☕<br />at <a href="https://ko-fi.com/raikasdev" target="_blank" rel="nofollow noopener noreferrer" translate="no"><span class="invisible">https://</span><span class="">ko-fi.com/raikasdev</span></a>, I would really appreciate it ❤️!</p>'
  }`,
};
