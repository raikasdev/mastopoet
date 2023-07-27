import { ForwardedRef } from "react";
import { truncateString } from "../util";

export interface Post {
  displayName: string;
  username: string;
  avatarUrl: string;
  content: string; // HTML!
  favourites: number;
  boosts: number;
  comments: number;
  attachments: Attachment[];
}

export interface Attachment {
  type: string;
  url: string;
  aspectRatio: number;
}

export default function PostItem({
  post,
  refInstance,
}: {
  post: Post;
  refInstance: ForwardedRef<HTMLDivElement>;
}) {
  const {
    displayName,
    username,
    avatarUrl,
    content,
    favourites,
    boosts,
    comments,
    attachments,
  } = post;

  return (
    <div className="toot" ref={refInstance}>
      <div className="profile">
        <div className="avatar">
          <img src={avatarUrl} alt={displayName} crossOrigin="anonymous" />
        </div>
        <span className="display-name">
          <bdi>
            <strong>{truncateString(displayName, 30)}</strong>
          </bdi>
          <span className="username">{username}</span>
        </span>
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
      <div className="image-gallery">
        {attachments.map((attachment) => {
          if (attachment.type === "image")
            return (
              <img
                key={attachment.url}
                src={attachment.url}
                className="attachment"
                style={{ aspectRatio: `${attachment.aspectRatio} / 1` }}
                crossOrigin="anonymous"
              />
            );
          if (attachment.type === "gifv")
            return (
              <video
                key={attachment.url}
                src={attachment.url}
                className="attachment"
                style={{ aspectRatio: `${attachment.aspectRatio} / 1` }}
                muted
                playsInline
                controls={false}
                crossOrigin="anonymous"
              />
            );
          return <div key={attachment.url}></div>;
        })}
      </div>
      <div className="action-bar">
        <div className="action">
          <span className="icon-reply" />
          <span className="action-counter">{comments}</span>
        </div>
        <div className="action">
          <span className="icon-boost" />
          <span className="action-counter">{boosts}</span>
        </div>
        <div className="action">
          <span className="icon-star" />
          <span className="action-counter">{favourites}</span>
        </div>
      </div>
    </div>
  );
}
