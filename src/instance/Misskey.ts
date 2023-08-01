import { Post } from "../components/PostItem";
import BaseInstance from "./BaseInstance";

export default class MisskeyInstance extends BaseInstance {
  public async execute(): Promise<any> {
    console.log("Hello world! [Misskey]");
    return "";
  }
}