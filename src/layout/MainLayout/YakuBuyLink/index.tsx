import { CallMade } from "@mui/icons-material";
import { Box, Link, Typography } from "@mui/material";
import { useYakuUSDCPrice } from "@/contexts/JupitarContext";

const YakuBuyLink = () => {
  const yakuUSDCPrice = useYakuUSDCPrice() || 0;

  return (
    <Box sx={{ whiteSpace: "pre" }} className="flex gap-4 items-center z-10">
      <Link href="https://jup.ag/swap/SOL-YAKU" target="_blank">
        <Typography
          component="span"
          color="primary"
          fontSize={14}
          className="text-primary"
        >
          BUY YAKU ${yakuUSDCPrice.toFixed(4)} <CallMade sx={{ width: 16 }} />
        </Typography>
      </Link>

      <Link href="https://magiceden.io/creators/yaku_corp" target="_blank">
        <Typography
          component="span"
          color="primary"
          fontSize={14}
          className="text-primary"
        >
          MARKET <CallMade sx={{ width: 16 }} />
        </Typography>
      </Link>
    </Box>
  );
};

export default YakuBuyLink;
