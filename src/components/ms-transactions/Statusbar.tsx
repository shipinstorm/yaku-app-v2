import Image from "next/image";
import { Button } from "@mui/material";
import { useRequest } from "ahooks";
import useConnections from "@/hooks/useConnetions";
import { MsTx } from "@/types/ms";
import getMintInformation from "@/utils/mint";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { MsTransactionStatus } from "@/utils/multisig";
import { useMemo } from "react";
import PubkeyLink from "@/components/pubkey-link";

interface Props {
  tx: MsTx;
  isPanelShown: boolean;
  onToggle: () => void;
}

const StatusBar: React.FC<Props> = ({ tx, isPanelShown, onToggle }) => {
  const { connection } = useConnections();
  const { data: mintInfo } = useRequest(() =>
    getMintInformation(connection, tx.mint)
  );

  const statusText = useMemo(() => {
    switch (tx.status) {
      case MsTransactionStatus.Cancelled:
        return "Cancelled";
      case MsTransactionStatus.Rejected:
        return "Rejected";
      case MsTransactionStatus.Executed:
        return "Executed";
      case MsTransactionStatus.Active:
        return "Active";
      case MsTransactionStatus.Draft:
        return "Draft";
      default:
        return "Ready for execution";
    }
  }, [tx.status]);

  const statusClass = useMemo(() => {
    switch (tx.status) {
      case MsTransactionStatus.Cancelled:
        return "cancelled";
      case MsTransactionStatus.Rejected:
        return "rejected";
      case MsTransactionStatus.Executed:
        return "executed";
      case MsTransactionStatus.Active:
        return "active";
      case MsTransactionStatus.Draft:
        return "draft";
      default:
        return "execute-ready";
    }
  }, [tx.status]);

  const targetAddress = useMemo(() => {
    if (tx.description && tx.description.includes("Recipient: ")) {
      return tx.description.replace("Recipient: ", "");
    }
    return "";
  }, [tx.description]);

  return (
    <div className="tx-status-bar flex justify-between">
      <div className="status-info flex items-center">
        <span className="type-info w-[180px]">
          Type: <strong>{tx.type ?? "Unknown"}</strong>
        </span>
        <span className="description-info flex items-center">
          {tx.mint && !!mintInfo && (
            <div className="flex items-center mr-3">
              <Image
                src={mintInfo.image || ""}
                alt={mintInfo.symbol}
                className="mint-img mr-2"
              />
              <span>{mintInfo.name} </span>
            </div>
          )}
          <div className="description ml-2">
            {targetAddress !== "" ? (
              <div className="flex">
                Recipient:{" "}
                <PubkeyLink customClass="ml-2" pubkey={targetAddress} />
              </div>
            ) : (
              tx.description ?? ""
            )}
          </div>
        </span>
      </div>
      <div className="toggle-panel">
        <span className={`status-text mr-2 ${statusClass}`}>
          <strong>{statusText}</strong>
        </span>
        <Button
          variant="contained"
          color="primary"
          onClick={onToggle}
          className="p-2 min-w-[40px] rounded-xl"
        >
          {isPanelShown ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </Button>
      </div>
    </div>
  );
};

export default StatusBar;
