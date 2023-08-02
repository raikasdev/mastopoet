import { Post } from "../components/PostItem";
import BaseInstance from "./BaseInstance";

export default class MastodonInstance extends BaseInstance {
  public async execute(): Promise<Post> {
    throw new Error("Misskey/Firefish is not supported yet.")
  }
}