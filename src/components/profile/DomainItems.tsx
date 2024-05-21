/* eslint-disable react-hooks/exhaustive-deps */
import CopyAddress from "@/components/buttons/CopyAddress";

import { DomainByWallet } from "@/utils/bonfida";

const DomainItems = (props: {
  domains: DomainByWallet[];
  isLoading: boolean;
}) => {
  const { domains, isLoading } = props;
  return (
    <ul>
      <li className="flex justify-between gap-1">
        <p className="w-[1/3] font-bold">Domain Name</p>
        <p className="w-[1/3] text-center font-bold">Domain Address</p>
        <p className="w-[2/5] text-center font-bold">Domain Class Address</p>
      </li>
      {!isLoading
        ? domains.map((item, key) => (
            <li
              className="flex justify-between gap-1 hover:bg-purple-100 hover:bg-opacity-5"
              key={key}
            >
              <p className="w-[1/3] break-words">{item.name}</p>
              <p className="w-[1/3] flex justify-center">
                <CopyAddress address={item.address} length={5} />
              </p>
              <p className="w-[2/5] flex justify-center">
                <CopyAddress address={item.class} length={5} />
              </p>
            </li>
          ))
        : [1, 2, 3, 4].map((item, key) => (
            <li
              className="flex justify-between gap-1 hover:bg-[#d329ff15]"
              key={key}
            >
              <div className="w-[30%] h-4 rounded"></div>
              <div className="w-[30%] h-4 rounded"></div>
              <div className="w-[40%] h-4 rounded"></div>
            </li>
          ))}
    </ul>
  );
};
export default DomainItems;
