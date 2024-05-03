// material-ui
import Skeleton from '@mui/material/Skeleton';

const ImageTextSkeleton = ({ ...others }) => (
    <div className="flex items-center gap-2 rounded-2xl w-full p-2 cursor-pointer duration-100 bg-transparent">
        <div className="avatar-img w-10 h-10 flex-shrink-0">
            <Skeleton variant="rounded" width="100%" height="100%" />
        </div>
        <Skeleton variant="rectangular" width="100%" height={24} {...others} animation="wave" />
    </div>
);

export default ImageTextSkeleton;
