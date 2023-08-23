import { AxiosError } from "axios";
import { Attachment, Post, Reactions } from "../components/PostItem";
import BaseInstance from "./BaseInstance";
import { axiosInstance } from "../utils/axios";

interface MisskeyReaction {
  [emojiName: string]: number;
}

interface MisskeyInstanceInterface {
  name: string;
  softwareName: string;
  softwareVersion: string;
  iconUrl: string;
  faviconUrl: string;
  themeColor: string;
}

interface MisskeyUser {
  id: string;
  name: string;
  username: string;
  host?: string;
  avatarUrl: string;
  avatarBlurhash: string;
  isAdmin: boolean,
  isModerator: boolean,
  isBot?: boolean;
  isCat?: boolean;
  isLocked?: boolean;
  speakAsCat?: boolean;
  instance?: MisskeyInstanceInterface;
  emojis: MisskeyReaction;
}

interface MisskeyFileProperty {
  width: number;
  height: number;
  orientation: number;
  avgColor: string
}

interface MisskeyFile {
  id: string;
  createdAt: string;
  name: string;
  type: string;
  md5: string;
  size: number;
  isSensitive: boolean;
  blurHash: string;
  properties: MisskeyFileProperty;
  url: string;
  thumbnailUrl: string;
  comment: string;
  userId: string;
  user: MisskeyUser;
}

interface MisskeyNotesResponse {
  id: string;
  createdAt: string;
  deletedAt: string;
  text: string;
  cw: string;
  userId: string;
  user: MisskeyUser;
  replyId?: string;
  renoteId?: string;
  reply?: MisskeyNotesResponse; 
  renote?: MisskeyNotesResponse;
  isHidden: boolean;
  visibility: string;
  mentions: string[];
  visibleUserIds: string[]
  fileIds: string[]
  files: MisskeyFile[];
  tags: string;
  channelId: string;
  channel: object;
  localOnly: boolean;
  reactions: MisskeyReaction;
  reactionsEmoji: MisskeyReaction;
  renoteCount: number;
  repliesCount: number;
  emojis: MisskeyReaction;
  uri?: string;
  url?: string;
}

type TEmojiReplacer = { [emoji: string]: string };

class MisskeyCrossingInstanceException extends Error { }

export default class MisskeyInstance extends BaseInstance {
  private regexEmojiMatch: RegExp = /:[^:\s]*:/gm;
  private regexURIMatch: RegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gm;
  private regexUserMatch: RegExp = /(\B@[\w\d-_]+@([\w\d-]+\.)+[\w-]{2,4})|(\B@[\w\d-_]+)/gm;

  public async execute(): Promise<Post> {
    // TODO: instance/api/notes/show [POST]
    // TODO: instance/api/users/show [POST] [If there's mentions over there]
    if (this.url.protocol !== 'https:')
      throw new Error("Protocol must be HTTPS");

    try {
      const uri = new URL(`https://${this.url.host}/api/notes/show`);
      const note = await axiosInstance.post(uri.toString(), { noteId: this.postId });
      const dataNote: MisskeyNotesResponse = note.data;

      if (dataNote.user.instance)
        throw new MisskeyCrossingInstanceException(`MISKEY_CROSSING_INSTANCE_${dataNote.user.instance.name}`);

      const username = `@${dataNote.user.username}@${this.url.host}`

      const attachments: Attachment[] = dataNote.files.map(val => {
        return {
          type: 'image',
          url: val.url,
          aspectRatio: 1,
          description: val.comment
        }
      });

      const avatarUrl = new URL(dataNote.user.avatarUrl).searchParams.get('url') ?? "";

      const regexContentEmoji = dataNote.text.match(this.regexEmojiMatch);
      const contentEmoji = await this.parseArrayEmoji(!regexContentEmoji ? [] : regexContentEmoji);
      const content = this.parseContent(contentEmoji, dataNote.text);

      const regexDisplayNameEmoji = dataNote.user.name.match(this.regexEmojiMatch);
      const displayNameEmoji = await this.parseArrayEmoji(!regexDisplayNameEmoji ? [] : regexDisplayNameEmoji);
      const displayName = this.replaceEmoji(displayNameEmoji, dataNote.user.name)

      const reactions = await this.fetchReaction(dataNote.reactions);
      console.log(reactions);

      return {
        username,
        attachments,
        avatarUrl,
        content,
        displayName,
        reactions,
        plainUsername: dataNote.user.username,
        boosts: dataNote.renoteCount,
        comments: dataNote.repliesCount,
        favourites: this.parseReactionToFavourites(dataNote.reactions),
        date: new Date(dataNote.createdAt)
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        if (!e.response) throw new Error("Failed to reach API");
        if (e.response.status === 404)
          throw new Error("Post not found. Is it private?");
      }
      if (e instanceof MisskeyCrossingInstanceException)
        throw new Error('Crossing instance for Misskey is not supported!');

      throw new Error("Unknown error trying to reach Misskey instance");
    }
  }

