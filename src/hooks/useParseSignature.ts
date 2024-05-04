import { useRequest } from "ahooks";
import dayjs from "dayjs";
import { useMemo } from "react";
import {
  deduceTxType,
  isFailed,
  parseTransferSignature,
} from "@/utils/signatures";
import useConnections from "./useConnetions";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function useParseSignature(tx: any, pubkey: string) {
  const { connection } = useConnections();
  const txType = useMemo(() => {
    const tempType = tx.type as string;
    if (tempType === "Unknown" || tempType === "Create") {
      return deduceTxType(tx.logMessages, tx.message);
    }
    return tempType;
  }, [tx.logMessages, tx.message, tx.type]);

  const { loading: parsing, data: parseResult } = useRequest(() =>
    parseTransferSignature(connection, tx, txType, pubkey)
  );

  return {
    type: txType,
    failed: isFailed(tx),
    createdAt: dayjs(tx.datetime).fromNow(),
    parsing,
    mint: parseResult?.mint ?? "",
    name: parseResult?.name ?? "",
    symbol: parseResult?.symbol ?? "",
    image: parseResult?.image ?? "",
    isSent: parseResult?.isSent ?? false,
    source: parseResult?.source ?? "",
    destination: parseResult?.destination ?? "",
    amount: parseResult?.amount ?? 0,
  };
}
