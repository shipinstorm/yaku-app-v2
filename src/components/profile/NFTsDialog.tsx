import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { map, round } from "lodash";

import { EyeOutlined } from "@ant-design/icons";
import Image from "mui-image";
import { IconX } from "@tabler/icons-react";
import { Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";

import MPActionButton from "@/components/MPActionButton";

import { IMAGE_PROXY } from "@/config/config";

import SendAndBurnButton from "./SendAndBurnButton";
import SetAvatarButton from "./SetAvatarButton";

const NFTsDialog = ({
  showItems,
  setShowItems,
  cItem,
  canView = true,
  updateView,
  hideTitle = false,
  cols = 4,
  gap = 4,
  isLoading = false,
  noListing = false,
  showSendAndBurnButton = true,
  chain = "SOL",
}: any) => {
  const innerNav = useNavigate();
  const [show, setShow] = useState<number | boolean>();
  const navigateWithProjectId = async (item: any) => {
    const projectId =
      item.project_id || item.collection_symbol || item.collectionKey;
    const mint = item.mint;
    innerNav(`/explore/collection/${chain}/${projectId}/${mint}`);
  };
  return (
    <Dialog
      open={showItems}
      handler={() => {}}
      placeholder=""
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
      className="bg-[#1f1f23] text-[#d5d9e9] transition-shadow duration-300 ease-in-out shadow-[rgba(0,0,0,0.2)_0px_11px_15px_-7px,rgba(0,0,0,0.14)_0px_24px_38px_3px,rgba(0,0,0,0.12)_0px_9px_46px_8px] bg-none rounded-lg m-8 relative overflow-y-auto flex flex-col max-h-[calc(100%-64px)] !max-w-[1536px] py-3 !w-full"
    >
      {!hideTitle ? (
        <DialogHeader
          className="flex gap-1 items-center justify-between text-[#e4e7ec]"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <div className="flex gap-1 items-center">
            <img
              src={`${IMAGE_PROXY}${cItem.img}`}
              className="w-10 h-10 bg-transparent rounded-full"
              alt=""
            />{" "}
            {cItem.title} ({cItem.count})
          </div>
          <button
            className="button-small items-center p-0 relative flex justify-center flex-shrink-0 text-xl leading-none overflow-hidden select-none bg-[#d5d9e9]"
            onClick={() => setShowItems(false)}
          >
            <IconX className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </DialogHeader>
      ) : (
        <DialogHeader
          className="flex gap-1 items-center justify-end text-[#e4e7ec]"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <button
            className="button-small items-center p-0 relative flex justify-center flex-shrink-0 text-xl leading-none overflow-hidden select-none bg-[#d5d9e9]"
            onClick={() => setShowItems(false)}
          >
            <IconX className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </DialogHeader>
      )}
      <DialogBody
        placeholder=""
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        {!isLoading ? (
          <ul className="grid grid-cols-4 p-0 gap-1 w-full overflow-y-hidden">
            {map(cItem.items, (item: any, idx: number) => (
              <li
                key={`${item.image}+${idx}`}
                className="relative flex flex-col rounded-2xl h-auto col-span-1 row-span-1"
                onMouseEnter={() => setShow(idx)}
                onMouseLeave={() => setShow(false)}
              >
                {!item.video && (
                  <Image
                    src={`${IMAGE_PROXY}${item.image}`}
                    alt={item.title}
                    className="rounded-2xl w-full h-full flex items-center justify-center"
                  />
                )}
                {item.video && (
                  <div className="aspect-w-1 aspect-h-1 w-full flex min-h-[80px] max-h-[367px]">
                    <video autoPlay loop muted className="w-full">
                      <source src={item.video} />
                    </video>
                  </div>
                )}
                <div
                  className={`absolute bottom-0 left-0 top-0 right-0 ${
                    show !== false && show === idx ? "flex" : "hidden"
                  } justify-center items-center p-8 flex-col gap-2`}
                >
                  {!item.listed && <SetAvatarButton item={item} />}
                  {/* {!noListing && (
                    <MPActionButton
                      price={item.price}
                      owner={item.owner}
                      broker_referral_address={item.broker_referral_address}
                      marketplace_program_id={item.marketplace_program_id}
                      tokenMint={item.mint}
                      name={item.name}
                      listed={item.listStatus === "listed" || item.listed}
                      staked={item.staked}
                      floor_price={cItem.floor_price || item.floor_price}
                      noListing
                      updateView={updateView}
                    />
                  )} */}
                  {showSendAndBurnButton && !item.listed && !item.staked && (
                    <SendAndBurnButton item={item} updateView={updateView} />
                  )}
                </div>
                {item.staked && (
                  <div className="relative">
                    <span className="absolute top-4 left-4 bg-opacity-70 bg-black rounded px-2 py-1">
                      Staked
                    </span>
                  </div>
                )}
                {!item.staked &&
                  (item.listStatus === "listed" || item.listed) && (
                    <div className="relative">
                      <span className="absolute top-4 left-4 bg-opacity-70 bg-black rounded px-2 py-1">
                        Listed
                      </span>
                    </div>
                  )}
                {item.price && (
                  <div className="relative">
                    <span className="absolute top-4 right-4 bg-opacity-70 bg-black rounded px-2 py-1">
                      {!(item.listStatus === "listed" || item.listed)
                        ? "FP: "
                        : ""}
                      {round(item.price, 3).toLocaleString()}◎
                    </span>
                  </div>
                )}
                {cItem.floor_price !== 0 &&
                  !item.price &&
                  item.listStatus !== "listed" && (
                    <div className="relative">
                      <span className="absolute top-4 right-4 bg-opacity-70 bg-black rounded px-2 py-1">
                        {!(item.listStatus === "listed" || item.listed)
                          ? "FP: "
                          : ""}
                        {round(cItem.floor_price, 3).toLocaleString()}◎
                      </span>
                    </div>
                  )}
                {canView && (
                  <div className="absolute left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center">
                    <div className="flex-grow p-3 pl-4 text-white overflow-hidden">
                      <div className="text-base leading-6 overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.name}
                      </div>
                    </div>
                    <div>
                      <button
                        className="inline-flex items-center justify-center relative box-border bg-transparent outline-none border-none m-0 cursor-pointer user-select-none align-middle text-center text-white flex-shrink-0 rounded-full overflow-visible transition-bg duration-150 ease-in-out p-1 text-lg"
                        onClick={() => navigateWithProjectId(item)}
                      >
                        <EyeOutlined />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className={`grid gap-${gap}`}>
            {map(Array(cols * 2), (col) => (
              <div key={col} className={`w-${12 / cols}`}>
                <div className="aspect-w-1 aspect-h-1 min-w-[80px] min-h-[80px]">
                  <div className="animate-pulse bg-gray-300 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogBody>
    </Dialog>
  );
};

export default NFTsDialog;
