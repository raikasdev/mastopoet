import { ForwardedRef } from "react";
import { formatDate } from "../utils/util";
import { InteractionsPreference, Options } from "../config";

export interface Post {
  displayName: string;
  plainUsername: string;
  username: string;
  avatarUrl: string;
  content: string; // HTML!
  favourites: number;
  boosts: number;
  comments: number;
  attachments: Attachment[];
  date: Date;
}

export interface Attachment {
  type: string;
  url: string;
  aspectRatio: number;
  description?: string;
}

export interface PostItemProps {
  post: Post;
  refInstance?: ForwardedRef<HTMLDivElement>;
  interactionsPref: InteractionsPreference;
  onImageLoadError: () => void;
  options: Options;
}

export default function PostItem({
  post,
  refInstance,
  interactionsPref,
  onImageLoadError,
  options,
}: PostItemProps) {
  const {
    displayName,
    username,
    avatarUrl,
    content,
    favourites,
    boosts,
    comments,
    attachments,
    date,
  } = post;

  return (
    <div className="toot" ref={refInstance}>
      <div className="profile">
        <div className="avatar">
          <img
            src={avatarUrl}
            alt={displayName}
            crossOrigin="anonymous"
            onError={onImageLoadError}
          />
        </div>
        <span className="display-name">
          <bdi>
            <strong dangerouslySetInnerHTML={{ __html: displayName }}></strong>
          </bdi>
          <span className="username">{username}</span>
          {/** Replace with :has when Firefox starts supporting it */}
          {options.interactions === "feed" && (
            <span className="datetime">Jul 28, 2023, 17:11</span>
          )}
        </span>
      </div>
      <div
        className="content"
        id="content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {attachments.length !== 0 && (
        <div className="gallery-holder">
          <div
            className="image-gallery"
            style={{
              gridTemplateColumns: `repeat(${
                attachments.length <= 2 ? attachments.length : 2
              }, minmax(0, 1fr))`,
            }}
          >
            {attachments.map((attachment) => {
              if (attachment.type === "image")
                return (
                  <img
                    key={attachment.url}
                    src={attachment.url}
                    className="attachment"
                    style={{ aspectRatio: `${attachment.aspectRatio} / 1` }}
                    crossOrigin="anonymous"
                    onError={onImageLoadError}
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
                    onError={onImageLoadError}
                  />
                );
              return <div key={attachment.url}></div>;
            })}
          </div>
        </div>
      )}
      <div className={`action-bar action-bar-${interactionsPref}`}>
        <span className="action-bar-datetime">{formatDate(date)}</span>
        <div className="action">
          <span className="icon-reply" />
          <span className="action-counter">{comments}</span>
          <span className="action-label">Replies</span>
        </div>
        <div className="action">
          <span className="icon-boost" />
          <span className="action-counter">{boosts}</span>
          <span className="action-label">Boosts</span>
        </div>
        <div className="action">
          <span className="icon-star" />
          <span className="action-counter">{favourites}</span>
          <span className="action-label">Favourites</span>
        </div>
      </div>
    </div>
  );
}
