import { Attachment, Post } from "./components/Post";

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
      `<img class="emoji" src="${emoji.url}" />`
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
    }
  );
  return {
    username,
    displayName: obj.account.display_name,
    avatarUrl: obj.account.avatar,
    boosts: obj.reblogs_count,
    comments: obj.replies_count,
    favourites: obj.favourites_count,
    content,
    attachments,
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
