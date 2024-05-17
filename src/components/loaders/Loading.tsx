export default function Loading(props: { size?: number }) {
  const { size = 400 } = props;
  return (
    <div>
      <img
        src="/images/x-loader.gif"
        alt="loader"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}
