import { find } from "lodash";

const DetailView = ({
  projectStats = [],
  projectId,
  solPrice,
  loading,
}: any) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2 my-1">
        <div className="col-span-1">
          <div className="bg-gray-200 rounded animate-pulse h-4"></div>
        </div>
        <div className="col-span-1">
          <div className="bg-gray-200 rounded animate-pulse h-4"></div>
        </div>
      </div>
    );
  }
  const {
    volume_1day = 0,
    volume_1day_change = 0,
    floor_price = 0,
    floor_price_1day_change = 0,
    average_price = 0,
    average_price_1day_change = 0,
    num_of_token_listed = 0,
    project: { supply },
  } = find(
    projectStats || [],
    ({ project_id }: any) => project_id === projectId
  ) || { project: { supply: 0 } };

  return (
    <>
      <div className="grid grid-cols-1 gap-y-1 my-1">
        <div className="flex justify-between items-center p-1">
          <div className="flex flex-col items-center">
            <p className="text-terciary font-bold text-sm">Listed</p>
            <p className="text-lg font-bold">
              {num_of_token_listed} / {supply}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailView;
