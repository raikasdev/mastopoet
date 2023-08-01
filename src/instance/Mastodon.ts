import { Post } from "../components/PostItem";
import BaseInstance from "./BaseInstance";

export default class MastodonInstance extends BaseInstance {
  public async execute(): Promise<any> {
    console.log("Hello world! [Mastodon]");
    return "";
  }
}