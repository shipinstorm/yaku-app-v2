import Image from "next/image";

const PhantomLogo = ({ size = 24 }: { size?: number }) => (
  <Image
    src="/images/icons/phantom.svg"
    alt="Metamask"
    width={size}
    height={size}
  />
);

export default PhantomLogo;
