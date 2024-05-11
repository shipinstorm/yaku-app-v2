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
}

const PlayerWalletContext = createContext<PlayerWalletContextType | null>(null);

export const PlayerWalletProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState("");
  const [player, setPlayer] = useState({});
  const [showPlayerView, setShowPlayerView] = useState(false);

  const { getPlayerInfo } = useRequests();

  const logout = () => {
    setPlayer({});
    localStorage.removeItem("blockus-lemonade");
    localStorage.clear();
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("blockus-lemonade");
      if (token) {
        const getPlayerInfoResponse = await getPlayerInfo(token);
        setPlayer(getPlayerInfoResponse.data);
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
      }}
    >
      {children}
      <PlayerSection
        open={showPlayerView}
        onClose={() => setShowPlayerView(false)}
        setPlayer={(player: any) => setPlayer(player)}
        setAccessToken={(accessToken: string) => setAccessToken(accessToken)}
      />
    </PlayerWalletContext.Provider>
  );
};

export const usePlayerView = () => {
  const context = useContext(PlayerWalletContext);
  return context as PlayerWalletContextType;
};

export default PlayerWalletContext;
