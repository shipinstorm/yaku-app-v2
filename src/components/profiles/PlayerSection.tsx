import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Button,
  Dialog,
  Grid,
  TextField,
  Avatar,
  DialogContent,
} from "@mui/material";

import { IconX } from "@tabler/icons-react";

import AuthWrapper from "@/components/authentication/AuthWrapper";
import AuthCardWrapper from "@/components/authentication/AuthCardWrapper";
import AuthFooter from "@/components/cards/AuthFooter";
import Logo from "@/components/icons/Logo";

import useToasts from "@/hooks/useToasts";
import { useRequests } from "@/hooks/useRequests";

import { shortenAddress } from "@/utils/utils";

const PlayerSection = ({ open, onClose, setPlayer, setAccessToken, setPlayerAddress }: any) => {
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
      sx={{
        width: "100%",
        p: 2,
        background: "transparent",
        "& .MuiPaper-root": {
          background: "transparent",
        },
      }}
      open={open}
      onClose={onClose}
    >
      <DialogContent>
        <AuthWrapper>
          <div className="box-border flex flex-col justify-end min-h-[70vh] card">
            <div className="box-border m-0">
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={{ minHeight: "calc(70vh - 68px)" }}
              >
                <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                  <AuthCardWrapper className="rounded-3xl">
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      justifyContent="center"
                      gap={2}
                    >
                      <Grid item className="flex justify-between w-full">
                        <p className="w-9" />
                        <Link to="#">
                          <Logo />
                        </Link>
                        <Avatar
                          className="button-small items-center p-0"
                          color="inherit"
                          aria-haspopup="true"
                          onClick={() => onClose()}
                        >
                          <IconX stroke={1.5} size="1.3rem" />
                        </Avatar>
                      </Grid>
                      <p className="text-[#D8DDF0] text-base">
                        Register / Login Player Account
                      </p>
                      <Grid container gap={2}>
                        <Grid item xs={12}>
                          <input
                            type="email"
                            className="w-full px-3 py-4 rounded-md text-base"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <input
                            className="w-full px-3 py-4 rounded-md text-base"
                            placeholder="EpicId"
                            onChange={(e) => setEpicId(e.target.value)}
                          />
                        </Grid>
                        <div className="flex items-center justify-center w-full">
                          <Button
                            variant="outlined"
                            onClick={() => handleLoginWithEpic()}
                            className="text-center disabled:bg-gray-200"
                            disabled={disabled}
                          >
                            Connect
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                  </AuthCardWrapper>
                </Grid>
              </Grid>
            </div>
            <div className="box-border flex-grow-0 flex-shrink-0 flex-basis-full m-6 mt-2">
              <AuthFooter />
            </div>
          </div>
        </AuthWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerSection;
