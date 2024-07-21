import { formatDate } from "../utils/util";
import DOMPurify from "dompurify";
import { PostItemProps } from "./PostItem";

const CORS_PROXY = "https://corsproxy.io";

export default function EmbedPostItem({
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
    postURL,
    profileURL,
  } = post;

  return (
    <div className="toot" ref={refInstance}>
      <div className="profile">
        <a href={profileURL} className="avatar">
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
        </a>
        <span className="display-name">
          <a href={profileURL}>
            <bdi>
              <strong
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(displayName),
                }}
              ></strong>
            </bdi>
          </a>
          <a href={profileURL} className="username">
            {username}
          </a>
          {/** Replace with :has when Firefox starts supporting it */}
          {options.interactions === "feed" && (
            <a href={postURL} className="datetime">
              {formatDate(date)}
            </a>
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
