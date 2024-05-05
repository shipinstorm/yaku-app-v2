/* eslint-disable react-hooks/exhaustive-deps */
import PriorityDialog from "@/components/profiles/PriorityDialog";
import React, { useContext, useState } from "react";

export const TPS_POOL_INTERVAL = 1000 * 60; // 60 sec

export interface SolPriorityContextState {
  priorityRate: number;
  setPriorityRate: React.Dispatch<React.SetStateAction<number>>;
  showPriorityDialog: boolean;
  setShowPriorityDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const SolPriorityContext = React.createContext<SolPriorityContextState | null>(
  null
);

export function SolPriorityProvider({ children = null }: { children: any }) {
  const [priorityRate, setPriorityRate] = useState(100);
  const [showPriorityDialog, setShowPriorityDialog] = useState(false);
  // prettier-ignore
  return (
        <SolPriorityContext.Provider value={{ priorityRate, setPriorityRate, showPriorityDialog, setShowPriorityDialog }}>
            {children}
            <PriorityDialog open={showPriorityDialog} onClose={() => setShowPriorityDialog(false)} />
        </SolPriorityContext.Provider>
    );
}

export const usePriority = () => {
  const context = useContext(SolPriorityContext);
  return context as SolPriorityContextState;
};

export const usePriorityRate = () => {
  const { priorityRate } = usePriority();
  return priorityRate;
};
