import { Dialog, DialogBody } from "@material-tailwind/react";

const ConfirmDialog = ({
  title,
  children,
  open,
  setOpen,
  onConfirm,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  confirmBtnColor = "error",
}: any) => (
  <Dialog
    open={open}
    aria-labelledby="confirm-dialog"
    handler={() => {}}
    placeholder=""
    onPointerEnterCapture={() => {}}
    onPointerLeaveCapture={() => {}}
  >
    <DialogBody
      className="card"
      placeholder=""
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    >
      <div className="create-box-header">
        <h3 className="secondary-title">{title}</h3>
      </div>
      {children}

      <div className="flex mt-5 pt-3 px-2">
        <button
          className="dark-btn flex-1 mr-2 bg-primary-600 text-white rounded-xl"
          onClick={() => setOpen(false)}
        >
          {cancelLabel}
        </button>
        <button
          className="flex-1 ml-2 bg-secondary-500 text-white rounded-xl"
          onClick={() => {
            setOpen(false);
            onConfirm();
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </DialogBody>
  </Dialog>
);

export default ConfirmDialog;
