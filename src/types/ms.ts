import { AccountInfo, ParsedAccountData, PublicKey } from '@solana/web3.js';
import { MsArgs } from 'utils/multisig';
import { TokenData } from 'utils/web3';

export const MS_REFRESH_TIMEOUT = 3000;

export type VaultInfo = {
    nftList: TokenData[];
    pubkey: PublicKey;
    lamports: number;
};

export type MsInfo = {
    vault: VaultInfo | undefined;
    msData: MsArgs | undefined;
    multisig: string;
    workspaceId: string;
    workspaceOwner: string;
};

export type AssetChoice = {
    label: string;
    icon: string;
    value: string;
    decimals: number;
    ta?: {
        pubkey: PublicKey;
        account: AccountInfo<ParsedAccountData>;
    };
};

export type Attribute = {
    trait_type: string;
    value: string;
};

export type AssetInfo = {
    name: string;
    image?: string;
    description?: string;
    symbol: string;
    external_url?: string;
    attributes?: Attribute[];
    animation_url?: string;
    pubkey?: string;
};

export type MsTx = {
    _id: string;
    txId?: string;
    creator: string;
    ms: string;
    transactionIndex: number;
    approved: string[];
    cancelled: string[];
    rejected: string[];
    createdAt: string;
    instructionIndex: number;
    executedIndex: number;
    mint?: string;
    type?: string;
    pda: string;
    instructions: any[];
    status: number;
    updatedAt: string;
    executedAt?: string;
    signature?: string;
    description?: string;
};
