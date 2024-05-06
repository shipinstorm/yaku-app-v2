// project import
import MainCard from "@/components/MainCard";

const CardPlaceholder = () => (
  <MainCard content={false} boxShadow>
    <div className="animate-pulse h-220 w-full bg-gray-300 rounded"></div>
    <div className="p-2">
      <div className="flex flex-wrap -mx-1">
        <div className="w-full">
          <div className="animate-pulse h-8 w-full bg-gray-300 rounded"></div>
        </div>

        <div className="pt-0">
          <div>
            <div className="animate-pulse h-12 w-full bg-gray-300 rounded"></div>
          </div>

          <hr className="my-2" />
        </div>

        <div className="pt-0">
          <div className="animate-pulse h-8 w-full bg-gray-300 rounded"></div>
          <div className="animate-pulse h-8 w-full bg-gray-300 rounded"></div>
        </div>

        <div className="w-full">
          <div>
            <div className="animate-pulse h-12 w-full bg-gray-300 rounded"></div>
          </div>

          <div className="animate-pulse h-8 w-full bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  </MainCard>
);

export default CardPlaceholder;
