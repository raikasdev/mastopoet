import BaseInstance from "./BaseInstance";

export default class MastodonInstance extends BaseInstance {
  public async execute(): Promise<any> {
    throw new Error("Misskey support not implemented")
  }
}