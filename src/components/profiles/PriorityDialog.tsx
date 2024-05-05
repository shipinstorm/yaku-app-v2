/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import MainCard from "@/components/MainCard";
import { usePriority } from "@/contexts/SolPriorityContext";
import { useState } from "react";

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
      <DialogContent>
        <DialogTitle>
          <Typography fontSize={18} fontWeight={700}>
            Solana Priority Fee
          </Typography>
          <Typography
            fontSize={14}
            sx={{ display: "flex", gap: 1, alignItems: "center" }}
          >
            Set up your preferable priority fee to boost the transaction. (High
            priority fee only make the transaction proceed with a higher
            priority, but no guarantee on successfulness. The Priority options
            may be lower than market rate, please feel free to adjust your
            priority rate base on network congestion rate.)
          </Typography>
        </DialogTitle>
        <MainCard border={false} sx={{ p: 1, backgroundColor: "#09080d" }}>
          <ToggleButtonGroup
            color="secondary"
            size="small"
            sx={{ mb: 4 }}
            value={priorityOption}
            exclusive
            onChange={handleChange}
            aria-label="Priority Option"
          >
            <ToggleButton value="fast">Fast</ToggleButton>
            <ToggleButton value="smooth">Smooth</ToggleButton>
            <ToggleButton value="ultrasonic">Ultrasonic</ToggleButton>
          </ToggleButtonGroup>
          <TextField
            fullWidth
            sx={{ ml: 0, mb: 2 }}
            label="Priority Rate"
            value={priorityRate}
            onChange={(e: any) => setPriorityRate(e.target.value)}
          />

          <Typography
            fontSize={12}
            sx={{ display: "flex", gap: 1, alignItems: "center" }}
          >
            Priority rate is in microLamports, 1 microLamport equals to
            0.00000001 Lamports. 1 Lamport equals to 0.00000001 Sol.
          </Typography>
        </MainCard>
      </DialogContent>
    </Dialog>
  );
};

export default PriorityDialog;
