import Image from "next/image";

const MetamaskLogo = ({ size = 24 }: { size?: number }) => (
  <Image
    src="/images/icons/metamask.svg"
    alt="Metamask"
    width={size}
    height={size}
  />
);

export default MetamaskLogo;
