"use client";
import { useContext } from "react";

import PlayerWalletContext from "@/contexts/PlayerWalletContext";

const useGame = () => {
  const context = useContext(PlayerWalletContext);
  if (!context) throw new Error("context must be inside provider");
  return context;
};

export default useGame;
