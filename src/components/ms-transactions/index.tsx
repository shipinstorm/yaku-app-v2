import { Button, Divider, Grid } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useRequest } from "ahooks";
import PubkeyLink from "@/components/pubkey-link";
import useConnections from "@/hooks/useConnetions";
import useMsTx from "@/hooks/useMsTx";
import { useToasts } from "@/hooks/useToasts";
import * as React from "react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { MsTx } from "@/types/ms";
import {
  cancelMsTx,
  confirmMsTx,
  rejectMsTx,
  executeMsTx as execMsTx,
  MS_TRANSACTION_REFRESH_TIMEOUT,
} from "@/utils/ms";
import { MsTransactionStatus } from "../../utils/multisig";
import LoadingSpinner from "../loaders/LoadingSpinner";
import StatusBar from "./Statusbar";

/* eslint-disable no-underscore-dangle */

interface Props {
  tx: MsTx;
  threshold?: number;
  owners?: PublicKey[];
  refresh: (isMs: boolean, isAssets: boolean) => void;
  setRefreshingState: () => void;
  setTempData: (tempTx: MsTx) => void;
}

const TransactionCard: React.FC<Props> = ({
  tx,
  threshold,
  owners,
  refresh,
  setRefreshingState,
  setTempData,
}: Props) => {
  const wallet = useWallet();
  const { connection } = useConnections();
  const [panelShown, setPanelShown] = useState<boolean>(false);
  const { executeMsTx } = useMsTx();
  const { showSuccessToast, showErrorToast } = useToasts();

  const { loading: cancelLoading, run: runCancel } = useRequest(cancelMsTx, {
    manual: true,
    onSuccess: (result) => {
      if (result) {
        showSuccessToast("Transaction cancelled successfully");
        tx.cancelled.push(wallet.publicKey!.toBase58());
        if (tx.cancelled.length >= (threshold ?? 0)) {
          tx.status = MsTransactionStatus.Cancelled;
        }
        setTempData({ ...tx });

        setRefreshingState();
        setTimeout(() => {
          refresh(false, false);
        }, MS_TRANSACTION_REFRESH_TIMEOUT);
      }
    },
    onError(e, params) {
      showErrorToast(e);
    },
  });

  const { loading: executeLoading, run: runExecute } = useRequest(executeMsTx, {
    manual: true,
    onSuccess: (result) => {
      if (result) {
        showSuccessToast("Transaction executed successfully");
        tx.signature = result;
        tx.executedAt = new Date().toISOString();
        tx.status = MsTransactionStatus.Executed;
        setTempData({ ...tx });

        setRefreshingState();
        setTimeout(() => {
          refresh(true, true);
        }, MS_TRANSACTION_REFRESH_TIMEOUT);
      } else {
        toast.error("Failed to execute transaction");
      }
    },
    onError(e, params) {
      showErrorToast(e);
    },
  });

  const { loading: rejectLoading, run: runReject } = useRequest(rejectMsTx, {
    manual: true,
    onSuccess: (result) => {
      if (result) {
        showSuccessToast("Reject voted");
        tx.rejected.push(wallet.publicKey!.toBase58());
        const cutoff = (owners?.keys.length ?? 0) - (threshold ?? 0);
        if (tx.rejected.length > cutoff) {
          tx.status = MsTransactionStatus.Rejected;
        }
        setTempData({ ...tx });

        setRefreshingState();
        setTimeout(() => {
          refresh(false, false);
        }, MS_TRANSACTION_REFRESH_TIMEOUT);
      }
    },
    onError(e, params) {
      showErrorToast(e);
    },
  });

  const { loading: confirmLoading, run: runConfirm } = useRequest(confirmMsTx, {
    manual: true,
    onSuccess: (result) => {
      if (result) {
        showSuccessToast("Confirm voted");
        tx.approved.push(wallet.publicKey!.toBase58());
        if (tx.approved.length >= (threshold ?? 0)) {
          tx.status = MsTransactionStatus.ExecuteReady;
        }
        setTempData({ ...tx });

        setRefreshingState();
        setTimeout(() => {
          refresh(false, false);
        }, MS_TRANSACTION_REFRESH_TIMEOUT);
      }
    },
    onError(e, params) {
      showErrorToast(e);
    },
  });

  const handleCancel = async () => {
    runCancel({
      connection,
      wallet,
      tx,
    });
  };

  const handleExecute = async () => {
    runExecute({ id: tx.txId }, () =>
      execMsTx({
        connection,
        wallet,
        tx,
      })
    );
  };

  const handleReject = async () => {
    runReject({
      connection,
      wallet,
      tx,
    });
  };

  const handleConfirm = async () => {
    runConfirm({
      connection,
      wallet,
      tx,
    });
  };

  const canTakeAction = useMemo(() => {
    if (!!owners && wallet.connected && wallet.publicKey) {
      return owners
        .map((item) => item.toString())
        .includes(wallet.publicKey.toString());
    }
    return false;
  }, [owners, wallet.connected, wallet.publicKey]);

  const canConfirm = useMemo(() => {
    if (wallet.connected && wallet.publicKey) {
      return !tx.approved.includes(wallet.publicKey.toString());
    }
    return false;
  }, [tx.approved, wallet.connected, wallet.publicKey]);

  const canCancel = useMemo(() => {
    if (wallet.connected && wallet.publicKey) {
      return !tx.cancelled.includes(wallet.publicKey.toString());
    }
    return false;
  }, [tx.cancelled, wallet.connected, wallet.publicKey]);

  const canReject = useMemo(() => {
    if (wallet.connected && wallet.publicKey) {
      return !tx.rejected.includes(wallet.publicKey.toString());
    }
    return false;
  }, [tx.rejected, wallet.connected, wallet.publicKey]);

  const actionAvailable = useMemo(
    () =>
      tx.status !== MsTransactionStatus.Cancelled &&
      tx.status !== MsTransactionStatus.Executed &&
      tx.status !== MsTransactionStatus.Rejected,
    [tx.status]
  );

  return (
    <div className="transaction-card py-2 my-2">
      <div className="px-2 py-2">
        <StatusBar
          tx={tx}
          isPanelShown={panelShown}
          onToggle={() => setPanelShown((oldValue) => !oldValue)}
        />
      </div>
      {panelShown && (
        <>
          <Divider className="mb-2" />
          <Grid container>
            <Grid item xs={6} className="px-2">
              <div className="info-panel h-100">
                <div className="title py-2 font-bold">Info</div>
                <div className="flex justify-between pt-1">
                  <span>Author</span>
                  <span>
                    <PubkeyLink customClass="underline" pubkey={tx.creator} />
                  </span>
                </div>
                <div className="flex justify-between pt-1 mt-1">
                  <span>Created At</span>
                  <span>{new Date(tx.createdAt).toDateString()}</span>
                </div>
                <div className="flex justify-between pt-1 mt-1">
                  <span>Executed At</span>
                  <span>
                    {tx.executedAt
                      ? new Date(tx.executedAt).toDateString()
                      : "n/a"}
                  </span>
                </div>
                <div className="flex justify-between pt-1 mt-1">
                  <span>Transaction Link</span>
                  <span>
                    {tx.signature ? (
                      <PubkeyLink
                        customClass="underline"
                        pubkey={tx.signature}
                        prefixSize={10}
                        type="tx"
                      />
                    ) : (
                      "n/a"
                    )}
                  </span>
                </div>
              </div>
            </Grid>
            <Grid item xs={6} className="px-2">
              <div className="result-panel h-100">
                <div className="title py-2 font-bold">Results</div>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <div className="count-info confirmed-count py-1 flex justify-center">
                      {tx.approved.length}
                    </div>
                    <div className="flex justify-center">confirmed</div>
                  </Grid>
                  <Grid item xs={4}>
                    <div className="count-info rejected-count py-1 flex justify-center">
                      {threshold && tx.approved.length >= threshold
                        ? tx.cancelled.length
                        : tx.rejected.length}
                    </div>
                    <div className="flex justify-center">
                      {threshold && tx.approved.length >= threshold
                        ? "Cancelled"
                        : "Rejected"}
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    <div className="count-info threshold-count py-1 flex justify-center">
                      {threshold && owners
                        ? `${threshold}/${owners.length}`
                        : "n/a"}
                    </div>
                    <div className="flex justify-center">Threshold</div>
                  </Grid>
                </Grid>

                {threshold && actionAvailable && (
                  <Grid container spacing={1} className="action-panel pt-4">
                    {tx.approved.length >= threshold ? (
                      <>
                        <Grid item xs={6}>
                          <Button
                            className="dark-btn w-full text-white"
                            onClick={handleCancel}
                            disabled={
                              !canCancel || !canTakeAction || cancelLoading
                            }
                          >
                            {cancelLoading ? (
                              <LoadingSpinner />
                            ) : (
                              <span
                                className={
                                  canCancel && canTakeAction ? "" : "text-dummy"
                                }
                              >
                                Cancel
                              </span>
                            )}
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            className="blue-btn w-full text-white"
                            onClick={handleExecute}
                            disabled={!canTakeAction || executeLoading}
                          >
                            {executeLoading ? (
                              <LoadingSpinner />
                            ) : (
                              <span
                                className={canTakeAction ? "" : "text-dummy"}
                              >
                                Execute
                              </span>
                            )}
                          </Button>
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid item xs={6}>
                          <Button
                            className="dark-btn w-full text-white"
                            onClick={handleReject}
                            disabled={
                              !canReject || !canTakeAction || rejectLoading
                            }
                          >
                            {rejectLoading ? (
                              <LoadingSpinner />
                            ) : (
                              <span
                                className={
                                  canReject && canTakeAction ? "" : "text-dummy"
                                }
                              >
                                Reject
                              </span>
                            )}
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            className="blue-btn w-full text-white"
                            onClick={handleConfirm}
                            disabled={
                              !canConfirm || !canTakeAction || confirmLoading
                            }
                          >
                            {confirmLoading ? (
                              <LoadingSpinner />
                            ) : (
                              <span
                                className={
                                  canTakeAction && canConfirm
                                    ? ""
                                    : "text-dummy"
                                }
                              >
                                Confirm
                              </span>
                            )}
                          </Button>
                        </Grid>
                      </>
                    )}
                  </Grid>
                )}
              </div>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
};

export default TransactionCard;
