const WalletCell = ({
  label,
  title,
  icon,
  value,
  asCol = false,
}: {
  label?: any;
  title?: string;
  icon?: any;
  value: any;
  asCol?: boolean;
}) => (
  <div
    className={`bg-elevation1 w-full flex items-center justify-between rounded-2xl shadow-sm ${
      asCol ? "flex-col grid-col-1 p-2" : "p-4"
    }`}
  >
    <h4
      className={asCol ? "text-xs text-terciary" : ""}
      style={{ whiteSpace: "nowrap" }}
    >
      {title || label}
    </h4>
    {icon && icon}
    <p
      className={asCol ? `text-xl font-bold` : ""}
      style={{ whiteSpace: "nowrap" }}
    >
      {value}
    </p>
  </div>
);

export default WalletCell;
