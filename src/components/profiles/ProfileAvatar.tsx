import { useDispatch, useSelector } from "@/store";
import { IconMenu2 } from "@tabler/icons-react";
import { openDrawer } from "@/store/slices/menu";

const ProfileAvatar = () => {
  const dispatch = useDispatch();
  const { drawerOpen } = useSelector<any>((state) => state.menu);

  return (
    <div>
      <img
        className="rounded-full overflow-hidden transition duration-200 ease-in-out cursor-pointer"
        alt="Avatar"
        onClick={() => dispatch(openDrawer(!drawerOpen))}
      />
      <IconMenu2 stroke={1.5} size="1.3rem" />
    </div>
  );
};

export default ProfileAvatar;
