import { AxiosError } from "axios";
import { Attachment, Post } from "../components/PostItem";
import { truncateString } from "../utils/util";
import BaseInstance from "./BaseInstance";
import { axiosInstance } from "../utils/axios";

export default class MastodonInstance extends BaseInstance {
  public async execute(): Promise<Post> {
    if (this.url.protocol !== "https:")
      throw new Error("Protocol must be HTTPS");

    try {
      const targetUrl = new URL(
        `https://${this.url.host}/api/v1/statuses/${this.postId}`,
      );
      const res = await axiosInstance.get(targetUrl.toString());

      return await this.mastodonStatusToPost(res.data, this.url.host);
    } catch (e) {
      if (e instanceof AxiosError) {
        if (!e.response) throw new Error("Failed to reach API");
        if (e.response.status === 404)
          throw new Error("Post not found. Is it private?");
      }
      throw new Error("Unknown error trying to reach Mastodon instance");
    }
  }

  private async mastodonStatusToPost(
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
        const res = await axiosInstance(webFingerURL.toString());

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

    const pollTotal =
      obj.poll?.options.reduce(
        (acc: number, option: { votes_count: number }) =>
          acc + option.votes_count,
        0,
      ) || 1;

    const poll = obj.poll?.options.map(
      (option: { title: string; votes_count: number }) => ({
        title: option.title,
        votesCount: option.votes_count,
        percentage: Math.round((option.votes_count / pollTotal) * 100),
      }),
    );

    return {
      username,
      plainUsername: obj.account.username,
      displayName,
      avatarUrl: obj.account.avatar,
      boosts: obj.reblogs_count,
      comments: obj.replies_count,
      postURL: obj.url,
      profileURL: obj.account.url,
      favourites: obj.favourites_count,
      content,
      attachments,
      poll,
      date: new Date(obj.created_at),
    };
  }
}
