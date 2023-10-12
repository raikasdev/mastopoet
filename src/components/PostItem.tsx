import { ForwardedRef } from "react";
import { formatDate } from "../utils/util";
import { InteractionsPreference, Options } from "../config";
import DOMPurify from "dompurify";

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
  poll?: {
    title: string;
    votesCount: number;
    percentage: number;
  }[];
  reactions?: Reactions[];
}

export interface Reactions {
  value?: string;
  url?: string;
  count: number;
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
  onImageLoadError: (host: string) => void;
  options: Options;
}

const CORS_PROXY = "https://corsproxy.io";

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
            onError={({ currentTarget }) => {
              if (currentTarget.src.startsWith(CORS_PROXY)) {
                onImageLoadError(new URL(avatarUrl).host);
              } else {
                // Try CORS proxy
                currentTarget.src = `${CORS_PROXY}?${encodeURIComponent(
                  avatarUrl,
                )}`;
              }
            }}
          />
        </div>
        <span className="display-name">
          <bdi>
            <strong
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(displayName),
              }}
            ></strong>
          </bdi>
          <span className="username">{username}</span>
          {/** Replace with :has when Firefox starts supporting it */}
          {options.interactions === "feed" && (
            <span className="datetime">{formatDate(date)}</span>
          )}
        </span>
      </div>
      <div
        className="content"
        id="content"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
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
                    onError={({ currentTarget }) => {
                      if (currentTarget.src.startsWith(CORS_PROXY)) {
                        onImageLoadError(new URL(avatarUrl).host);
                      } else {
                        // Try CORS proxy
                        currentTarget.src = `${CORS_PROXY}?${encodeURIComponent(
                          avatarUrl,
                        )}`;
                      }
                    }}
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
                    onError={({ currentTarget }) => {
                      if (currentTarget.src.startsWith(CORS_PROXY)) {
                        onImageLoadError(new URL(avatarUrl).host);
                      } else {
                        // Try CORS proxy
                        currentTarget.src = `${CORS_PROXY}?${encodeURIComponent(
                          avatarUrl,
                        )}`;
                      }
                    }}
                  />
                );
              return <div key={attachment.url}></div>;
            })}
          </div>
        </div>
      )}
      {post.poll && (
        <div className="poll">
          {post.poll.map((option) => (
            <div className="poll-option">
              <p className="option-title">
                <strong>{option.percentage}%</strong> {option.title}
              </p>
              <div
                className={`option-bar ${
                  post.poll
                    ?.map((i) => i.votesCount)
                    .sort((a, b) => b - a)[0] === option.votesCount
                    ? "winner"
                    : ""
                }`}
                style={{ width: `${option.percentage}% ` }}
              />
            </div>
          ))}
        </div>
      )}
      {post.reactions && (
        <div className="action-bar">
          {post.reactions?.map((val, index) => (
            <div key={index} className="emoji-reaction">
              {val.value && (
                <span className="emoji-reaction-unicode">{val.value}</span>
              )}
              {val.url && (
                <img className="emoji-reaction-custom" src={val.url} />
              )}
              <span className="emoji-reaction-count">{val.count}</span>
            </div>
          ))}
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
        {!post.reactions && (
          <div className="action">
            <span className="icon-star" />
            <span className="action-counter">{favourites}</span>
            <span className="action-label">Favourites</span>
          </div>
        )}
      </div>
    </div>
  );
}
