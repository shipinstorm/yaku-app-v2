import { useState } from "react";

/* eslint-disable react-hooks/exhaustive-deps */
import { Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";

import MainCard from "@/components/MainCard";

import { usePriority } from "@/contexts/SolPriorityContext";

const PriorityDialog = ({ open, onClose }: any) => {
  const { priorityRate, setPriorityRate } = usePriority();
  const [priorityOption, setPriorityOption] = useState("fast");
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: string
  ) => {
    if (!newValue) return;
    setPriorityOption(newValue);
    switch (newValue) {
      case "fast":
        setPriorityRate(1000);
        break;
      case "smooth":
        setPriorityRate(10000);
        break;
      case "ultrasonic":
        setPriorityRate(100000);
        break;
    }
  };
  return (
    <Dialog
      sx={{
        width: "100%",
        p: 2,
      }}
      open={open}
      onClose={onClose}
    >
      <DialogHeader>
        <p className="text-xl font-bold">Solana Priority Fee</p>
        <p className="text-base flex items-center gap-1">
          Set up your preferable priority fee to boost the transaction. (High
          priority fee only make the transaction proceed with a higher priority,
          but no guarantee on successfulness. The Priority options may be lower
          than market rate, please feel free to adjust your priority rate base
          on network congestion rate.)
        </p>
      </DialogHeader>
      <DialogBody>
        <MainCard border={false} sx={{ p: 1, backgroundColor: "#09080d" }}>
          <div className="mb-4">
            <div className="flex" role="group" aria-label="Priority Option">
              <button
                className="border border-gray-300 rounded-l px-4 py-1 text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                onClick={(e) => handleChange(e, "fast")}
                aria-pressed={priorityOption === "fast" ? "true" : "false"}
              >
                Fast
              </button>
              <button
                className="border border-gray-300 px-4 py-1 text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                onClick={(e) => handleChange(e, "smooth")}
                aria-pressed={priorityOption === "smooth" ? "true" : "false"}
              >
                Smooth
              </button>
              <button
                className="border border-gray-300 rounded-r px-4 py-1 text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                onClick={(e) => handleChange(e, "ultrasonic")}
                aria-pressed={
                  priorityOption === "ultrasonic" ? "true" : "false"
                }
              >
                Ultrasonic
              </button>
            </div>
          </div>
          <input
            type="text"
            className="w-full ml-0 mb-2 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            placeholder="Priority Rate"
            value={priorityRate}
            onChange={(e) => setPriorityRate(e.target.value)}
          />

          <p className="text-xs flex gap-1 items-center">
            Priority rate is in microLamports, 1 microLamport equals to
            0.00000001 Lamports. 1 Lamport equals to 0.00000001 Sol.
          </p>
        </MainCard>
      </DialogBody>
    </Dialog>
  );
};

export default PriorityDialog;
