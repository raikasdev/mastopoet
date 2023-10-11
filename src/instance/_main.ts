import { Post } from "../components/PostItem";
import BaseInstance from "./BaseInstance";
import MisskeyInstance from "./Misskey";
import MastodonInstance from "./Mastodon";
import AkkomaInstance from "./Akkoma";

// Since all script on ReactJS will be imported to frontend,
// we cannot dynamically import them using File System NodeJS.
type InstanceListType = [typeof BaseInstance, RegExp[]][];
const Instances: InstanceListType = [
  [
    MastodonInstance,
    [
      /^\/@\w+(?:@[\w-.]+)?\/(\d+)$/, // instace.social/@user/postid
      /^\/users\/\w+(?:@[\w-.]+)?\/statuses\/(\d+)$/, // instance.social/users/user/statuses/postid
    ],
  ],
  [
    AkkomaInstance,
    [
      /^\/@\w+(?:@[\w-.]+)?\/posts\/(\w+)$/, // Akkoma, instance.social/@user/posts/postid
      /^\/notice\/(\w+)$/, // instance.social/notice/posts/postid
    ],
  ],
  [
    MisskeyInstance,
    [
      /^\/notes\/(\w+)$/, // instace.social/notes/postid
    ],
  ],
];
export default async function (inputURL: string): Promise<Post> {
  return new Promise((resolve, reject) => {
    const url = new URL(inputURL);
    let found = false;
    Instances.find(([instance, reg]) => {
      return reg.some((x) => {
        const match = url.pathname.match(x);
        if (!match) return;
        if (found) return;

        const postId = match[1];
        const initInstance = new instance(url, postId);
        initInstance
          .execute()
          .then((res) => resolve(res))
          .catch((err) => reject(err));
        found = true;
      });
    });
    if (!found) reject(new Error("Invalid URL"));
  });
}
