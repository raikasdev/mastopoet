import { Post } from "../components/PostItem";

export default class BaseInstance {
  public url: URL = new URL("https://example.com");
  public postId: string = "";
  public async execute(): Promise<Post> {
    throw new Error("Not implemented");
  }

  constructor (url: URL, postId: string) {
    this.url = url;
    this.postId = postId;
  }
}