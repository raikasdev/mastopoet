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

export default function PostItem({ post }: { post: Post }) {
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
    <div className="toot">
      <div className="profile">
        <div className="avatar">
          <img src={avatarUrl} alt={displayName} />
        </div>
        <span className="display-name">
          <bdi>
            <strong>{displayName}</strong>
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
                src={attachment.url}
                className="attachment"
                style={{ aspectRatio: `${attachment.aspectRatio} / 1` }}
              />
            );
          if (attachment.type === "gifv")
            return (
              <video
                src={attachment.url}
                className="attachment"
                style={{ aspectRatio: `${attachment.aspectRatio} / 1` }}
                muted
                playsInline
                controls={false}
              />
            );
          return <></>;
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
