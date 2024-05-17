import { useYakuUSDCPrice } from "@/contexts/JupitarContext";

const YakuBuyLink = () => {
  const yakuUSDCPrice = useYakuUSDCPrice() || 0;

  return (
    <div className="whitespace-pre flex gap-4 items-center z-10">
      <a
        href="https://jup.ag/swap/SOL-YAKU"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        <span className="text-primary text-base">
          BUY YAKU ${yakuUSDCPrice.toFixed(4)}
          {/* BUY YAKU ${yakuUSDCPrice.toFixed(4)} <CallMade sx={{ width: 16 }} /> */}
        </span>
      </a>

      <a
        href="https://magiceden.io/creators/yaku_corp"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        <span className="text-primary text-base">
          MARKET
          {/* MARKET <CallMade sx={{ width: 16 }} /> */}
        </span>
      </a>
    </div>
  );
};

export default YakuBuyLink;
