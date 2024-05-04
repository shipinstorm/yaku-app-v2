import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Skeleton } from "@mui/material";
import { formatAmount, shortenAddress } from "@/utils/utils";
import { isArray } from "lodash";

const FollowSection = ({ title, list, loading }: any) => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [variant, setVariant] = useState<string>("");

  const getCount = (obj: any) =>
    (
      formatAmount(isArray(obj) ? obj?.length || 0 : obj || 0, 0) || 0
    ).toString();

  return (
    <>
      <div>
        <button
          type="button"
          className="text-primary mb-1 bg-transparent text-xl font-bold"
          onClick={() => {
            if (!isArray(list)) return;
            setShowDialog(true);
            setVariant(title);
          }}
          disabled={loading}
        >
          {loading ? (
            <Skeleton variant="text" className="mx-auto" width={30} />
          ) : (
            getCount(list)
          )}
        </button>
        <p className="text-terciary text-xs font-medium">{title}</p>
      </div>

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          <span className="capitalize">{variant}</span>
        </DialogTitle>
        <DialogContent>
          {list && isArray(list) && list.length > 0 ? (
            list.map((el: any, idx: any) => (
              <div key={idx} className="flex gap-2">
                <p className="w-1/2">
                  {el.vanity || el?.discord?.name || shortenAddress(el.wallet)}
                </p>
                <p className="w-1/2">{shortenAddress(el.wallet, 7)}</p>
              </div>
            ))
          ) : (
            <p className="text-center">No {title}</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FollowSection;
