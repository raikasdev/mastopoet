import { AxiosError } from "axios";
import { Attachment, Post } from "../components/PostItem";
import { truncateString } from "../utils/util";
import BaseInstance from "./BaseInstance";
import { axiosInstance } from "../utils/axios";

interface MisskeyReaction {
  [emojiName: string]: string | number;
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

export default class MisskeyInstance extends BaseInstance {
  public async execute(): Promise<Post> {
    // TODO: instance/api/notes/show [POST]
    // TODO: instance/api/users/show [POST] [If there's mentions over there]
    if (this.url.protocol !== 'https:')
      throw new Error("Protocol must be HTTPS");

    try {
      const uri = new URL(`https://${this.url.host}/api/notes/show`);
      const note = await axiosInstance.post(uri.toString(), { noteId: this.postId });
      const dataNote: MisskeyNotesResponse = note.data;

      console.log(dataNote);

      const username = `@${dataNote.user.username}@${this.url.host}`

      const attachments: Attachment[] = dataNote.files.map(val => {
        return {
          type: 'image',
          url: val.url,
          aspectRatio: 1,
          description: val.comment
        }
      });
      console.log(attachments);

      return {
        username,
        attachments,
        displayName: dataNote.user.name,
        plainUsername: dataNote.user.username,
        avatarUrl: dataNote.user.avatarUrl,
        content: dataNote.text,
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
      throw new Error("Unknown error trying to reach Misskey instance");
    }
  }

  // TODO: Can you change this to reaction list like Misskey things?
  private parseReactionToFavourites(reaction: MisskeyReaction): number {
    let count = 0;
    Object.keys(reaction).forEach(react => {
      if (typeof reaction[react] !== 'number') return;
      count += reaction[react] as number;
    });
    return count;
  }
}
