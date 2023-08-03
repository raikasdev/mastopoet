import { Post } from "../components/PostItem";
import BaseInstance from "./BaseInstance";

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
    throw new Error("Misskey/Firefish is not supported yet.")
  }
}
