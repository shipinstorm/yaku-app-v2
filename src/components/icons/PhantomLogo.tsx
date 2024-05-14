import Image from "next/image";

const PhantomLogo = ({ size = 24 }: { size?: string | number }) => (
  <Image src="/images/icons/phantom.svg" alt="Metamask" width={size} />
);

export default PhantomLogo;
