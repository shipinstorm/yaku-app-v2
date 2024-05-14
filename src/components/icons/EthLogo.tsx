import Image from "next/image";

const EthLogo = ({ size = 24 }: { size?: number }) => (
  <Image
    src="/images/blockchains/ethereum-icon.svg"
    alt="Ethereum"
    width={size}
    height={size}
  />
);

export default EthLogo;
