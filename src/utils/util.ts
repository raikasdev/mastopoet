import { Post } from "../components/PostItem";
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

export function downloadURI(uri: string, name: string) {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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

export function generateAltText(post: Post, options: Options) {
  const language = (lang[options.language] as LangItem) || lang.en;

  const content =
    document.getElementById("content")?.innerText || language.fetchError;

  let attachmentsText = "";
  if (post.attachments.length === 1) {
    const altText = post.attachments[0].description;
    attachmentsText = `${language.attachments.single.attachments} ${
      altText
        ? language.attachments.single.has.replace("{altText}", altText)
        : language.attachments.single.hasNot
    }`;
  } else if (post.attachments.length > 1) {
    attachmentsText = language.attachments.multiple.attachments.replace(
      "{count}",
      `${post.attachments.length}`,
    );
    post.attachments.forEach((attachment, index) => {
      attachmentsText += attachment.description
        ? language.attachments.multiple.has
            .replace("{index}", `${index + 1}`)
            .replace("{altText}", attachment.description)
        : language.attachments.multiple.hasNot.replace(
            "{index}",
            `${index + 1}`,
          );
    });
  }

  const pollText = post.poll
    ? `${language.poll.intro} ${post.poll
        .map((i) =>
          language.poll.item
            .replace("{percentage}", `${i.percentage}`)
            .replace("{title}", i.title),
        )
        .join(", ")}`
    : "";
  const intro = language.intro
    .replace("{displayName}", post.displayName)
    .replace("{username}", post.username)
    .replace("{date}", formatDate(post.date))
    .replace("{favourites}", `${post.favourites}`)
    .replace("{boosts}", `${post.boosts}`)
    .replace("{replies}", `${post.comments}`);

  return [intro, attachmentsText, pollText, content]
    .filter((i) => i !== "")
    .join("\n\n");
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

  navigator.clipboard.writeText(generateAltText(post, options));
}
