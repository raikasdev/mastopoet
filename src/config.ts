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
  | "hidden";

export interface Options {
  theme: Theme;
  interactions: InteractionsPreference;
}
