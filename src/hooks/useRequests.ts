"use client";

import { useLazyQuery, useMutation } from "@apollo/client";
import axios from "axios";
import { useState } from "react";
import { NFTMetadataType } from "@/types/nfts";
import { mutations, queries } from "../graphql/graphql";
import useAuthLazyQuery from "./useAuthLazyQuery";
import useAuthMutation from "./useAuthMutation";

// eslint-disable-next-line import/prefer-default-export
export function useRequests() {
  const hubSvcPath = "https://service.yaku.ai/api";
  const nftSvcPath = "https://nft.yaku.ai/api";
  const ethSvcPath = "https://eth.yaku.ai/api";
  const agSvcPath = "https://ag.yaku.ai/api";
  // const playerPath = "http://localhost:8080/v1/auth";
  const playerPath = "https://52.87.162.174/v1/auth";

  const [csrfToken, setCsrfToken] = useState("");
  const [agToken, setAgToken] = useState("");
  const [ethToken, setEthToken] = useState("");

  // Hub
  const [GET_SITE_STATS] = useLazyQuery(queries.GET_SITE_STATS);

  const [GET_LEADERBOARDS] = useLazyQuery(queries.GET_LEADERBOARDS);
  const [GET_YAKU_STATS] = useLazyQuery(queries.GET_YAKU_STATS);
  // Users
  const [LOG_IN] = useMutation(mutations.LOG_IN);
  const [SIGN_UP] = useMutation(mutations.SIGN_UP);
  const [DISCORD_AUTH] = useAuthMutation(mutations.DISCORD_AUTH);
  const [TWITTER_AUTH] = useAuthMutation(mutations.TWITTER_AUTH);
  const [GET_ALL_SUBWALLET] = useAuthLazyQuery(queries.GET_ALL_SUBWALLET);
  const [GET_DISCORD_LINK] = useAuthMutation(mutations.GET_DISCORD_LINK);
  const [GET_TWITTER_LINK] = useAuthMutation(mutations.GET_TWITTER_LINK);
  const [LINK_WALLET] = useAuthMutation(mutations.LINK_WALLET);
  const [UNLINK_WALLET] = useAuthMutation(mutations.UNLINK_WALLET);

  const [GET_CORAL_USER_PROFILE] = useAuthLazyQuery(
    queries.GET_CORAL_USER_PROFILE
  );
  const [GET_WALLET_STATS] = useAuthLazyQuery(queries.GET_WALLET_STATS);
  const [GET_WALLET_ACTIVITIES] = useAuthLazyQuery(
    queries.GET_WALLET_ACTIVITIES
  );
  const [GET_WALLET_TOKENS] = useAuthLazyQuery(queries.GET_WALLET_TOKENS);
  const [GET_USER_LISTINGS] = useAuthLazyQuery(queries.GET_USER_LISTINGS);

  const [GET_ME_ESCROW_BALANCE] = useAuthLazyQuery(
    queries.GET_ME_ESCROW_BALANCE
  );

  const [GET_WALLET_HIST] = useAuthLazyQuery(queries.GET_WALLET_HIST);
  // NFT Collections
  const [GET_COLLECTION_STATS] = useLazyQuery(queries.GET_COLLECTION_STATS);

  const [GET_PROJECT_NAME] = useAuthLazyQuery(queries.GET_PROJECT_NAME);
  const [SEARCH_PROJECT_BY_NAME] = useAuthLazyQuery(
    queries.SEARCH_PROJECT_BY_NAME
  );

  const [GET_MARKETPLACE_SNAPSHOT] = useAuthLazyQuery(
    queries.GET_MARKETPLACE_SNAPSHOT
  );
  const [GET_NFTS_BY_WALLET] = useAuthLazyQuery(queries.GET_NFTS_BY_WALLET);
  const [GET_TOKEN_BY_MINT] = useAuthLazyQuery(queries.GET_TOKEN_BY_MINT);
  const [GET_ME_TRANSACTION_INSTRUCTIONS] = useAuthMutation(
    mutations.GET_ME_TRANSACTION_INSTRUCTIONS
  );
  const [GET_ME_WITHDRAW_TRANSACTION_INSTRUCTIONS] = useAuthMutation(
    mutations.GET_ME_WITHDRAW_TRANSACTION_INSTRUCTIONS
  );
  const [GET_PROJECTS_STATS] = useLazyQuery(queries.GET_PROJECTS_STATS);
  const [CREATE_BUY_TX] = useAuthMutation(mutations.CREATE_BUY_TX);
  const [CREATE_DELIST_TX] = useAuthMutation(mutations.CREATE_DELIST_TX);
  const [GET_ME_BID_TRANSACTION_INSTRUCTIONS] = useAuthMutation(
    mutations.GET_ME_BID_TRANSACTION_INSTRUCTIONS
  );
  const [GET_ME_LIST_TRANSACTION_INSTRUCTIONS] = useAuthMutation(
    mutations.GET_ME_LIST_TRANSACTION_INSTRUCTIONS
  );
  const [GET_ME_DELIST_TRANSACTION_INSTRUCTIONS] = useAuthMutation(
    mutations.GET_ME_DELIST_TRANSACTION_INSTRUCTIONS
  );
  const [GET_ETH_NFT] = useAuthLazyQuery(queries.GET_ETH_NFT);
  const [GET_MP_ACTIVITIES] = useAuthLazyQuery(queries.GET_MP_ACTIVITIES);
  const [GET_LISTING_BY_SYMBOL] = useAuthLazyQuery(
    queries.GET_LISTING_BY_SYMBOL
  );
  const [GET_LISTING_BY_MINT] = useAuthLazyQuery(queries.GET_LISTING_BY_MINT);

  const [GET_COLLECTION_HISTORY] = useAuthLazyQuery(
    queries.GET_COLLECTION_HISTORY
  );

  // Tokens
  const [GET_TOKEN_HISTORY] = useAuthLazyQuery(queries.GET_TOKEN_HISTORY);
  const [GET_TOKEN_STATE] = useAuthLazyQuery(queries.GET_TOKEN_STATE);

  const [GET_ME_TOKEN_OFFER_RECEIVED] = useAuthLazyQuery(
    queries.GET_ME_TOKEN_OFFER_RECEIVED
  );
  const [GET_COIN_INFO] = useLazyQuery(queries.GET_COIN_INFO);
  const [GET_COINS_MARKET_CHART] = useAuthLazyQuery(
    queries.GET_COINS_MARKET_CHART
  );
  const [GET_MARKET_COINS] = useLazyQuery(queries.GET_MARKET_COINS);

  const [GET_COIN_HISTORY] = useAuthLazyQuery(queries.GET_COIN_HISTORY);

  const [GET_NFTS_BY_MINT] = useAuthLazyQuery(queries.GET_NFTS_BY_MINT);

  const [GET_ACCOUNT_TOKENS] = useAuthLazyQuery(queries.GET_ACCOUNT_TOKENS);
  const [GET_SIMPLE_PRICE] = useAuthLazyQuery(queries.GET_SIMPLE_PRICE);

  // Workspaces
  const [GET_WORKSPACES_COUNT] = useLazyQuery(queries.GET_WORKSPACES_COUNT);
  const [GET_ALL_WORKSPACES] = useLazyQuery(queries.GET_ALL_WORKSPACES);
  const [GET_ALL_WORKSPACES_BY_USER] = useLazyQuery(
    queries.GET_ALL_WORKSPACES_BY_USER
  );
  const [GET_WORKSPACE_BY_NAME] = useLazyQuery(queries.GET_WORKSPACE_BY_NAME);
  const [GET_WORKSPACE_BY_ID] = useLazyQuery(queries.GET_WORKSPACE_BY_ID);

  const [CREATE_WORKSPACE] = useAuthMutation(mutations.CREATE_WORKSPACE);
  const [UPDATE_WORKSPACE] = useAuthMutation(mutations.UPDATE_WORKSPACE);
  const [ADD_USER] = useAuthMutation(mutations.ADD_USER);
  const [SET_MULTISIG] = useAuthMutation(mutations.SET_MULTISIG);
  const [DELETE_USER] = useAuthMutation(mutations.DELETE_USER);

  const [CREATE_PROJECT_WALLET] = useAuthMutation(
    mutations.CREATE_PROJECT_WALLET
  );
  const [GET_WALLETS] = useAuthLazyQuery(queries.GET_WALLETS);
  const [WITHDRAW] = useAuthMutation(mutations.WITHDRAW);
  const [GET_EMPLOYEES] = useAuthLazyQuery(queries.GET_EMPLOYEES);
  const [ADD_CLAIMER] = useAuthMutation(mutations.ADD_CLAIMER);
  const [DELETE_CLAIMER] = useAuthMutation(mutations.DELETE_CLAIMER);
  const [CLAIM] = useAuthMutation(mutations.CLAIM);
  const [GET_CLAIMER] = useAuthLazyQuery(queries.GET_CLAIMER);

  const [CREATE_CONFIG] = useAuthMutation(mutations.CREATE_CONFIG);

  const [GET_NOTIFICATIONS] = useAuthLazyQuery(queries.GET_NOTIFICATIONS);

  const csrf = async () => {
    const {
      data: { token },
    } = await axios.get(`${hubSvcPath}/csrf`);
    setCsrfToken(token);
    return token;
  };

  const agCsrf = async () => {
    const {
      data: { token },
    } = await axios.get(`${agSvcPath}/csrf`);
    setAgToken(token);
    return token;
  };

  const ethCsrf = async () => {
    const {
      data: { token },
    } = await axios.get(`${ethSvcPath}/csrf`);
    setEthToken(token);
    return token;
  };

  const getCollectionStats = async (variables: { symbol: string }) => {
    const { data } = await GET_COLLECTION_STATS({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getStats || [];
  };
  const getMarketplaceSnapshot = async (variables: {
    tokenAddresses?: string[];
    has_metadata?: boolean;
    onlyListings?: boolean;
    field_name?: string;
    sort_order?: string;
    page_number?: number;
    page_size?: number;
    progressive_load?: boolean;
    chain?: string;
    projects?: any[];
  }) => {
    const { data } = await GET_MARKETPLACE_SNAPSHOT({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getMarketplaceSnapshot || {};
  };

  const getSiteStats = async () => {
    const { data } = await GET_SITE_STATS({
      fetchPolicy: "network-only",
    });
    return data?.getSiteStats || {};
  };

  const getLeaderboards = async (variables: {
    condition: {
      volume_1day: number;
    };
  }) => {
    const { data } = await GET_LEADERBOARDS({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getLeaderboards || {};
  };

  const getYakuStats = async () => {
    const { data } = await GET_YAKU_STATS({
      fetchPolicy: "network-only",
    });
    return data?.getYakuCollectionsStats || {};
  };

  const getNFTsByOwner = async (variables: { wallet: string | string[] }) => {
    const { data } = await GET_NFTS_BY_WALLET({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getWallet || [];
  };

  const getToken = async (variables: { mint: string }) => {
    const { data } = await GET_TOKEN_BY_MINT({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getTokenByMint || {};
  };
  const getProjectStats = async (variables: {
    field_name?: string;
    projectIds?: string[];
    sort_order?: string;
    page_number?: number;
    page_size?: number;
    chain?: string;
    onlyListings?: boolean;
    tags?: string[];
  }) => {
    if (variables.chain === "ETH") {
      const { chain, projectIds, onlyListings, page_number } = variables;
      const { data } = await GET_PROJECTS_STATS({
        variables: { chain, projectIds, onlyListings, page_number },
        fetchPolicy: "network-only",
      });
      return data?.getProjectStats || {};
    }
    const {
      chain,
      projectIds,
      onlyListings,
      field_name = "market_cap",
      sort_order = "DESC",
      page_number = 1,
      page_size = 50,
      tags,
    } = variables;
    if (chain === "All") {
      const { data } = await axios.post(`${hubSvcPath}/projects/stats`, {
        condition: {
          tags,
        },
        orderBy: {
          field_name,
          sort_order,
        },
      });
      return data;
    }
    const { data } = await GET_PROJECTS_STATS({
      variables: {
        chain,
        projectIds,
        onlyListings,
        field_name,
        sort_order,
        page_number,
        page_size,
        tags,
      },
      fetchPolicy: "network-only",
    });
    return data?.getProjectStats || {};
  };

  const getSolProjectData = async (variables: {
    projectIds: string[];
    chain?: string;
  }) => {
    const { data } = await GET_PROJECT_NAME({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getProjectStats || {};
  };
  const searchProjectByName = async (variables: {
    condition: {
      meSlug: {
        operation: string;
        value: string;
      };
    };
  }) => {
    const { data } = await SEARCH_PROJECT_BY_NAME({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.searchProjectByName || {};
  };

  const getSubwallet = async (variables: { user: string }) => {
    const { data } = await GET_ALL_SUBWALLET({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getAllLinkedWallet || [];
  };
  const linkWallet = async (variables: { user: string; wallet: string }) => {
    const { data } = await LINK_WALLET({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.linkWallet || "";
  };

  const unlinkWallet = async (variables: { user: string; wallet: string }) => {
    const { data } = await UNLINK_WALLET({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.unlinkWallet || "";
  };

  const getWorkpacesCount = async (variables: { owner: string }) => {
    const { data } = await GET_WORKSPACES_COUNT({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getWorkspacesCount || 0;
  };

  const getAllWorkspaces = async (variables: { owner: string }) => {
    const { data } = await GET_ALL_WORKSPACES({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getAllWorkspaces || [];
  };

  const getAllWorkspacesByUser = async (variables: { user: string }) => {
    const { data } = await GET_ALL_WORKSPACES_BY_USER({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getAllWorkspacesByUser || [];
  };

  const getWorkspaceByName = async (variables: {
    owner: string;
    name: string;
  }) => {
    const { data } = await GET_WORKSPACE_BY_NAME({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getWorkspaceByName || {};
  };

  const getWorkspaceById = async (variables: { id: string }) => {
    const { data } = await GET_WORKSPACE_BY_ID({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getWorkspaceById || {};
  };

  const createWorkspace = async (variables: {
    owner: string;
    name: string;
    description?: string;
    image?: string;
    website?: string;
    twitter?: string;
    discord?: string;
    token?: string;
    users: any[];
  }) => {
    const { data } = await CREATE_WORKSPACE({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.createWorkspace || {};
  };

  const updateWorkspace = async (variables: {
    id: string;
    owner: string;
    name: string;
    description?: string;
    image?: string;
    website?: string;
    twitter?: string;
    discord?: string;
    token?: string;
    users: any[];
  }) => {
    const { data } = await UPDATE_WORKSPACE({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.updateWorkspace || {};
  };

  const addUser = async (variables: {
    id: string;
    user: { address: string; role: string; claimer?: string };
  }) => {
    const { data } = await ADD_USER({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.addUser || {};
  };
  const setMultisig = async (variables: {
    id: string;
    owner: string;
    multisig: string;
  }) => {
    const { data } = await SET_MULTISIG({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.setMultisig || {};
  };
  const deleteUser = async (variables: { id: string; address: string }) => {
    const { data } = await DELETE_USER({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.deleteUser || {};
  };

  const login = async ({
    wallet,
    ethAddress,
  }: {
    wallet?: string;
    ethAddress?: string;
  }) => {
    if (!wallet && !ethAddress) {
      throw new Error("Please provide Wallet address.");
    }
    const { data } = await LOG_IN({
      variables: { wallet, ethAddress },
      fetchPolicy: "network-only",
    });
    return data?.login || {};
  };
  const signup = async ({
    wallet,
    vanity,
  }: {
    wallet?: string;
    vanity?: string;
  }) => {
    if (!wallet && !vanity) {
      throw new Error("Please provide Information.");
    }
    const { data } = await SIGN_UP({
      variables: { wallet, vanity },
      fetchPolicy: "network-only",
    });
    return data?.signup || {};
  };
  const connectDiscord = async (variables: {
    address: string;
    code: string;
    redirectUri: string;
  }) => {
    const { data } = await DISCORD_AUTH({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.discordAuth || {};
  };
  const connectTwitter = async (variables: {
    address: string;
    code: string;
    redirectUri: string;
  }) => {
    const { data } = await TWITTER_AUTH({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.linkTwitter || {};
  };
  const getDiscordAuthLink = async (variables: { redirectUri: string }) => {
    const { data } = await GET_DISCORD_LINK({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getDiscordConnectURL || "";
  };
  const getTwitterAuthLink = async (variables: {
    address: string;
    redirectUri: string;
  }) => {
    const { data } = await GET_TWITTER_LINK({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getTwitterAuth || "";
  };
  const getMETransactionInstructions = async (variables: {
    buyer: string;
    tokenMint: string;
  }) => {
    const { data } = await GET_ME_TRANSACTION_INSTRUCTIONS({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getMETransactionInstructions;
  };
  const getWithdrawTx = async (variables: { buyer: string; amount: any }) => {
    const { data } = await GET_ME_WITHDRAW_TRANSACTION_INSTRUCTIONS({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getMEWithdrawTransactionInstructions;
  };
  const createBuyTx = async (variables: {
    buyerAddress: string;
    tokens?: string[];
    chain?: string;
    price: Number;
    tokenAddress: string;
    buyerBroker?: string;
  }) => {
    const { data } = await CREATE_BUY_TX({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.createBuyTx;
  };
  const creatDelistTx = async (variables: {
    sellerAddress: string;
    tokenAddress: string;
  }) => {
    const { data } = await CREATE_DELIST_TX({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.creatDelistTx;
  };
  const getMEBidTransactionInstructions = async (variables: {
    buyer: string;
    tokenMint: string;
    price: number;
  }) => {
    const { data } = await GET_ME_BID_TRANSACTION_INSTRUCTIONS({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getMEBidTransactionInstructions;
  };
  const getMEListTransactionInstructions = async (variables: {
    seller: string;
    tokenMint: string;
    price: number;
  }) => {
    const { data } = await GET_ME_LIST_TRANSACTION_INSTRUCTIONS({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getMEListTransactionInstructions;
  };
  const getMEDelistTransactionInstructions = async (variables: {
    seller: string;
    tokenMint: string;
  }) => {
    const { data } = await GET_ME_DELIST_TRANSACTION_INSTRUCTIONS({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getMEDelistTransactionInstructions;
  };
  const getMEListings = async (variables: {
    symbol: string;
    offset?: number;
    limit?: number;
  }) => {
    const { data } = await GET_LISTING_BY_SYMBOL({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getListingBySymbol;
  };
  const getMEListingsByMint = async (variables: { mint: string }) => {
    const { data } = await GET_LISTING_BY_MINT({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getListingByMint;
  };

  const getCollectionHistory = async (variables: { condition: any }) => {
    const { data } = await GET_COLLECTION_HISTORY({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getProjectStatHistory?.project_stat_hist_entries || [];
  };

  const getCoinInfo = async (variables: { coinId: string }) => {
    const { data } = await GET_COIN_INFO({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.fetchCoin || {};
  };

  const getCoinHistory = async (variables: {
    coinId: string;
    params: {
      date: string;
    };
  }) => {
    const { data } = await GET_COIN_HISTORY({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.fetchHistory || {};
  };

  const getTokenChart = async (variables: {
    coinId: string;
    params: { vs_currency: string; days: string };
  }) => {
    const { data } = await GET_COINS_MARKET_CHART({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.fetchMarketChart || {};
  };

  const getTokenStats = async (variables: {
    params: {
      category: string;
      order: string;
      page: number;
      per_page: number;
      vs_currency: string;
      sparkline: boolean;
      price_change_percentage: string;
    };
  }) => {
    const { data } = await GET_MARKET_COINS({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.marketsCoins || {};
  };

  const getAccountTokens = async (variables: { account: string }) => {
    const { data } = await GET_ACCOUNT_TOKENS({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getAccountTokens || [];
  };

  const getSimplePrice = async (variables: {
    params: {
      ids: string;
      vs_currencies: string;
    };
  }) => {
    const { data } = await GET_SIMPLE_PRICE({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.simplePrice?.data || {};
  };

  const getWalletHist = async (variables: {
    condition: {
      searchAddress: string;
      dayLookback: "MONTH" | "SEVEN_DAY";
    };
  }) => {
    const { data } = await GET_WALLET_HIST({
      variables,
      fetchPolicy: "network-only",
    });
    return data.getWalletStatsHist;
  };

  const getUserProfile = async (variables: { pubkey: string }) => {
    const { data } = await GET_CORAL_USER_PROFILE({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getUserProfile || {};
  };

  const getWalletStats = async (variables: {
    condition: {
      searchAddress: string;
      timePeriod: string;
      includeUserRank: boolean;
    };
  }) => {
    const { data } = await GET_WALLET_STATS({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getWalletStats || {};
  };

  const getWalletActivities = async (variables: {
    wallet: any;
    offset?: number;
    limit?: number;
  }) => {
    const { data } = await GET_WALLET_ACTIVITIES({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getWalletActivities || {};
  };

  const getWalletTokens = async (variables: {
    wallet: string;
    offset: number;
    limit: number;
  }) => {
    const { data } = await GET_WALLET_TOKENS({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getWalletTokens || {};
  };

  const getUserListings = async (variables: {
    condition: {
      userAddress: string;
    };
  }) => {
    const { data } = await GET_USER_LISTINGS({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getUserListings;
  };

  const getTokensHist = async (variables: {
    condition: {
      tokenAddresses: string[];
      actionType?: string;
    };
  }) => {
    const { data } = await GET_TOKEN_HISTORY({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getTokenHistory;
  };

  const getTokenState = async (variables: {
    condition: {
      tokenAddresses: string[];
    };
  }) => {
    const { data } = await GET_TOKEN_STATE({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getTokenState || [];
  };

  const getMETokenOffers = async (variables: { mint: string }) => {
    const { data } = await GET_ME_TOKEN_OFFER_RECEIVED({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getMETokenOfferReceived || [];
  };

  const refreshETHMetadata = async (address: string, tokenId: string) => {
    const token: any = !csrfToken ? await csrf() : csrfToken;
    const { data } = await axios.post(
      `${hubSvcPath}/user/eth/nft/refresh`,
      {
        address,
        tokenId,
      },
      {
        headers: {
          "csrf-token": token,
        },
      }
    );
    return data;
  };
  const getETHProjectData = async (variables: {
    projectIds: string[];
    tokenId: string;
  }) => {
    const { data } = await GET_ETH_NFT({
      variables,
      fetchPolicy: "network-only",
    });

    return data?.getNFTStats;
  };
  const getMPActivities = async (variables: {
    condition: {
      projects: [{ project_id: any; attributes?: any[] }];
      actionTypes: string[];
    };
    paginationInfo: {
      page_number: number;
      page_size: number;
    };
  }) => {
    const { data } = await GET_MP_ACTIVITIES({
      variables,
      fetchPolicy: "network-only",
    });

    return data?.getMarketplaceActivities?.market_place_snapshots;
  };
  const getRaffles = async (wallet: string) => {
    const { data } = await axios.post(`${nftSvcPath}/raffle`, {
      wallet,
    });
    return data;
  };
  const fetchMetadatas = async (variables: { mint: string | string[] }) => {
    const { data } = await GET_NFTS_BY_MINT({
      variables,
      fetchPolicy: "cache-and-network",
    });
    return (data?.fetch || []) as NFTMetadataType[];
  };

  const getMEEscrowBalance = async (variables: { wallet: string }) => {
    const { data } = await GET_ME_ESCROW_BALANCE({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getMEEscrowBalance;
  };

  const getWalletNfts = async (address: string) => {
    const token: any = !csrfToken ? await csrf() : csrfToken;
    const { data } = await axios.post(
      `${hubSvcPath}/user/eth/nfts/fetch`,
      { address },
      {
        headers: {
          "csrf-token": token,
        },
      }
    );
    return data;
  };

  const getWalletProfile = async (wallet: string, chain = "SOL") => {
    const token: any = !csrfToken ? await csrf() : csrfToken;
    const params: any = {
      picks: ["user", "staked", "collections", "eth", "communities"],
    };
    if (chain === "SOL") {
      params.wallet = wallet;
    } else if (chain === "ETH") {
      params.ethAddress = wallet;
    }
    const { data } = await axios.post(
      `${hubSvcPath}/user/wallet/profile`,
      params,
      {
        headers: {
          "csrf-token": token,
        },
      }
    );
    return data;
  };

  const getCollectionsByWallet = async (wallet: string) => {
    const token: any = !csrfToken ? await csrf() : csrfToken;
    const { data } = await axios.get(
      `${hubSvcPath}/wallet/${wallet}/collections`,
      {
        headers: {
          "csrf-token": token,
        },
      }
    );
    return data;
  };

  const getInspectorCollection = async (symbol: string, chain: string) => {
    const { data } = await axios.post(`${ethSvcPath}/collection/rank`, {
      symbol,
      chain,
    });
    return data;
  };

  const getInspectorCollections = async (chain: string, symbols?: string[]) => {
    const { data } = await axios.post(`${ethSvcPath}/collections/rank`, {
      symbols,
      chain,
    });
    return data;
  };

  const getInspectorCollectionMembers = async (
    symbol: string,
    chain: string,
    offset = 0,
    limit = 20
  ) => {
    const { data } = await axios.post(`${ethSvcPath}/collection/members`, {
      symbol,
      chain,
      limit,
      offset,
    });
    return data?.members;
  };

  const getCollection = async (symbol: string) => {
    const token: any = !csrfToken ? await csrf() : csrfToken;
    const { data = {} } = await axios.post(
      `${hubSvcPath}/collection`,
      { symbol },
      {
        headers: {
          "csrf-token": token,
        },
      }
    );
    return data;
  };

  const getTwitterFollowed = async (username: string, target: string) => {
    const token: any = !csrfToken ? await csrf() : csrfToken;
    const { data } = await axios.get(
      `${hubSvcPath}/twitter/username/${username}/is-following/target-username/${target}`,
      {
        headers: {
          "csrf-token": token,
        },
      }
    );
    return data;
  };

  const createProjectWallet = async (variables: {
    project: string;
    wallet: string;
  }) => {
    const { data } = await CREATE_PROJECT_WALLET({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.createWallet;
  };

  const getProjectWallets = async (variables: { wallet: string }) => {
    const { data } = await GET_WALLETS({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getWallets || [];
  };

  const clickWithdraw = async (variables: {
    project: string;
    method: string;
    amount: number;
  }) => {
    const { data } = await WITHDRAW({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.clickWithdraw;
  };

  const getEmployees = async (variables: {
    project: string;
    employer: string;
  }) => {
    const { data } = await GET_EMPLOYEES({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getEmployees || [];
  };

  const createClaimer = async (variables: {
    project: string;
    name: string;
    method: string;
    amount: string;
    wallet: string;
    period: string;
    time: string;
    employer: string;
  }) => {
    const { data } = await ADD_CLAIMER({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.createClaimer;
  };

  const deleteClaimer = async (variables: {
    project: string;
    name: string;
    wallet: string;
    employer: string;
  }) => {
    const { data } = await DELETE_CLAIMER({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.deleteClaimer;
  };

  const clickClaim = async (variables: {
    project: string;
    wallet: string;
    method: string;
    employer: string;
  }) => {
    const { data } = await CLAIM({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.clickClaim;
  };

  const getClaimer = async (variables: { wallet: string }) => {
    const { data } = await GET_CLAIMER({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.getClaimer;
  };

  const initMsTx = async (payload: {
    msPDA: string;
    creator: string;
    owner: string;
    workspace: string;
    type: string;
    pubkey: string;
    description: string;
    mint?: string;
  }) => {
    const token: any = !csrfToken ? await csrf() : csrfToken;
    const { data } = await axios.post(
      `${hubSvcPath}/multisig/tx/init`,
      payload,
      {
        headers: {
          "csrf-token": token,
        },
      }
    );
    return data;
  };

  const updateMsTx = async (payload: {
    id: string;
    executedAt?: string;
    signature?: string;
    error?: string;
  }) => {
    const token: any = !csrfToken ? await csrf() : csrfToken;
    const { data } = await axios.post(
      `${hubSvcPath}/multisig/tx/update`,
      payload,
      {
        headers: {
          "csrf-token": token,
        },
      }
    );
    return data;
  };

  const getMsTx = async (multisig: string, skip: number, limit = 10) => {
    const { data } = await axios.post(`${nftSvcPath}/multisig/tx`, {
      multisig,
      skip,
      limit,
    });
    return data;
  };

  const getEthGas = async () => {
    const { data } = await axios.get(`${ethSvcPath}/gas`);
    return data;
  };

  const createAppConfig = async (variables: {
    config: any;
    owner: string;
    workspace: string;
    signature: string;
    type: string;
    domain: string;
  }) => {
    const { data } = await CREATE_CONFIG({
      variables,
      fetchPolicy: "network-only",
    });
    return data?.createConfig;
  };

  const getSocialWallets = async (wallets: string[]) => {
    if (!wallets) {
      return [];
    }
    const token: any = !csrfToken ? await csrf() : csrfToken;
    const { data } = await axios.post(
      `${hubSvcPath}/social/wallets`,
      { wallets },
      {
        headers: {
          "csrf-token": token,
        },
      }
    );
    return data || [];
  };

  const getNFTLeaderBoards = async () => {
    const { data } = await axios.post(`${nftSvcPath}/leaderboard/top10`, {});
    return data || {};
  };

  const getYakuTowersInfo = async () => {
    const data = [
      {
        name: "Yaku Motors",
        image: "https://s3.amazonaws.com/img.yaku.ai/estates/yakumotors.png",
        type: "Shop",
        surface: 1080,
      },
      {
        name: "Bored Ape Yacht Club",
        image: "https://s3.amazonaws.com/img.yaku.ai/APE.png",
        type: "Tower",
        height: 700,
      },
      {
        name: "Toy's R",
        image: "https://s3.amazonaws.com/img.yaku.ai/estates/toys.png",
        type: "Shop",
        surface: 1746,
      },
      {
        name: "Mad Lads",
        image: "https://s3.amazonaws.com/img.yaku.ai/MadShop.png",
        type: "Shop",
        surface: 2500,
      },
      {
        name: "Honda",
        image: "https://s3.amazonaws.com/img.yaku.ai/estates/honda.png",
        type: "Ads",
        surface: 1746,
      },
      {
        name: "Monke DAO",
        image: "https://yakuapp.s3.amazonaws.com/img/smb2.png",
        type: "Tower",
        height: 757,
        location: "Downtown Piers",
      },
      {
        name: "PopHeads",
        image:
          "https://bafybeigaq3x3iz3v24qjnv26ql7c7fstll6reolqbxkpncpbpa23bovgva.ipfs.dweb.link/",
        type: "Tower",
        height: 900,
        location: "Funfair",
      },
    ];
    return data;
  };

  const getDashboardSlides = async () => {
    const data = {
      delay: 83000,
      slides: [
        {
          title: "",
          type: "video",
          mobileSrc: "https://s3.amazonaws.com/img.yaku.ai/YakuCombat.mp4",
          src: "https://s3.amazonaws.com/img.yaku.ai/YakuCombat.mp4",
        },
        //{
        //     title: '',
        //     type: 'image',
        //     mobileSrc: 'https://s3.amazonaws.com/img.yaku.ai/logos/Background_motor.png',
        //     src: 'https://s3.amazonaws.com/img.yaku.ai/logos/Background_motor.png'
        // }
        // {
        //     title: '',
        //     type: 'image',
        //     mobileSrc: 'https://ik.imagekit.io/g1noocuou2/3D_Development2.png?tr=w-800',
        //     src: 'https://ik.imagekit.io/g1noocuou2/3D_Development2.png?tr=w-1920'
        // },
        // {
        //     title: '',
        //     type: 'image',
        //     mobileSrc: 'https://ik.imagekit.io/g1noocuou2/3D_Development3.png?tr=w-800',
        //     src: 'https://ik.imagekit.io/g1noocuou2/3D_Development3.png?tr=w-1920'
        // },
        // {
        //     title: '',
        //     type: 'image',
        //     mobileSrc: 'https://ik.imagekit.io/g1noocuou2/3D_Development4.png?tr=w-800',
        //     src: 'https://ik.imagekit.io/g1noocuou2/3D_Development4.png?tr=w-1920'
        // }
      ],
    };
    return data;
  };

  const getCollectionsFP = async (symbols: string[]) => {
    const token: any = !agToken ? await agCsrf() : agToken;
    const { data } = await axios.post(
      "https://ag.yaku.ai/api/me/collections/fp",
      { collectionSymbols: symbols },
      {
        headers: {
          "csrf-token": token,
        },
      }
    );
    return data;
  };

  const getETHWalletTransactions = async (wallet: string) => {
    const token: any = !ethToken ? await ethCsrf() : ethToken;
    const { data } = await axios.post(
      `${ethSvcPath}/wallet/tx`,
      { wallet },
      {
        headers: {
          "csrf-token": token,
        },
      }
    );
    return data;
  };

  const getETHWalletNFTs = async (wallet: string) => {
    const token: any = !ethToken ? await ethCsrf() : ethToken;
    const { data } = await axios.post(
      `${ethSvcPath}/metadata/wallet`,
      { wallet },
      {
        headers: {
          "csrf-token": token,
        },
      }
    );
    return data;
  };

  const getETHTokens = async (wallet: string) => {
    const token: any = !ethToken ? await ethCsrf() : ethToken;
    const { data } = await axios.post(
      `${ethSvcPath}/wallet/tokens`,
      { wallet },
      {
        headers: {
          "csrf-token": token,
        },
      }
    );
    return data;
  };
  const getETHENS = async (wallet: string) => {
    const token: any = !ethToken ? await ethCsrf() : ethToken;
    const { data } = await axios.post(
      `${ethSvcPath}/wallet/ens`,
      { wallet },
      {
        headers: {
          "csrf-token": token,
        },
      }
    );
    return data;
  };
  const getETHBalance = async (wallet: string) => {
    const token: any = !ethToken ? await ethCsrf() : ethToken;
    const { data } = await axios.post(
      `${ethSvcPath}/wallet/balance`,
      { wallet },
      {
        headers: {
          "csrf-token": token,
        },
      }
    );
    return data;
  };

  const getNotifications = async () => {
    const { data } = await GET_NOTIFICATIONS({
      fetchPolicy: "network-only",
    });
    return data?.getNotificationsByUserId || [];
  };

  const getPlayerInfo = (accessToken: string) => {
    const data = axios.post(`${playerPath}/me`, {
      accessToken,
    });
    return data;
  };

  const loginWithEpic = (epicId: string, email: string) => {
    const data = axios.post(`${playerPath}/login`, {
      epicId,
      email,
      deploymentId: "9dab2296580f4097abe81ed70879485c",
      credential: "",
    });
    return data;
  };

  const requestAuthentication = (
    type: string,
    address: string,
    email: string
  ) => {
    const data = axios.post(`${playerPath}/challenge`, {
      type,
      address,
      email,
    });
    return data;
  };

  const linkWalletToPlayer = (
    type: string,
    address: string,
    signature: string | Uint8Array,
    chain: string,
    id: string,
    accessToken: string
  ) => {
    const data = axios.post(`${playerPath}/link`, {
      type,
      address,
      signature,
      chain,
      id,
      accessToken,
    });
    return data;
  };

  return {
    csrf,
    csrfToken,
    getSiteStats,
    getLeaderboards,
    getYakuStats,
    login,
    signup,
    connectDiscord,
    connectTwitter,
    getDiscordAuthLink,
    getTwitterAuthLink,
    getSubwallet,
    linkWallet,
    unlinkWallet,
    getCollectionStats,
    getMarketplaceSnapshot,
    getNFTsByOwner,
    getWalletNfts,
    getWalletStats,
    getWalletProfile,
    getWalletActivities,
    getWalletTokens,
    getUserListings,
    getToken,
    getTokensHist,
    getTokenState,
    getProjectStats,
    searchProjectByName,
    getSolProjectData,
    getETHProjectData,
    getMPActivities,
    refreshETHMetadata,
    fetchMetadatas,
    getMETransactionInstructions,
    getWithdrawTx,
    createBuyTx,
    creatDelistTx,
    getMEBidTransactionInstructions,
    getMEListTransactionInstructions,
    getMEDelistTransactionInstructions,
    getMETokenOffers,
    getMEListings,
    getMEListingsByMint,
    getWorkpacesCount,
    getAllWorkspaces,
    getAllWorkspacesByUser,
    getWorkspaceByName,
    getWorkspaceById,
    createWorkspace,
    updateWorkspace,
    addUser,
    setMultisig,
    deleteUser,
    getCoinInfo,
    getCoinHistory,
    getTokenChart,
    getTokenStats,
    getAccountTokens,
    getSimplePrice,
    getUserProfile,
    getRaffles,
    getMEEscrowBalance,
    getCollection,
    getCollectionsByWallet,
    getCollectionHistory,
    getInspectorCollection,
    getInspectorCollections,
    getInspectorCollectionMembers,
    getTwitterFollowed,
    getWalletHist,
    createProjectWallet,
    getProjectWallets,
    clickWithdraw,
    getEmployees,
    createClaimer,
    deleteClaimer,
    clickClaim,
    getClaimer,
    initMsTx,
    updateMsTx,
    getMsTx,
    getEthGas,
    createAppConfig,
    getSocialWallets,
    getNFTLeaderBoards,
    getYakuTowersInfo,
    getDashboardSlides,
    getCollectionsFP,
    getETHWalletTransactions,
    getETHWalletNFTs,
    getETHENS,
    getETHTokens,
    getETHBalance,
    getNotifications,
    getPlayerInfo,
    loginWithEpic,
    requestAuthentication,
    linkWalletToPlayer,
  };
}
