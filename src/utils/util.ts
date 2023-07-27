import axios, { AxiosError } from "axios";
import { Attachment, Post } from "../components/PostItem";

const POST_REGEX = /^\/@\w+(?:@[\w-.]+)?\/(\d+)$/;

export function parseUrl(inputURL: string) {
  try {
    const url = new URL(inputURL);
    const regexMatch = url.pathname.match(POST_REGEX);

    if (!regexMatch) return null;
    const postId = parseInt(regexMatch[1]);

    if (isNaN(postId)) return null;

    return {
      host: url.host,
      protocol: url.protocol,
      postId: regexMatch[1], // Not actually returning int, because ID's are too long for JavaScript :/
    };
  } catch (e) {
    return null;
  }
}

export const getPostApiPath = (id: string) => `/api/v1/statuses/${id}`;

export const truncateString = (str: string, num: number) => {
  const arr = Array.from(str);
  if (arr.length > num) {
    return arr.slice(0, num).join("") + "…";
  } else {
    return str;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mastodonStatusToPost(obj: any, host: string): Post {
  const username = obj.account.acct.includes("@")
    ? `@${obj.account.acct}`
    : `@${obj.account.acct}@${host}`; // Lazy check

  // Emoji replacer (quality code 100%)
  let content = obj.content;

  obj.emojis.forEach((emoji: { url: string; shortcode: string }) => {
    content = content.replaceAll(
      `:${emoji.shortcode}:`,
      `<img class="emoji" src="${emoji.url}" />`,
    );
  });

  // Parse attachment
  const attachments = obj.media_attachments.map(
    (mediaAttachment: {
      type: string;
      url: string;
      meta: { original: { aspect: number } };
    }): Attachment => {
      return {
        type: mediaAttachment.type,
        url: mediaAttachment.url,
        aspectRatio: mediaAttachment.meta.original.aspect,
      };
    },
  );
  return {
    username,
    displayName:
      obj.account.display_name === ""
        ? obj.account.username
        : obj.account.display_name,
    avatarUrl: obj.account.avatar,
    boosts: obj.reblogs_count,
    comments: obj.replies_count,
    favourites: obj.favourites_count,
    content,
    attachments,
    date: new Date(obj.created_at),
  };
}

export function downloadURI(uri: string, name: string) {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function submitUrl(url: string) {
  const urlParsed = parseUrl(url);
  if (!urlParsed) throw new Error("Invalid Toot URL");
  if (urlParsed.protocol !== "https:")
    throw new Error("Protocol must be HTTPS");

  try {
    const targetUrl = new URL(
      `https://${urlParsed.host}${getPostApiPath(urlParsed.postId)}`,
    );
    const res = await axios.get(targetUrl.toString(), {
      headers: {
        "User-Agent": "mastopoet/1.0.0",
      },
    });

    return mastodonStatusToPost(res.data, urlParsed.host);
  } catch (e) {
    if (e instanceof AxiosError) {
      if (!e.response) throw new Error("Failed to reach API");
      if (e.response.status === 404)
        throw new Error("Toot not found. Is it private?");
    }
    throw new Error("Unknown error trying to reach Mastodon instance");
  }
}

export function formatDate(date: Date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formattedDate = new Date(date);
  const year = formattedDate.getFullYear();
  const month = months[formattedDate.getMonth()];
  const day = formattedDate.getDate();
  const hours = formattedDate.getHours().toString().padStart(2, "0");
  const minutes = formattedDate.getMinutes().toString().padStart(2, "0");

  return `${month} ${day}, ${year}, ${hours}:${minutes}`;
}
