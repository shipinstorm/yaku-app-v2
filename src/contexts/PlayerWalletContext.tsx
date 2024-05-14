/* eslint-disable react-hooks/exhaustive-deps */
import {
  FC,
  ReactNode,
  useState,
  createContext,
  useContext,
  useEffect,
} from "react";

import PlayerSection from "@/components/profiles/PlayerSection";

import { useRequests } from "@/hooks/useRequests";

interface PlayerWalletContextType {
  logout: () => void;
  showPlayerView: Boolean;
  setShowPlayerView: React.Dispatch<React.SetStateAction<boolean>>;
  player: any;
  setPlayer: React.Dispatch<React.SetStateAction<any>>;
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  playerAddress: string;
  setPlayerAddress: React.Dispatch<React.SetStateAction<string>>;
}

const PlayerWalletContext = createContext<PlayerWalletContextType | null>(null);

export const PlayerWalletProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState("");
  const [player, setPlayer] = useState({});
  const [playerAddress, setPlayerAddress] = useState("");
  const [showPlayerView, setShowPlayerView] = useState(false);

  const { getPlayerInfo } = useRequests();

  const logout = () => {
    setPlayer({});
    setAccessToken("");
    setPlayerAddress("");
    localStorage.removeItem("blockus-lemonade");
    localStorage.clear();
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("blockus-lemonade");
      if (token) {
        const getPlayerInfoResponse = await getPlayerInfo(token);
        const player = getPlayerInfoResponse.data;

        let playerAddress = "";
        player.wallets.map((wallet: any) => {
          if (wallet.id.includes(player.id)) playerAddress = wallet.address;
        });

        setPlayer(player);
        setAccessToken(token);
        setPlayerAddress(playerAddress);
      }
    };

    fetchData();
  }, []);

  return (
    <PlayerWalletContext.Provider
      value={{
        logout,
        showPlayerView,
        setShowPlayerView,
        player,
        setPlayer,
        accessToken,
        setAccessToken,
        playerAddress,
        setPlayerAddress,
      }}
    >
      {children}
      <PlayerSection
        open={showPlayerView}
        onClose={() => setShowPlayerView(false)}
        setPlayer={(player: any) => setPlayer(player)}
        setAccessToken={(accessToken: string) => setAccessToken(accessToken)}
        setPlayerAddress={(address: string) => setPlayerAddress(address)}
      />
    </PlayerWalletContext.Provider>
  );
};

export const usePlayerView = () => {
  const context = useContext(PlayerWalletContext);
  return context as PlayerWalletContextType;
};

export default PlayerWalletContext;
