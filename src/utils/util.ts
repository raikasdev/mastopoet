import { AxiosError } from "axios";
import { Attachment, Post } from "../components/PostItem";
import { axiosInstance } from "./axios";
import lang, { LangItem } from "../lang";
import { Options } from "../config";

const POST_REGEXES = [
  /^\/@\w+(?:@[\w-.]+)?\/(\d+)$/, // instance.social/@user/postid
  /^\/users\/\w+(?:@[\w-.]+)?\/statuses\/(\d+)$/, // instance.social/users/user/statuses/postid
];

/**
 * @deprecated Replacing with multi-instance support
 */
export function parseUrl(inputURL: string) {
  try {
    const url = new URL(inputURL);
    const regex = POST_REGEXES.find((regex) => url.pathname.match(regex));
    if (!regex) return null;

    const regexMatch = url.pathname.match(regex);
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

/**
 * @deprecated Replacing with multi-instance support
 */
export const getPostApiPath = (id: string) => `/api/v1/statuses/${id}`;

export const truncateString = (str: string, num: number) => {
  const arr = Array.from(str);
  if (arr.length > num) {
    return arr.slice(0, num).join("") + "…";
  } else {
    return str;
  }
};

/**
 * @deprecated Replacing with multi-instance support
 */
export async function mastodonStatusToPost(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
  host: string,
): Promise<Post> {
  let username = obj.account.acct;
  if (!username.includes("@")) {
    console.debug("Local toot, looking up username from WebFinger...");
    // A local username, time for WebFinger lookup...
    const webFingerURL = new URL(`https://${host}/.well-known/webfinger`);
    webFingerURL.searchParams.set("resource", `acct:${username}@${host}`);
    try {
      const res = await axiosInstance.get(webFingerURL.toString());

      const subject = res.data.subject;

      username = new URL(subject).pathname;
    } catch (e) {
      // If WebFinger lookup fails, just resort to lazy domain
      username = `${username}@${host}`;
    }
  }

  username = `@${username}`;

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
      description?: string;
    }): Attachment => {
      console.log(mediaAttachment);
      return {
        type: mediaAttachment.type,
        url: mediaAttachment.url,
        aspectRatio: mediaAttachment.meta.original.aspect,
        description: mediaAttachment.description,
      };
    },
  );

  let displayName = truncateString(
    obj.account.display_name === ""
      ? obj.account.username
      : obj.account.display_name,
    30,
  );

  obj.account.emojis.forEach((emoji: { url: string; shortcode: string }) => {
    displayName = displayName.replaceAll(
      `:${emoji.shortcode}:`,
      `<img class="emoji" src="${emoji.url}" />`,
    );
  });

  return {
    username,
    plainUsername: obj.account.username,
    displayName,
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

/**
 * @deprecated Replacing with multi-instance support
 */
export async function submitUrl(url: string) {
  const urlParsed = parseUrl(url);
  if (!urlParsed) throw new Error("Invalid Mastodon post URL");
  if (urlParsed.protocol !== "https:")
    throw new Error("Protocol must be HTTPS");

  try {
    const targetUrl = new URL(
      `https://${urlParsed.host}${getPostApiPath(urlParsed.postId)}`,
    );
    const res = await axiosInstance.get(targetUrl.toString());

    return mastodonStatusToPost(res.data, urlParsed.host);
  } catch (e) {
    if (e instanceof AxiosError) {
      if (!e.response) throw new Error("Failed to reach API");
      if (e.response.status === 404)
        throw new Error("Post not found. Is it private?");
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

export async function copyAltText(post: Post, options: Options) {
  try {
    const permRes = await navigator.permissions.query({
      name: "clipboard-write",
    } as never);

    if (permRes.state === "denied" || permRes.state === "prompt")
      throw new Error("Access to clipboard was blocked");
  } catch (e) {
    if (e instanceof TypeError) {
      console.log("Browser does not support clipboard-write permission");
    } else {
      throw new Error("Access to clipboard was blocked");
    }
  }

  const language = lang[options.language] as LangItem || lang.en;

  const content =
    document.getElementById("content")?.innerText ||
    language.fetchError;

  let attachmentsText = "";
  if (post.attachments.length === 1) {
    const altText = post.attachments[0].description;
    attachmentsText = `${language.attachments.single.attachments} ${
      altText
        ? language.attachments.single.has.replace('{altText}', altText)
        : language.attachments.single.hasNot
    }`;
  } else if (post.attachments.length > 1) {
    attachmentsText = language.attachments.multiple.attachments.replace('{count}', `${post.attachments.length}`);
    post.attachments.forEach((attachment, index) => {
      attachmentsText += 
        attachment.description
          ? language.attachments.multiple.has.replace('{index}', `${index + 1}`).replace('{altText}', attachment.description)
          : language.attachments.multiple.hasNot.replace('{index}', `${index + 1}`)
    });
  }

  const pollText = post.poll ? `${language.poll.intro} ${post.poll.map((i) => language.poll.item.replace('{percentage}', `${i.percentage}`).replace('{title}', i.title)).join(", ")}` : '';
  const intro = language.intro
    .replace('{displayName}', post.displayName)
    .replace('{username}', post.username)
    .replace('{date}', formatDate(post.date))
    .replace('{favourites}', `${post.favourites}`)
    .replace('{boosts}', `${post.boosts}`)
    .replace('{replies}', `${post.comments}`);

  navigator.clipboard.writeText(
    [intro, attachmentsText, pollText, content].filter((i) => i !== "").join("\n\n"),
  );
}
