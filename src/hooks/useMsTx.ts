/* eslint-disable no-underscore-dangle */
import { useRequests } from './useRequests';

const useMsTx = () => {
    const { initMsTx, updateMsTx } = useRequests();

    const createMsTx = async (payload: any, web3handler: () => Promise<boolean>): Promise<boolean> => {
        // save data into the web2
        let msTx;
        try {
            msTx = await initMsTx(payload);
        } catch (e) {
            console.error(e);
            return false;
        }

        // save data into the web3
        try {
            const result = await web3handler();
            return result;
        } catch (e) {
            try {
                console.error(e);
                await updateMsTx({
                    id: msTx._id,
                    error: e as string
                });
            } catch {
                console.log('Update MsTx Failed');
            }
            return false;
        }
    };

    const executeMsTx = async (payload: any, web3handler: () => Promise<string | null>): Promise<string | null> => {
        // save data into the web3
        let result: string | null = null;
        try {
            result = await web3handler();
        } catch (e) {
            return null;
        }

        try {
            if (result) {
                payload.signature = result;
                payload.executedAt = new Date().toISOString();
                await updateMsTx(payload);
            }
        } catch (e) {
            console.log('Update MsTx Failed');
        }

        return result;
    };

    return {
        createMsTx,
        executeMsTx
    };
};

export default useMsTx;
