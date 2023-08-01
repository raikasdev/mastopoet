import { Post } from '../components/PostItem';
import BaseInstance from './BaseInstance';
import MastodonInstance from "./Mastodon";
import MisskeyInstance from './Misskey';

type InstanceListType = [typeof BaseInstance, RegExp[]][]
const Instances: InstanceListType = [
  [MastodonInstance, [
    /^\/@\w+(?:@[\w-.]+)?\/(\d+)$/, // instace.social/@user/postid
    /^\/users\/\w+(?:@[\w-.]+)?\/statuses\/(\d+)$/, // instance.social/users/user/statuses/postid
  ]],
  [MisskeyInstance, [
    /^\/notes\/(\w+)$/, // instace.social/notes/postid
  ]]
];
export default async function(inputURL: string): Promise<Post> {
  return new Promise((resolve, reject) => {
    const url = new URL(inputURL);
    Instances.find( ([instance, reg]) => {
      return reg.some(x => {
        const match = url.pathname.match(x)
        if (!match) return;

        const postId = match[1];
        const initInstance = new (instance)(url, postId);
        initInstance.execute().then(res => resolve(res)).catch(err => reject(err))
      });
    });
  });
}