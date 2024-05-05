const ReactTwitterFollowButton = ({
  twitterAccount,
  showName = true,
}: {
  twitterAccount: string;
  showName?: boolean;
}) => (
  <a
    href={`https://twitter.com/${twitterAccount}?ref_src=yakucorp`}
    target="_blank"
    rel="noreferrer"
    className="twitter-follow-button"
  >
    <i />
    {showName && (
      <span className="label" id="l">
        Follow <b>@{twitterAccount}</b>
      </span>
    )}
  </a>
);

export default ReactTwitterFollowButton;