  // TODO: Can you change this to reaction list like Misskey things?
  private parseReactionToFavourites(reaction: MisskeyReaction): number {
    let count = 0;
    Object.keys(reaction).forEach(react => {
      if (typeof reaction[react] !== 'number') return;
      count += reaction[react];
    });
    return count;
  }

  private async getEmojiFromInstance(emoji: string, host: string = this.url.host): Promise<string> {
    const uri = new URL(`https://${host}/api/emoji`);
    const emojiFetch = await axiosInstance.post(uri.toString(), { name: emoji });
    return emojiFetch.data.url as string;
  }

  private async fetchReaction(reaction: MisskeyReaction): Promise<Reactions[]> {
    const data: Reactions[] = [];

    await Promise.all(Object.keys(reaction).map(async react => {
      if (react[0] !== ':' && react[react.length - 1] !== ':') {
        data.push({ value: react, count: reaction[react] });
        return;
      }

      const originalReact = react;
      react = react.replace('@.:', ':');
      react = react.substring(1, react.length - 1);
      const guestDomain = react.match('@') ? react.split('@')[1] : this.url.host;
      react = guestDomain === this.url.host ? react : react.split('@')[0];
      const emoji = await this.getEmojiFromInstance(react, guestDomain);

      data.push({ url: emoji, count: reaction[originalReact] });
    }));

    return data;
  }

  private async parseArrayEmoji(setlist: string[]): Promise<TEmojiReplacer> {
    setlist = setlist.map(val => val.substring(1, val.length - 1));
    const newSetlist = [...new Set(setlist)];
    const retSetlist: {
      [emoji: string]: string
    } = {}

    await Promise.all(newSetlist.map(async val => {
      retSetlist[val] = await this.getEmojiFromInstance(val);
    }))

    return retSetlist;
  }

  private replaceEmoji(emojiList: TEmojiReplacer, text: string): string {
    Object.keys(emojiList).forEach(val => {
      text = text.replaceAll(
        `:${val}:`,
        `<img class="emoji" src="${emojiList[val]}" />`,
      );
    });
    return text;
  }

  private parseContent(emoji: TEmojiReplacer, text: string): string {
    // Set paragraph
    text = '<p>' + text.replace(/\n([ \t]*\n)+/g, '</p><p>')
      .replace('\n', '<br />') + '</p>';
    
    // Parse hashtags
    const hashtags = text.replace(/\s+/g,' ').split(' ').filter(x => x[0] === '#')
    hashtags.forEach(val => {
      text = text.replace(val, `<a href="${new URL(`https://${this.url.host}/tags/${val.substring(1)}`).toString()}">${val}</a>`);
    });

    // Parch URI
    const matchURI = text.match(this.regexURIMatch);
    if (matchURI) matchURI.forEach(val => {
      const uri = new URL(val);
      text = text.replace(val, `<a href="${uri.toString()}">${val}</a>`);
    });

    // Parse user
    const users = text.match(this.regexUserMatch);
    if (users) users.forEach(val => {
      const uri = new URL(`https://${this.url.host}/${val}`);
      text = text.replace(val, `<a href="${uri.toString()}">${val}</a>`)
    });

    // Parse Emoji
    text = this.replaceEmoji(emoji, text);

    return text;
  }
}