// types
import { GenericCardProps } from "@/types";

// =============================|| REVENUE CARD ||============================= //

interface RevenueCardProps extends GenericCardProps {
  primary: any;
  secondary: string;
  content: any;
  iconPrimary: any;
  color: any;
}

const RevenueCard = ({
  primary,
  secondary,
  content,
  iconPrimary,
  color,
}: RevenueCardProps) => {
  const primaryIcon = iconPrimary ? (
    <img src={iconPrimary} className="w-8 h-8 sm:w-12 sm:h-12" />
  ) : null;

  return (
    <div
      className="transition-shadow duration-300 ease-in-out shadow-none rounded-lg overflow-hidden relative text-white"
      style={{ background: color }}
    >
      <div className="p-6">
        <p className="m-0 leading-6 font-normal font-inter text-sm text-white absolute right-3 top-[calc(50% - 16px)] sm:top-[calc(50% - 24px)] transform -translate-y-1/2">
          {primaryIcon}
        </p>
        <div className="box-border flex sm:flex-col flex-wrap mt-n2 ml-n2 w-full">
          <div className="box-border m-0 flex-grow-0 flex-shrink-0 flex-basis-full pt-2 pl-2">
            <h5 className="m-0 text-base font-medium font-inter leading-5 text-inherit">
              {primary}
            </h5>
          </div>
          <div className="box-border m-0 flex-grow-0 flex-shrink-0 flex-basis-full pt-2 pl-2">
            <h3 className="m-0 text-lg font-semibold font-inter leading-tight text-inherit">
              {secondary}
            </h3>
          </div>
          <div className="box-border m-0 flex-grow-0 flex-shrink-0 flex-basis-full pt-2 pl-2">
            <h6 className="m-0 text-xs font-normal font-inter leading-tight text-inherit">
              {content}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueCard;
