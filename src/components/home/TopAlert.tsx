const TopAlert = ({ severity = "warning", description, buttons }: any) => (
  <div
    className={`bg-${getColor(severity)} text-white px-4 py-3 rounded-lg`}
    role="alert"
  >
    <div className="flex justify-between items-center gap-2">
      <p className="text-sm">{description}</p>
      {buttons}
    </div>
  </div>
);
export default TopAlert;
