import { Skeleton } from "@mui/material";

const ActivityCardSkeleton = ({ id }: any) => (
  <div
    key={id}
    className="activity-item bg-elevation2 mt-4 rounded-2xl shadow-sm"
  >
    <div className="flex items-center">
      <Skeleton variant="rounded" width={48} height={48} />
      <div className="ml-4">
        <Skeleton variant="text" width={100} height={20} />
        <Skeleton variant="text" width={100} height={20} />
      </div>
    </div>

    <div className="flex items-center justify-between mt-3 pt-2 rounded-xl shadow-none">
      <Skeleton variant="text" width={50} height={20} />
      <Skeleton variant="text" width={50} height={20} />
    </div>
  </div>
);

export default ActivityCardSkeleton;
