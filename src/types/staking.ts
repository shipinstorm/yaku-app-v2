import { KeyedObject } from "@/types";

export type NFT = {
  name: string;
  image: string;
  rank?: string;
  reward?: number;
  mint: string;
  staked: boolean;
};

export type YAKU_NFT = {
  name?: string;
  image?: string;
  mintAddress?: any;
  reward?: number;
  index?: number;
  proof?: any;
  traits?: any;
  mint: string;
  stakeDays: number;
  lastClaim: number;
  interval: number;
  amount: number;
};

export interface StakingNftCardProps extends KeyedObject {
  mint: string;
  role: string;
  name: string;
  image: string;
  startLoading: Function;
  stopLoading: Function;
  updatePage: Function;
}

export interface StakedNftCardProps extends KeyedObject {
  mint: string;
  name: string;
  image: string;
  role: string;
  lockTime: number;
  stakedTime: number;
  startLoading: Function;
  stopLoading: Function;
  updatePage: Function;
}

export interface YakuStakingNftCardProps extends KeyedObject {
  mint: string;
  reward: string;
  name: string;
  image: string;
  isPNft: boolean;
  startLoading: Function;
  stopLoading: Function;
  updatePage: Function;
}

export interface YakuStakedNftCardProps extends KeyedObject {
  mint: string;
  reward: string;
  name: string;
  image: string;
  isPNft: boolean;
  stakedType?: string;
  lastClaim: number;
  interval: number;
  amount: number;
  startLoading: Function;
  stopLoading: Function;
  updatePage: Function;
  isSelected: boolean;
  onSelect: Function;
}
