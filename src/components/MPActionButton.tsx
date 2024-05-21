import { useState } from "react";
import { isNumber, isObject } from "lodash";

import { Dialog, DialogBody } from "@material-tailwind/react";

import { Message, Transaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import {
  DEFAULT_BUYER_BROKER,
  USE_ME_API_FOR_COLLECTION_BUY,
} from "@/config/config";

import { useMeta } from "@/contexts/meta/meta";
import { useEthcontext } from "@/contexts/EthWalletProvider";

import NumberInput from "@/components/inputs/NumberInput";

import { mutations } from "@/graphql/graphql";

import useAuthMutation from "@/hooks/useAuthMutation";
import { useToasts } from "@/hooks/useToasts";
import useConnections from "@/hooks/useConnetions";
import { useRequests } from "@/hooks/useRequests";

const MPActionButton = ({
  staked,
  listed,
  myBid,
  noListing,
  price,
  owner,
  broker_referral_address,
  marketplace_program_id,
  tokenMint,
  name,
  floor_price,
  updateView,
  projectId = "",
  tokenAddress = "",
  chain = "SOL",
}: any) => {
  const { connection } = useConnections();
  const { startLoading, stopLoading } = useMeta();
  const {
    getMETransactionInstructions,
    createBuyTx,
    getMEListTransactionInstructions,
    getMEDelistTransactionInstructions,
    getMEBidTransactionInstructions,
    creatDelistTx,
  } = useRequests();
  const [getMECancelBidTransactionInstructions] = useAuthMutation(
    mutations.GET_ME_CANCEL_BID_TRANSACTION_INSTRUCTIONS
  );
  const [getMEChangeBidTransactionInstructions] = useAuthMutation(
    mutations.GET_ME_CHANGE_BID_TRANSACTION_INSTRUCTIONS
  );
  const wallet = useWallet();
  const { ethAddress, ethConnect, ethConnected, ethBalance, sendTransaction } =
    useEthcontext();
  const { showSuccessToast, showErrorToast, showTxErrorToast } = useToasts();
  const [listPrice, setListPrice] = useState(floor_price || 0);
  const [bidPrice, setBidPrice] = useState(0);
  const [newBidPrice, setNewBidPrice] = useState(0);
  const [showListDialog, setShowListDialog] = useState(false);
  const [showBidDialog, setShowBidDialog] = useState(false);
  const [showChangeBidDialog, setShowChangeBidDialog] = useState(false);

  const buyNowInSOL = async () => {
    if (!wallet || !wallet.publicKey) {
      return;
    }
    try {
      startLoading();
      let response;
      const isME =
        marketplace_program_id ===
        "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K";
      if (isME && USE_ME_API_FOR_COLLECTION_BUY) {
        response = await getMETransactionInstructions({
          buyer: wallet.publicKey.toBase58(),
          tokenMint,
        });
      } else {
        response = await createBuyTx({
          buyerAddress: wallet.publicKey.toBase58(),
          price,
          tokenAddress: tokenMint,
          buyerBroker:
            broker_referral_address ||
            DEFAULT_BUYER_BROKER ||
            process.env.SOLANA_FEE_ACCOUNT,
          chain,
        });
      }

      if ((response && response.data) || Object.keys(response).length > 0) {
        let transaction;
        if (isME) {
          transaction = Transaction.from(Buffer.from(response.txSigned));
        } else {
          transaction = Transaction.populate(
            Message.from(Buffer.from(response.data))
          );
        }
        const res = await wallet.sendTransaction(transaction, connection);
        await connection.confirmTransaction(res);
        const getTransResp = await connection.getTransaction(res, {
          commitment: "confirmed",
        });
        if (isObject(getTransResp) && getTransResp?.meta?.err === null) {
          showSuccessToast(
            <a
              href={`https://solscan.io/tx/${res}`}
              target="_blank"
              rel="noreferrer"
              className="text-white m-auto"
            >
              Successfully bought {name}.
            </a>
          );
        } else {
          showErrorToast("Fail to purchase.");
        }
      }
    } catch (error) {
      console.error(error);
      showTxErrorToast(error);
    } finally {
      stopLoading();
      updateView();
    }
  };

  const buyNowInETH = async () => {
    if (!ethConnected || !ethAddress) {
      ethConnect();
    }
    try {
      startLoading();

      if (ethBalance < price) {
        showErrorToast("You have insufficient funds to buy this token.");
        return;
      }

      const response = await createBuyTx({
        buyerAddress: ethAddress, // required field
        tokens: [`${projectId}:${tokenAddress}`], // required field
        chain, // required field
        price,
        tokenAddress: projectId,
        buyerBroker: "",
      });

      if ((response && response.data) || Object.keys(response).length > 0) {
        if (response.error) {
          showErrorToast(response.error);
          return;
        }
        const result = await sendTransaction(response?.txObj);
        if (result.success) {
          showSuccessToast(result.message);
        } else {
          showErrorToast(result.message);
        }
      }
    } catch (error) {
      console.error(error);
      showTxErrorToast(error);
    } finally {
      stopLoading();
      updateView();
    }
  };

  const delistInSOL = async () => {
    if (!wallet || !wallet.publicKey) {
      return;
    }

    try {
      startLoading();
      let response;
      let isME = false;
      if (
        marketplace_program_id === "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K"
      ) {
        response = await getMEDelistTransactionInstructions({
          seller: wallet.publicKey.toBase58(),
          tokenMint,
        });
        isME = true;
      } else {
        response = await creatDelistTx({
          sellerAddress: wallet.publicKey.toBase58(),
          tokenAddress: tokenMint,
        });
      }

      if ((response && response.data) || Object.keys(response).length > 0) {
        let transaction;
        if (isME) {
          transaction = Transaction.from(Buffer.from(response.txSigned));
        } else {
          transaction = Transaction.populate(
            Message.from(Buffer.from(response.data))
          );
        }
        const res = await wallet.sendTransaction(transaction, connection);
        await connection.confirmTransaction(res);
        const getTransResp = await connection.getTransaction(res, {
          commitment: "confirmed",
        });
        if (isObject(getTransResp) && getTransResp?.meta?.err === null) {
          showSuccessToast(
            <a
              href="https://solscan.io/tx/${res}"
              target="_blank"
              rel="noreferrer"
              className="text-white m-auto"
            >
              Successfully Delist {name}.
            </a>
          );
        } else {
          showErrorToast("Fail to delist.");
        }
      }
    } catch (error) {
      console.error(error);
      showTxErrorToast(error);
    } finally {
      stopLoading();
      updateView();
    }
  };

  const delistInETH = async () => {
    try {
      // TODO: delist ETH nft
    } catch (error) {
      console.error(error);
      showTxErrorToast(error);
    } finally {
      stopLoading();
      updateView();
    }
  };

  const listInSOL = async () => {
    if (!wallet || !wallet.publicKey || listPrice <= 0) {
      return;
    }

    try {
      startLoading();
      const response = await getMEListTransactionInstructions({
        seller: wallet.publicKey.toBase58(),
        tokenMint,
        price: listPrice,
      });

      if ((response && response.data) || Object.keys(response).length > 0) {
        const transaction = Transaction.from(Buffer.from(response.txSigned));
        const res = await wallet.sendTransaction(transaction, connection);
        await connection.confirmTransaction(res);
        const getTransResp = await connection.getTransaction(res, {
          commitment: "confirmed",
        });
        if (isObject(getTransResp) && getTransResp?.meta?.err === null) {
          showSuccessToast(
            <a
              href="https://solscan.io/tx/${res}"
              target="_blank"
              rel="noreferrer"
              className="text-white m-auto"
            >
              Successfully list {name}.
            </a>
          );
        } else {
          showErrorToast("Fail to list.");
        }
      }
    } catch (error) {
      console.error(error);
      showTxErrorToast(error);
    } finally {
      stopLoading();
      setShowListDialog(false);
      updateView();
    }
  };

  const listInETH = async () => {
    try {
      // TODO: list ETH nft
    } catch (error) {
      console.error(error);
      showErrorToast("There are some errors, please try again later.");
    } finally {
      stopLoading();
      updateView();
    }
  };

  const bidInSOL = async () => {
    if (!wallet || !wallet.publicKey || bidPrice <= 0) {
      return;
    }

    try {
      startLoading();
      const response = await getMEBidTransactionInstructions({
        buyer: wallet.publicKey.toBase58(),
        tokenMint,
        price: bidPrice,
      });

      if ((response && response.data) || Object.keys(response).length > 0) {
        const transaction = Transaction.from(Buffer.from(response.txSigned));
        const res = await wallet.sendTransaction(transaction, connection);
        await connection.confirmTransaction(res);
        const getTransResp = await connection.getTransaction(res, {
          commitment: "confirmed",
        });
        if (isObject(getTransResp) && getTransResp?.meta?.err === null) {
          showSuccessToast(
            <a
              href="https://solscan.io/tx/${res}"
              target="_blank"
              rel="noreferrer"
              className="text-white m-auto"
            >
              Successfully bid {name} with {bidPrice} SOL.
            </a>
          );
        } else {
          showErrorToast("Fail to bid.");
        }
      }
    } catch (error) {
      console.error(error);
      showTxErrorToast(error);
    } finally {
      stopLoading();
      setShowBidDialog(false);
      updateView();
    }
  };

  const bidInETH = async () => {
    try {
      // TODO: bid ETH nft
    } catch (error) {
      console.error(error);
      showTxErrorToast(error);
    } finally {
      stopLoading();
      updateView();
    }
  };

  const changeBid = async () => {
    if (!wallet || !wallet.publicKey || newBidPrice <= 0) {
      return;
    }

    try {
      startLoading();
      const { data: instructions } =
        await getMEChangeBidTransactionInstructions({
          variables: {
            buyer: wallet.publicKey.toBase58(),
            tokenMint,
            price: myBid.price,
            newPrice: newBidPrice,
          },
        });
      const { getMEChangeBidTransactionInstructions: response } = instructions;

      if ((response && response.data) || Object.keys(response).length > 0) {
        const transaction = Transaction.from(Buffer.from(response.txSigned));
        const res = await wallet.sendTransaction(transaction, connection);
        await connection.confirmTransaction(res);
        const getTransResp = await connection.getTransaction(res, {
          commitment: "confirmed",
        });
        if (isObject(getTransResp) && getTransResp?.meta?.err === null) {
          showSuccessToast(
            <a
              href="https://solscan.io/tx/${res}"
              target="_blank"
              rel="noreferrer"
              className="text-white m-auto"
            >
              Successfully bid {name} with {newBidPrice} SOL.
            </a>
          );
        } else {
          showErrorToast("Fail to bid.");
        }
      }
    } catch (error) {
      console.error(error);
      showTxErrorToast(error);
    } finally {
      stopLoading();
      setShowChangeBidDialog(false);
      updateView();
    }
  };

  const cancelBid = async () => {
    if (!wallet || !wallet.publicKey) {
      return;
    }

    try {
      startLoading();
      const { data: instructions } =
        await getMECancelBidTransactionInstructions({
          variables: {
            buyer: wallet.publicKey.toBase58(),
            tokenMint,
            price: myBid?.price,
          },
        });
      const { getMECancelBidTransactionInstructions: response } = instructions;

      if ((response && response.data) || Object.keys(response).length > 0) {
        const transaction = Transaction.from(Buffer.from(response.txSigned));
        const res = await wallet.sendTransaction(transaction, connection);
        await connection.confirmTransaction(res);
        const getTransResp = await connection.getTransaction(res, {
          commitment: "confirmed",
        });
        if (isObject(getTransResp) && getTransResp?.meta?.err === null) {
          showSuccessToast(
            <a
              href="https://solscan.io/tx/${res}"
              target="_blank"
              rel="noreferrer"
              className="text-white m-auto"
            >
              Successfully cancel bid on {name}.
            </a>
          );
        } else {
          showErrorToast("Fail to bid.");
        }
      }
    } catch (error) {
      console.error(error);
      showTxErrorToast(error);
    } finally {
      stopLoading();
      updateView();
    }
  };

  const isOwner =
    chain === "SOL"
      ? owner === wallet?.publicKey?.toBase58()
      : owner === ethAddress;

  if (!staked) {
    return (
      <>
        {listed ? (
          <>
            {!isOwner ? (
              <button
                className="rounded-full mt-2 w-full bg-secondary text-white"
                onClick={
                  chain === "SOL" ? () => buyNowInSOL() : () => buyNowInETH()
                }
              >
                <p className="text-base" data-font-size="20">
                  {" "}
                  Buy Now{" "}
                </p>
              </button>
            ) : (
              <button
                className="rounded-full mt-2 w-full bg-secondary text-white"
                onClick={
                  chain === "SOL" ? () => delistInSOL() : () => delistInETH()
                }
              >
                <p className="text-base" data-font-size="20">
                  {" "}
                  Delist{" "}
                </p>
              </button>
            )}
          </>
        ) : (
          <>
            {!noListing ? (
              <>
                {!isOwner ? (
                  <p className="text-primary">Not Listed</p>
                ) : (
                  <div className="flex items-center gap-4 mt-8">
                    <button
                      className="rounded-full min-w-[120px] text-white bg-secondary-main"
                      onClick={
                        chain === "SOL" ? () => listInSOL() : () => listInETH()
                      }
                    >
                      <p className="text-lg" data-font-size="20">
                        List
                      </p>
                    </button>
                    <NumberInput
                      value={listPrice}
                      min={0}
                      step={0.001}
                      precision={3}
                      placeholder={`List Price (${chain})"`}
                      onChange={(value?: number) => {
                        if (value && isNumber(value) && value > 0) {
                          setListPrice(value);
                        }
                      }}
                    />
                    <p className="text-base" data-font-size="16">
                      {" "}
                      {chain}{" "}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {isOwner && (
                  <button
                    className="rounded-full mt-2 w-full bg-secondary text-white"
                    onClick={() => setShowListDialog(true)}
                  >
                    <p className="text-base" data-font-size="20">
                      {" "}
                      List{" "}
                    </p>
                  </button>
                )}
              </>
            )}
          </>
        )}

        {!noListing &&
          (!myBid ? (
            <button
              className="rounded-full mt-2 w-full text-secondary border-secondary border"
              onClick={() => setShowBidDialog(true)}
            >
              <p className="text-base" data-font-size="20">
                {" "}
                Make an offer{" "}
              </p>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                className="rounded-full mt-2 w-full text-secondary border-secondary border"
                onClick={() => setShowChangeBidDialog(true)}
              >
                <p className="text-base" data-font-size="20">
                  {" "}
                  Change offered price{" "}
                </p>
              </button>
              <button
                className="rounded-full mt-2 w-full text-error border-error border"
                onClick={() => cancelBid()}
              >
                <p className="text-base" data-font-size="20">
                  {" "}
                  Cancel offer{" "}
                </p>
              </button>
            </div>
          ))}
        <Dialog open={showListDialog} onClose={() => setShowListDialog(false)}>
          <DialogBody>
            <div className="flex gap-1 items-center mt-2">
              <button
                className="rounded-full min-w-[120px] bg-secondary text-white px-4 py-2"
                onClick={
                  chain === "SOL" ? () => listInSOL() : () => listInETH()
                }
              >
                <p className="text-base">List</p>
              </button>
              <NumberInput
                value={listPrice}
                min={0}
                step={0.001}
                precision={3}
                placeholder={`List Price (${chain})`}
                onChange={(value?: number) => {
                  if (value && isNumber(value) && value > 0) {
                    setListPrice(value);
                  }
                }}
              />
              <p className="text-base" data-chain="{chain}" data-font-size="16">
                {" "}
                {chain}{" "}
              </p>
            </div>
          </DialogBody>
        </Dialog>
        <Dialog open={showBidDialog} onClose={() => setShowBidDialog(false)}>
          <DialogBody>
            <div className="flex gap-1 items-center mt-2">
              <button
                className="rounded-lg min-w-[120px] bg-secondary text-white"
                onClick={chain === "SOL" ? () => bidInSOL() : () => bidInETH()}
              >
                <p className="text-base whitespace-nowrap">Make an offer</p>
              </button>
              <NumberInput
                value={bidPrice}
                min={0}
                step={0.001}
                precision={3}
                placeholder={`Offer Price (${chain})`}
                onChange={(value?: number) => {
                  if (value && isNumber(value) && value > 0) {
                    setBidPrice(value);
                  }
                }}
              />
              <p className="text-base whitespace-nowrap">{chain}</p>
            </div>
          </DialogBody>
        </Dialog>
        <Dialog
          open={showChangeBidDialog}
          onClose={() => setShowChangeBidDialog(false)}
        >
          <DialogBody>
            <p className="whitespace-nowrap">
              Original bid price: {myBid?.price}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <button
                className="rounded-full min-w-[120px] bg-secondary text-base px-4 py-2"
                onClick={() => changeBid()}
              >
                <p className="text-xl truncate">Change offered price</p>
              </button>
              <NumberInput
                value={newBidPrice}
                min={0}
                step={0.001}
                precision={3}
                placeholder={`New Offer Price (${chain})`}
                onChange={(value?: number) => {
                  if (value && isNumber(value) && value > 0) {
                    setNewBidPrice(value);
                  }
                }}
              />
              <p className="text-base truncate">{chain}</p>
            </div>
          </DialogBody>
        </Dialog>
      </>
    );
  }
  return <></>;
};

export default MPActionButton;
