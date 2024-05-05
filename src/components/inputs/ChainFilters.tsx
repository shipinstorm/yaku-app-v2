import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

import EthereumLogo from "assets/images/blockchains/ethereum-icon.svg";
import SolanaLogo from "assets/images/blockchains/solana-icon.svg";
import { map } from "lodash";

const ChainButton = styled(Button)({
  borderRadius: "40px",
  px: 2,
});

interface ChainLogos {
  eth: string;
  sol: string;
}

interface ChainFilterProps {
  onFilterChange: (value?: string) => void;
}

function ChainFilters({ onFilterChange }: ChainFilterProps) {
  const [selected, setSelected] = useState("all");
  const createChainIcon = (chain: string) => {
    const chainLogos: ChainLogos = {
      eth: EthereumLogo,
      sol: SolanaLogo,
    };
    const chainLogo = chainLogos[chain as keyof ChainLogos];

    return (
      <Avatar
        src={chainLogo}
        sx={{
          width: 16,
          height: 16,
          objectFit: "contain",
          ml: 1,
        }}
        color="inherit"
      />
    );
  };

  const onClick = (value: string) => {
    setSelected(value);
    if (value === "all") {
      onFilterChange();
    } else {
      onFilterChange(value);
    }
  };

  const chains = [
    {
      label: "All",
      id: "all",
      icon: undefined,
    },
    {
      label: "Solana",
      id: "sol",
      icon: createChainIcon("sol"),
    },
    {
      label: "Ethereum",
      id: "eth",
      icon: createChainIcon("eth"),
    },
  ];

  return (
    <Stack
      direction="row"
      sx={{
        borderColor: "#33273f",
        borderWidth: "0.5px",
        borderStyle: "solid",
        borderRadius: "40px",
      }}
    >
      {map(chains, ({ label, id, icon }) => (
        <ChainButton
          variant={selected === id ? "contained" : "text"}
          onClick={() => onClick(id)}
          color="secondary"
          startIcon={icon}
        >
          {label}
        </ChainButton>
      ))}
    </Stack>
  );
}

export default ChainFilters;
