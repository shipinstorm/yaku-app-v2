import { FC } from "react";

interface EmptyBoxProps {
  icon: string;
  title: string;
  detail?: string;
}

const EmptyBox: FC<EmptyBoxProps> = ({ icon, title, detail }) => (
  <div className="empty-box d-flex flex-column justify-content-center align-items-center text-center">
    <div className="icon-box">
      <img src={icon} width={48} height={48} alt="wallet" />
    </div>
    <h3 className="secondary-title">{title}</h3>
    {detail && <p className="detail-text">{detail}</p>}
  </div>
);

export default EmptyBox;
