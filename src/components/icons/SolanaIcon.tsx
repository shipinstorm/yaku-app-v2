import Image from "next/image";

const SolanaIcon = ({ cssClass = "h-7 w-6 mr-1 rounded-full" }: any) => (
  <Image
    fill
    className={cssClass}
    src="/images/blockchains/solana-icon.svg"
    alt="Solana"
  />
);

export default SolanaIcon;
