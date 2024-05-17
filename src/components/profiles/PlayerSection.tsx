import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Dialog, DialogBody } from "@material-tailwind/react";
import { IconX } from "@tabler/icons-react";

import AuthCardWrapper from "@/components/authentication/AuthCardWrapper";
import AuthFooter from "@/components/cards/AuthFooter";
import Logo from "@/components/icons/Logo";

import useToasts from "@/hooks/useToasts";
import { useRequests } from "@/hooks/useRequests";

import { shortenAddress } from "@/utils/utils";

const PlayerSection = ({
  open,
  onClose,
  setPlayer,
  setAccessToken,
  setPlayerAddress,
}: any) => {
  const [email, setEmail] = useState("");
  const [epicId, setEpicId] = useState("");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (email !== "" && epicId !== "") setDisabled(false);
    else setDisabled(true);
  }, [email, epicId]);

  const { getPlayerInfo, loginWithEpic } = useRequests();

  const { showInfoToast, showErrorToast } = useToasts();

  const handleLoginWithEpic = async () => {
    try {
      const loginWithEpicResponse = await loginWithEpic(epicId, email);
      const accessToken = loginWithEpicResponse.data.accessToken;
      const getPlayerInfoResponse = await getPlayerInfo(accessToken);
      const player = getPlayerInfoResponse.data;

      let playerAddress = "";
      player.wallets.map((wallet: any) => {
        if (wallet.id.includes(player.id)) playerAddress = wallet.address;
      });

      showInfoToast(`Connected to wallet ${shortenAddress(playerAddress)}`);

      setPlayer(player);
      setAccessToken(accessToken);
      setPlayerAddress(playerAddress);

      localStorage.setItem("blockus-lemonade", accessToken);

      onClose();
    } catch (e) {
      showErrorToast("Invalid Email Type");
      console.log(e);
    }
  };

  return (
    <Dialog
      open={open}
      className="w-full p-2 bg-transparent"
      size="sm"
      handler={() => {}}
      placeholder=""
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    >
      <DialogBody
        placeholder=""
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        <div className="bg-transparent min-h-[70vh]">
          <div className="box-border flex flex-col justify-end min-h-[70vh] card">
            <div className="box-border m-0">
              <div className="flex items-center justify-center min-h-[calc(70vh-68px)]">
                <div className="m-1 sm:m-3 mb-0">
                  <AuthCardWrapper className="rounded-3xl">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <div className="flex justify-between w-full">
                        <p className="w-9"></p>
                        <Link to="#">
                          <Logo />
                        </Link>
                        <button
                          className="button-small items-center p-0 relative flex justify-center flex-shrink-0 text-xl leading-none overflow-hidden select-none bg-[#d5d9e9]"
                          onClick={() => onClose()}
                        >
                          <IconX className="h-5 w-5" strokeWidth={1.5} />
                        </button>
                      </div>
                      <div className="flex flex-col gap-4 w-full">
                        <p className="text-[#D8DDF0] text-base text-center">
                          Register / Login Player Account
                        </p>
                        <div className="w-full">
                          <input
                            type="email"
                            className="w-full px-3 py-4 rounded-md text-base"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="w-full">
                          <input
                            className="w-full px-3 py-4 rounded-md text-base"
                            placeholder="EpicId"
                            onChange={(e) => setEpicId(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center justify-center w-full">
                          <button
                            onClick={() => handleLoginWithEpic()}
                            className="py-1 px-4 min-w-16 rounded-sm uppercase cursor-pointer bg-transparent border-[1px] border-[#1976D2] text-[#1976D2] text-center disabled:bg-gray-200 disabled:text-[#00000026] disabled:border-none disabled:cursor-default disabled:pointer-events-none"
                            disabled={disabled}
                          >
                            Connect
                          </button>
                        </div>
                      </div>
                    </div>
                  </AuthCardWrapper>
                </div>
              </div>
            </div>
            <div className="box-border flex-grow-0 flex-shrink-0 flex-basis-full m-6 mt-2">
              <AuthFooter />
            </div>
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default PlayerSection;
