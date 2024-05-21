/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  cloneDeep,
  filter,
  find,
  first,
  get,
  groupBy,
  isEmpty,
  isNaN,
  isString,
  map,
  orderBy,
  round,
  slice,
  sum,
  uniqBy,
} from "lodash";

import { Tooltip } from "@material-tailwind/react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

import { InfoCircleOutlined } from "@ant-design/icons";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useSolPrice } from "@/contexts/CoinGecko";

import { queries } from "@/graphql/graphql";

import useAuth from "@/hooks/useAuth";
import useAuthQuery from "@/hooks/useAuthQuery";
import useStaked from "@/hooks/useStaked";
import { useRequests } from "@/hooks/useRequests";
import useAuthLazyQuery from "@/hooks/useAuthLazyQuery";

import { NFTMetadataType } from "@/types/nfts";

import { DomainByWallet, retrieveBatch } from "@/utils/bonfida";

import TitlebarImageList from "./TitlebarImageList";
import TokenPortfolioItem from "./TokenPortfolioItem";
import TokensView from "./TokensView";
import MEActivitiesList from "./MEActivitiesList";
import DomainItems from "./DomainItems";

const NFTCollectionsView = ({
  wallet,
  nfts,
  ethNfts = [],
  setOwnedNftCount,
  setNetWorth,
  setOwnedCollections,
}: {
  wallet: string;
  nfts: { staked: any[]; nftsList: any[] };
  ethNfts: any[];
  setOwnedNftCount: Dispatch<SetStateAction<number>>;
  setNetWorth: Dispatch<SetStateAction<number>>;
  setOwnedCollections?: Dispatch<SetStateAction<any[]>>;
}) => {
  const solPrice = useSolPrice();
  const { yakusFP, getStats } = useStaked();
  const auth = useAuth();
  const navigate = useNavigate();
  const { fetchMetadatas, getUserListings, getUserProfile } = useRequests();
  const [nftList, setNftList] = useState<any>([]);
  const [collections, setCollections] = useState<any>([]);
  const [ethCollections, setEthCollections] = useState<any>([]);
  const [listings, setListings] = useState<any>([]);
  const [tokensHist, setTokensHist] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(false);

  const [tabIdx, setTabIdx] = useState("Collections");

  const [getTokensHist] = useAuthLazyQuery(queries.GET_TOKEN_HISTORY);

  const getUserProfileNFTs = async (pubkey: string) => {
    const profileData = await getUserProfile({
      pubkey,
    });
    return profileData;
  };

  const concatCollections = async (nftsList: any[]) => {
    let fps = yakusFP;
    if (!fps || isEmpty(fps)) {
      ({ yakusFP: fps } = await getStats());
    }
    const collectionsGroup = groupBy(nftsList, "collectionName");
    const nftsCollection = map(
      Object.keys(collectionsGroup),
      (collection: string) => {
        const list = collectionsGroup[collection];
        const items = map(list, (itm: any) => {
          const staked = !!find(nfts.staked, ({ mint }) => mint === itm.mint);
          const result: any = cloneDeep(itm);
          if (staked) {
            if (!result.collection) {
              result.collection = { name: itm?.name?.split(" #")[0] };
              result.project_id = "yakux";
            } else {
              result.project_id =
                result.collection?.name === "Capsule X"
                  ? "capsulex"
                  : "yakucorp1";
            }
          }
          return {
            ...result,
            floor_price:
              (fps[result.project_id] || result.floor_price) / LAMPORTS_PER_SOL,
            price: result.price ? result.price / LAMPORTS_PER_SOL : undefined,
            listed: !!result.price,
            staked,
            owner: wallet,
            collection_symbol: result.project_id || result.collection_symbol,
          };
        });
        const firstItem = first(items);
        return {
          collection: collection || firstItem.name,
          image: firstItem.image || firstItem.original_image,
          video: firstItem.animation_url,
          count: list.length,
          items,
          floor_price: firstItem.floor_price || 0,
        };
      }
    );
    return {
      collections: nftsCollection,
    };
  };

  const getNFTMetas = async (tokens: any[]) => {
    if (!tokens || !tokens.length) {
      return [];
    }
    const metadatas: NFTMetadataType[] = await fetchMetadatas({
      mint: map(tokens, ({ mint }) => mint),
    });
    const processedList = map(metadatas, (item) => {
      const { metadata, mint } = item;
      const collection =
        metadata.collection ||
        (metadata.name.includes(" #")
          ? first(metadata.name.split(" #"))
          : metadata.symbol);
      const project = isString(collection)
        ? { name: collection }
        : {
            ...collection,
            name: get(collection, "name", get(collection, "family")),
          };

      return {
        ...metadata,
        ...(metadata.json || {}),
        mint,
        project,
      };
    });
    return processedList;
  };

  const getNFTs = async () => {
    if (!wallet || !nfts || (!nfts.staked?.length && !nfts.nftsList?.length)) {
      return;
    }
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      setNftList([]);
      setCollections([]);
      setTokensHist([]);
      getUserListings({
        condition: {
          userAddress: wallet,
        },
      }).then((listingData) =>
        setListings(listingData?.market_place_snapshots)
      );
      const fetchList = [...nfts.nftsList, ...nfts?.staked];
      const itemsList: any = map(await getNFTMetas(fetchList), (i) => ({
        ...i,
        collectionName: i.project?.name ?? "No Collection",
      }));
      const walletItemList = filter(
        map(await getUserProfileNFTs(wallet), (item) => ({
          ...item,
          collectionName: item.collection_name,
        })),
        ({ collectionName }) => !!collectionName
      );
      let fps = yakusFP;
      if (!fps || isEmpty(fps)) {
        ({ yakusFP: fps } = await getStats());
      }
      const mergedList = map(itemsList, (i) => {
        const found = find(walletItemList, (itm) => itm.mint === i.mint);
        const staked = !!find(
          nfts.staked,
          ({ mint: mintAddr }) => mintAddr === i.mint
        );
        let project_id = i.project_id;
        let collection = i.collection;
        if (staked) {
          if (!i.collection) {
            collection = { name: i.name?.split(" #")[0] };
            project_id = "yakux";
          } else {
            project_id =
              collection?.name === "Capsule X" ? "capsulex" : "yakucorp1";
          }
        }
        if (!found) {
          return {
            ...i,
            staked,
            floor_price: (fps[project_id || ""] || 0) / LAMPORTS_PER_SOL,
          };
        }
        return {
          ...found,
          ...i,
          project_id,
          collection,
          staked,
          floor_price:
            (fps[project_id || ""] || found.floor_price || 0) /
            LAMPORTS_PER_SOL,
        };
      });
      const { collections: collectionsList } = await concatCollections(
        mergedList
      );
      const sorted = orderBy(collectionsList, "floor_price", "desc");
      setCollections(sorted);
      const sortedList = orderBy(mergedList, "floor_price", "desc");
      setNftList(sortedList);
      if (setOwnedCollections) {
        setOwnedCollections(sorted);
      }
      setOwnedNftCount(sortedList.length);
      setNetWorth(
        Number(
          sum(map(sortedList, ({ floor_price = 0 }: any) => floor_price) || 0)
        )
      );

      await loadMoreTokensHist(sortedList, 0, 30);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreTokensHist = async (
    jsonNFTList: any[],
    start: number,
    end: number
  ) => {
    setIsLoading(true);
    try {
      const tokenAddresses = map(
        slice(jsonNFTList, start, end),
        ({ mint }) => mint
      );
      if (!tokenAddresses.length) {
        return;
      }
      const { data: histData } = await getTokensHist({
        variables: {
          condition: {
            tokenAddresses,
            actionType: "TRANSACTION",
          },
        },
      });
      if (histData?.getTokenHistory) {
        const histList = map(
          histData.getTokenHistory,
          ({ token_address, market_place_actions }) => {
            const found =
              find(jsonNFTList, (item) => item.mint === token_address) || {};
            const { block_timestamp, price, signature } =
              first<any>(market_place_actions);
            return {
              mint: token_address,
              image: found.image,
              name: found.name,
              floor_price: found.floor_price,
              collection:
                found.collectionName ||
                found.project?.display_name ||
                found.project?.name ||
                found.collection?.family ||
                found.collection?.name ||
                found.collection,
              blockTime: block_timestamp,
              buyIn: price,
              txHash: signature,
            };
          }
        );
        setTokensHist(uniqBy([...tokensHist, ...histList], "mint"));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabIdx(newValue);
  };

  // get domain data
  const [domainList, setDomainLst] = useState<DomainByWallet[]>([]);
  const getDomainsData = async () => {
    const domainData: any = await retrieveBatch(wallet);
    if (domainData && domainData.length !== 0) {
      setDomainLst(domainData);
    }
  };

  const getEthNfts = () => {
    if (ethNfts && ethNfts.length > 0) {
      const grouped = groupBy(ethNfts, "collection");
      const groupedCollections = map(grouped, (items, collection) => ({
        items,
        collection,
        count: items.length,
        image: first(items).image || "",
      }));
      console.log(groupedCollections);
      setEthCollections(groupedCollections);
    }
  };

  useEffect(() => {
    getDomainsData();
  }, [wallet]);
  useEffect(() => {
    if (auth.token) {
      getNFTs();
    }
  }, [nfts]);
  useEffect(() => {
    getEthNfts();
  }, [ethNfts]);

  return (
    <Tabs value={tabIdx}>
      <TabsHeader
        className="mt-2 xs:mb-2 md:mb-0 w-full"
        placeholder=""
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
        // onChange={handleTabChange}
        // variant="scrollable"
        // scrollButtons="auto"
        // textColor="secondary"
        // indicatorColor="secondary"
      >
        <Tab
          key="Collections"
          value="Collections"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Collections
        </Tab>
        {/* <Tab
          key="Items"
          value="Items"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Items
        </Tab> */}
        <Tab
          key="Domains"
          value="Domains"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Domains
        </Tab>
        {/* <Tab
          key="Listings"
          value="Listings"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Listings
        </Tab> */}
        <Tab
          key="Portfolio"
          value="Portfolio"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Portfolio
        </Tab>
        <Tab
          key="Tokens"
          value="Tokens"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Tokens
        </Tab>
        {/* <Tab
          key="Activities"
          value="Activities"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          Activities
        </Tab> */}
      </TabsHeader>
      <TabsBody
        placeholder=""
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        <TabPanel value="Collections" className="p-0 mt-2">
          {!isLoading || (collections && collections.length > 0) ? (
            <TitlebarImageList
              items={map(
                collections,
                ({
                  collection,
                  count,
                  items,
                  image,
                  symbol,
                  floor_price,
                  staked,
                }: any) => ({
                  title: collection,
                  img: image,
                  count,
                  items,
                  floor_price,
                  staked,
                  owner: wallet,
                })
              )}
              icon={
                <img
                  src="/images/blockchains/solana-icon.svg"
                  className="w-6 h-6 object-contain border-none bg-transparent"
                />
              }
              title="Collections"
              updateView={getNFTs}
              showSubItems
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((v) => (
                <div key={v} className="w-full h-full aspect-w-1 aspect-h-1">
                  <div className="w-full h-full bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-1">
            {!isLoading || (ethCollections && ethCollections.length > 0) ? (
              <TitlebarImageList
                items={map(
                  ethCollections,
                  ({ collection, count, items, image }: any) => ({
                    title: collection,
                    img: image,
                    count,
                    items,
                    chain: "ETH",
                  })
                )}
                icon={
                  <img
                    src="/images/blockchains/ethereum-icon.svg"
                    className="w-6 h-6 object-contain border-none bg-transparent"
                  />
                }
                title="Collections"
                showSubItems
                chain="ETH"
              />
            ) : (
              <div className="grid grid-cols-1 gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((v) => (
                  <div key={v} className="col-span-3">
                    <div className="skeleton rounded-full w-full h-full aspect-square"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabPanel>
        {/* <TabPanel value="Items" className="p-0 mt-2">
          {!isLoading || (nftList && nftList.length > 0) ? (
            <TitlebarImageList
              items={map(
                nftList,
                ({
                  name,
                  image,
                  mint,
                  project_id = "project",
                  floor_price = 0,
                  staked,
                  listStatus,
                }: any) => ({
                  title: name,
                  name,
                  img: image,
                  mint,
                  project_id,
                  price: floor_price,
                  staked,
                  listed: listStatus === "listed",
                  owner: wallet,
                })
              )}
              title="NFT"
              navigate={navigate}
              updateView={getNFTs}
              showActionButton
              showSendAndBurnButton
            />
          ) : (
            <div className="grid grid-cols-3 gap-1 mt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((v) => (
                <div key={v} className="col-span-3">
                  <div className="skeleton rounded-full w-full h-full aspect-square"></div>
                </div>
              ))}
            </div>
          )}
        </TabPanel> */}
        <TabPanel value="Domains" className="p-0 mt-2">
          <DomainItems domains={domainList} isLoading={isLoading} />
        </TabPanel>
        {/* <TabPanel value="Listings" className="p-0 mt-2">
          {!isLoading || (listings && listings.length > 0) ? (
            <TitlebarImageList
              items={map(
                listings,
                ({
                  meta_data_img,
                  name,
                  token_address,
                  project_id = "project",
                  market_place_state,
                }: any) => ({
                  title: name,
                  name,
                  img: get(
                    find(nftList, ({ mint }) => token_address === mint) || {},
                    "image",
                    meta_data_img
                  ),
                  mint: token_address,
                  project_id,
                  price: market_place_state.price,
                  owner: wallet,
                  listed: true,
                  marketplace_program_id:
                    market_place_state.marketplace_program_id,
                })
              )}
              title="Listings"
              navigate={navigate}
              updateView={getNFTs}
              showActionButton
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1 mt-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((v) => (
                <div key={v} className="aspect-w-1 aspect-h-1">
                  <div className="bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          )}
        </TabPanel> */}
        <TabPanel value="Portfolio">
          <div className="grid grid-cols-2">
            <Tooltip content="Net Worth is based on FP calculation.">
              <div className="flex justify-between items-center p-2 bg-primary-light dark:bg-opacity-85 rounded">
                <p>
                  Net Worth <InfoCircleOutlined />
                </p>
                <div className="flex gap-1">
                  <img
                    src="/images/blockchains/solana-icon.svg"
                    alt=""
                    className="w-4 h-4 object-contain border-none bg-transparent"
                  />
                  <p>
                    {!isLoading || !isEmpty(nftList) ? (
                      `${round(
                        Number(
                          sum(
                            map(
                              nftList,
                              ({ floor_price = 0 }) => floor_price
                            ) || 0
                          )
                        ),
                        2
                      ).toLocaleString()}`
                    ) : (
                      <span className="skeleton w-12 h-4"></span>
                    )}
                  </p>
                </div>
              </div>
            </Tooltip>
            <div className="w-full sm:w-[calc(460px/16*5.75)] flex justify-between items-center bg-primary-light dark:bg-[rgba(36, 24, 47, 0.85)] rounded-[.75rem] p-2">
              <p className="text-base font-medium">Est. Net Worth (USD)</p>
              <div className="flex gap-1">
                <p className="whitespace-nowrap">
                  {!isLoading || !isEmpty(nftList) ? (
                    `\$${round(
                      Number(
                        sum(
                          map(nftList, ({ floor_price = 0 }) => floor_price)
                        ) || 0
                      ) * solPrice,
                      2
                    ).toLocaleString()}`
                  ) : (
                    <div className="w-16 h-4 rounded"></div>
                  )}
                </p>
              </div>
            </div>
          </div>
          {!isLoading || (nftList && nftList.length > 0) ? (
            <ul>
              <li className="flex gap-1 justify-between">
                <div className="w-10"></div>
                <p className="w-[18%]">Name</p>
                <p className="w-[18%]">Collection</p>
                <p className="w-[12%] text-right">Buy In</p>
                <p className="w-[12%] text-right">Buy In (USD)</p>
                <p className="w-[12%] text-center">IRR</p>
                <p className="w-[14%]">Purchase time</p>
                <div className="w-5"></div>
              </li>
              {map(tokensHist, (item: any, idx) => (
                <TokenPortfolioItem key={idx} {...item} />
              ))}
              {isLoading && (
                <div className="h-4 bg-primary-light rounded-full overflow-hidden">
                  <div className="h-full bg-secondary"></div>
                </div>
              )}
              {tokensHist && nftList && tokensHist.length < nftList.length && (
                <button
                  className="w-full bg-transparent border border-secondary text-secondary hover:bg-secondary hover:text-white rounded-md px-4 py-2"
                  onClick={() =>
                    loadMoreTokensHist(
                      nftList,
                      tokensHist.length,
                      tokensHist.length + 30
                    )
                  }
                >
                  Load More
                </button>
              )}
            </ul>
          ) : (
            <div className="h-4 bg-primary-light rounded-full overflow-hidden">
              <div className="h-full bg-secondary"></div>
            </div>
          )}
        </TabPanel>
        <TabPanel value="Tokens">
          <TokensView wallet={wallet} tabIdx={tabIdx} />
        </TabPanel>
        {/* <TabPanel value="Activities">
          <MEActivitiesList wallet={wallet} tabIdx={tabIdx} />
        </TabPanel> */}
      </TabsBody>
    </Tabs>
  );
};

export default NFTCollectionsView;
