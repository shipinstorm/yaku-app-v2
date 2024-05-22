/* eslint-disable jsx-a11y/media-has-caption */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { filter, map, round } from "lodash";

import { EyeOutlined } from "@ant-design/icons";

import MPActionButton from "@/components/MPActionButton";

import { IMAGE_PROXY } from "@/config/config";

import SetAvatarButton from "./SetAvatarButton";
import NFTsDialog from "./NFTsDialog";
import SendAndBurnButton from "./SendAndBurnButton";

const TitlebarImageList = ({
  items,
  title,
  icon,
  navigate,
  updateView,
  showActionButton,
  showAvatarButton,
  showSendAndBurnButton,
  showSubItems,
  chain = "SOL",
}: any) => {
  const innerNav = useNavigate();
  const [show, setShow] = useState<number | boolean>();
  const [showItems, setShowItems] = useState<boolean>(false);
  const [cItem, setCItem] = useState<any>({});
  const showCollectionItemsDialog = (item: any) => {
    setCItem(item);
    setShowItems(true);
  };

  const navigateWithProjectId = async (item: any) => {
    if (item.project_id) {
      innerNav(`/explore/collection/${chain}/${item.project_id}/${item.mint}`);
    } else if (item.collection_symbol) {
      innerNav(
        `/explore/collection/${chain}/${item.collection_symbol}/${item.mint}`
      );
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 w-full">
      <div className="col-span-4">
        <div
          className="box-border list-none text-[#d8ddf0] sticky top-0 z-10 bg-[#1f1f23] rounded-lg my-2 px-6 text-lg font-bold flex gap-1 items-center"
          style={{ lineHeight: "48px" }}
        >
          {icon || <></>} {items.length} {title}
        </div>
      </div>
      {map(
        filter(items, ({ img }) => !!img),
        (item, idx) => (
          <div
            key={`${item.img}+${idx}`}
            className="relative cursor-pointer"
            onMouseEnter={() => setShow(idx)}
            onMouseLeave={() => setShow(false)}
            onClick={() => showSubItems && showCollectionItemsDialog(item)}
          >
            {!item.video && (
              <img
                src={`${IMAGE_PROXY}${item.img}`}
                srcSet={`${IMAGE_PROXY}${item.img}`}
                alt={item.title}
                className="rounded-2xl min-h-[80px] max-h-[367px] w-full"
                loading="lazy"
              />
            )}
            {item.video && (
              <div className="aspect-w-1 aspect-h-1 w-full flex min-h-[80px] max-h-[367px]">
                <video
                  autoPlay
                  loop
                  muted
                  // style={{ width: "100%" }}
                >
                  <source src={item.video} />
                </video>
              </div>
            )}
            {showActionButton && (
              <div
                className={`absolute bottom-0 left-0 top-0 right-0 ${
                  show !== false && show === idx ? "flex" : "hidden"
                } justify-center items-center p-6 flex-col gap-2`}
              >
                {showAvatarButton && !item.listed && (
                  <SetAvatarButton item={item} />
                )}
                <MPActionButton
                  price={item.price}
                  owner={item.owner}
                  broker_referral_address={item.broker_referral_address}
                  marketplace_program_id={item.marketplace_program_id}
                  tokenMint={item.mint}
                  name={item.name}
                  listed={item.listed}
                  staked={item.staked}
                  floor_price={item.floor_price}
                  noListing
                  updateView={updateView}
                />
                {showSendAndBurnButton && !item.listed && !item.staked && (
                  <SendAndBurnButton item={item} updateView={updateView} />
                )}
              </div>
            )}
            {item.staked && (
              <div className="relative">
                <span className="absolute top-4 left-4 bg-opacity-70 bg-black rounded px-2 py-1">
                  Staked
                </span>
              </div>
            )}
            {!item.staked && item.listed && (
              <div className="relative">
                <span className="absolute top-4 left-4 bg-opacity-70 bg-black rounded px-2 py-1">
                  Listed
                </span>
              </div>
            )}
            {item.price && (
              <div className="relative">
                <span className="absolute top-4 right-4 bg-opacity-70 bg-black rounded px-2 py-1">
                  {!item.listed ? "FP: " : ""}
                  {round(item.price, 3).toLocaleString()}◎
                </span>
              </div>
            )}
            <div className="relative">
              <div className="absolute bottom-0 left-0 w-full px-4 py-3 bg-black bg-opacity-75 text-white flex justify-between items-center rounded-b">
                <span className="text-lg font-bold truncate">{item.title}</span>
                <div>
                  {navigate ? (
                    <button onClick={() => navigateWithProjectId(item)}>
                      <EyeOutlined />
                    </button>
                  ) : (
                    <div className="w-6 h-6 text-sm mr-1 flex items-center justify-center rounded-full bg-gray-500">
                      {item.count}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      )}
      <NFTsDialog
        showItems={showItems}
        setShowItems={setShowItems}
        cItem={cItem}
        chain={chain}
        canView
        updateView={updateView}
      />
    </div>
  );
};

export default TitlebarImageList;
