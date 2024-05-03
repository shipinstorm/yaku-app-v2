import { Dialog, DialogContent, Button } from '@mui/material';

const ConfirmDialog = ({
    title,
    children,
    open,
    setOpen,
    onConfirm,
    cancelLabel = 'Cancel',
    confirmLabel = 'Confirm',
    confirmBtnColor = 'error'
}: any) => (
    <Dialog
        sx={{
            '.MuiPaper-root': {
                backgroundColor: 'transparent'
            }
        }}
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="confirm-dialog"
    >
        <DialogContent className="card">
            <div className="create-box-header">
                <h3 className="secondary-title">{title}</h3>
            </div>
            {children}

            <div className="flex mt-5 pt-3 px-2">
                <Button variant="contained" className="dark-btn flex-1 mr-2" onClick={() => setOpen(false)}>
                    {cancelLabel}
                </Button>
                <Button
                    variant="contained"
                    color={confirmBtnColor}
                    className="flex-1 ml-2 !rounded-xl"
                    onClick={() => {
                        setOpen(false);
                        onConfirm();
                    }}
                >
                    {confirmLabel}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
);

export default ConfirmDialog;
