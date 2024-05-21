import { useWallet } from "@solana/wallet-adapter-react";

import { useMeta } from "@/contexts/meta/meta";

import { mutations } from "@/graphql/graphql";

import useAuthMutation from "@/hooks/useAuthMutation";
import { useToasts } from "@/hooks/useToasts";
import useAuth from "@/hooks/useAuth";

const SetAvatarButton = ({ item }: any) => {
  const { startLoading, stopLoading } = useMeta();
  const wallet = useWallet();
  const { showSuccessToast, showTxErrorToast } = useToasts();
  const { setUserData, user } = useAuth();

  const [setAvatar] = useAuthMutation(mutations.SET_AVATAR);

  const setAsAvatar = async () => {
    if (item.image) {
      startLoading();
      try {
        await setAvatar({
          variables: {
            imageUrl: item.image,
          },
        });
        setUserData({
          ...user,
          avatar: item.image,
        });
        showSuccessToast("Successfully set your NFT as avatar.");
      } catch (error: any) {
        showTxErrorToast(error);
      } finally {
        stopLoading();
      }
    }
  };

  return (
    <>
      {item.owner === wallet?.publicKey?.toBase58() && !item.listed && (
        <button
          className="w-full bg-secondary text-white rounded-full mt-2 py-2"
          onClick={() => setAsAvatar()}
        >
          <p className="text-lg truncate">Set as Avatar</p>
        </button>
      )}
    </>
  );
};

export default SetAvatarButton;
