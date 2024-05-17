import { FC, ReactNode } from "react";

// project imports
import { useMeta } from "@/contexts/meta/meta";

// styles
const LoaderWrapper = ({ children, ...props }: any) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
      {...props}
    >
      {children}
    </div>
  );
};

interface LoaderProviderProps {
  children: ReactNode;
}

// ==============================|| BOX LOADER ||============================== //

export const LoaderProvider: FC<LoaderProviderProps> = ({ children }) => {
  const { isLoading } = useMeta();

  return (
    <>
      {isLoading && <BoxLoader />}
      {children}
    </>
  );
};

const BoxLoader = () => (
  <LoaderWrapper>
    <img src="/images/x-loader.gif" alt="loader" />
  </LoaderWrapper>
);

export default BoxLoader;
