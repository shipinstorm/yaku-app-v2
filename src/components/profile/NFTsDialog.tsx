import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { map, round } from "lodash";

import { EyeOutlined } from "@ant-design/icons";
import Image from "mui-image";
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
    >
      {!hideTitle && (
        <DialogHeader
          className="flex gap-1 items-center"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <img
            src="${IMAGE_PROXY}${cItem.img}"
            className="w-full h-full bg-transparent"
            alt=""
          />{" "}
          {cItem.title} ({cItem.count})
        </DialogHeader>
      )}
      <DialogBody
        placeholder=""
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        {!isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 w-full overflow-y-hidden">
            {map(cItem.items, (item: any, idx: number) => (
              <div
                key="${item.image}+${idx}"
                className="relative rounded-lg"
                onMouseEnter={() => setShow(idx)}
                onMouseLeave={() => setShow(false)}
              >
                {!item.video && (
                  <Image
                    src={`${IMAGE_PROXY}${item.image}`}
                    alt={item.title}
                    // style={{
                    //   borderRadius: 16,
                    //   aspectRatio: "1 / 1",
                    //   objectFit: "cover",
                    //   width: "100%",
                    //   height: "auto",
                    //   minHeight: 80,
                    //   maxHeight: 367,
                    // }}
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
                  {!noListing && (
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
                  )}
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
                {cItem.floor_price &&
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
                  <div className="flex justify-between items-center p-2 bg-black bg-opacity-50 text-white">
                    <span className="font-semibold">{item.name}</span>
                    <button
                      className="p-0 text-secondary"
                      onClick={() => navigateWithProjectId(item)}
                    >
                      <EyeOutlined />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
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
