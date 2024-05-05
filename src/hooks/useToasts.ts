import { toast } from 'react-toastify';
import { ERROR_MAP } from '@/utils/transactions';

export const useToasts = () => {
    const showInfoToast = (message: string | any) => {
        console.log(message);
        toast.info(message);
    };
    const showErrorToast = (message: string | any) => toast.error(message);
    const showSuccessToast = (message: string | any) => toast.success(message);
    const showWarningToast = (message: string | any) => toast.warning(message);
    const showLoadingToast = (message: string | any) => toast.loading(message);
    const dismissToast = () => toast.dismiss();

    const showTxErrorToast = (error: any, message?: string) => {
        if (error.code === 4001 || error.message.includes('rejected the request')) {
            toast.error(ERROR_MAP.REQUEST_REJECTED);
        } else if (error.code === 4100 || error.message.includes('account has not been authorized')) {
            toast.error(ERROR_MAP.UNAUTHORIZED);
        } else if (error.code === 4200 || error.message.includes('does not support the requested method')) {
            toast.error(ERROR_MAP.UNSUPPORTED_METHOD);
        } else if (error.code === 4900 || error.message.includes('disconnected')) {
            toast.error(ERROR_MAP.DISCONNECTED);
        } else if (error.code === 4901 || error.message.includes('not connected')) {
            toast.error(ERROR_MAP.CHAIN_DISCONNECTED);
        } else if (error.code === -32000 || error.message.includes('invalid parameter')) {
            toast.error(ERROR_MAP.INVALID_INPUT);
        } else if (error.code === -32001 || error.message.includes('resource not found')) {
            toast.error(ERROR_MAP.RESOURCE_NOT_FOUND);
        } else if (error.code === -32002 || error.message.includes('resource not available')) {
            toast.error(ERROR_MAP.RESOURCE_NOT_AVAILABLE);
        } else if (error.code === -32003 || error.message.includes('failed')) {
            toast.error(ERROR_MAP.TX_REJECTED);
        } else if (error.code === -32004 || error.message.includes('not implemented')) {
            toast.error(ERROR_MAP.METHOD_NOT_SUPPORTED);
        } else if (error.code === -32005 || error.message.includes('limit')) {
            toast.error(ERROR_MAP.TX_TIMEOUT);
        } else if (error.code === -32006 || error.message.includes('protocol is not supported')) {
            toast.error(ERROR_MAP.JSON_RPC_NOT_SUPPORT);
        } else if (error.code === -32600 || error.message.includes('valid request')) {
            toast.error(ERROR_MAP.INVALID_REQUEST);
        } else if (error.code === -32601 || error.message.includes('Method does not exist')) {
            toast.error(ERROR_MAP.METHOD_NOT_FOUND);
        } else if (error.code === -32602 || error.message.includes('method parameter')) {
            toast.error(ERROR_MAP.INVALID_PARAMS);
        } else if (error.code === -32603 || error.message.includes('Internal')) {
            toast.error(ERROR_MAP.INTERNAL_ERROR);
        } else if (error.code === -32700 || error.message.includes('Invalid JSON')) {
            toast.error(ERROR_MAP.PARSE_ERROR);
        } else {
            toast.error(message || 'There are some errors, please try again later.');
        }
    };

    return {
        showInfoToast,
        showErrorToast,
        showTxErrorToast,
        showSuccessToast,
        showWarningToast,
        showLoadingToast,
        dismissToast
    };
};

export default useToasts;
