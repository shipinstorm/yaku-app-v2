/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from 'react-redux';
import { each, isEmpty, isPlainObject, map } from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import { useTheme } from '@mui/material/styles';
import { LinearProgress, useMediaQuery } from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';
import { setSubpage } from 'store/slices/subpageSlice';
import ActivityCardSkeleton from './ActivityCardSkeleton';
import ActivityCard from './ActivityCard';
import { useRequest } from 'ahooks';
import { useRequests } from 'hooks/useRequests';
import useLocalStorage from 'hooks/useLocalStorage';
import { useEffect } from 'react';

const ActivitiesViewList = ({ loadMore, hasNextPage, listData = [], isLoading, wallet, mobileActive, isMyActivity }: any) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { getSocialWallets } = useRequests();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
    const [cacheSocialWallets, setCacheSocialWallets] = useLocalStorage('socialWallets', {});

    const temp = [...listData];
    let activityData: any[] = [];
    let count;
    if (!matchUpMd && !mobileActive) {
        activityData = temp.splice(0, 2);
        count = 2;
    } else {
        activityData = [...temp];
        count = 10;
    }

    const { data: socialWallets, run } = useRequest(
        () => {
            const wallets: string[] = [];
            if (!listData || isEmpty(listData)) {
                return new Promise((resolve) => resolve([]));
            }
            each(activityData, (activity: any) => {
                if (isMyActivity && activity && activity.buyer && !wallets.includes(activity.buyer)) {
                    wallets.push(activity.buyer);
                }
                if (isMyActivity && activity && activity.seller && !wallets.includes(activity.seller)) {
                    wallets.push(activity.seller);
                }
                if (
                    !isMyActivity &&
                    activity &&
                    activity.market_place_state?.buyer_address &&
                    !wallets.includes(activity.market_place_state?.buyer_address)
                ) {
                    wallets.push(activity.market_place_state?.buyer_address);
                }
                if (
                    !isMyActivity &&
                    activity &&
                    activity.market_place_state?.seller_address &&
                    !wallets.includes(activity.market_place_state?.seller_address)
                ) {
                    wallets.push(activity.market_place_state?.seller_address);
                }
            });
            if (!wallets || isEmpty(wallets)) {
                return new Promise((resolve) => resolve([]));
            }
            return getSocialWallets(wallets);
        },
        {
            cacheKey: 'socialWallets',
            setCache: (data) => setCacheSocialWallets(data),
            getCache: () => cacheSocialWallets,
            manual: true
        }
    );

    useEffect(() => {
        if (listData && listData.length > 0) {
            run();
        }
    }, [listData]);

    return (
        <section className="activity-box bg-elevation1 flex-shrink-0 rounded-3xl shadow-sm">
            <div className="h-full p-4 overflow-auto" id="activities-view-list">
                <div className="flex items-center justify-between">
                    <h2 className="text-primary text-lg font-bold">Recent activity</h2>
                    {!matchUpMd && !mobileActive && (
                        <button
                            type="button"
                            className="flex items-center bg-transparent"
                            onClick={() => dispatch(setSubpage('Activities'))}
                        >
                            <p>View Detail</p>
                            <ArrowForwardIos sx={{ fontSize: 16 }} />
                        </button>
                    )}
                </div>
                <InfiniteScroll
                    loadMore={loadMore}
                    hasMore={(matchUpMd || mobileActive) && !isLoading && hasNextPage}
                    loader={<LinearProgress key="loadMore" sx={{ mt: 2 }} color="secondary" />}
                    useWindow={false}
                >
                    {isMyActivity
                        ? map(activityData, (el, idx) => {
                              if (
                                  el.type === 'bid' &&
                                  activityData.findIndex(
                                      ({ type, price, buyer }: any) => type === 'buyNow' && price === el.price && buyer === el.buyer
                                  ) >= 0
                              ) {
                                  return '';
                              }
                              return (
                                  <ActivityCard
                                      idx={idx}
                                      name={
                                          el.name ||
                                          el.metadata?.name ||
                                          (isPlainObject(el.collection) ? el.collection.name : el.collection)
                                      }
                                      img={el.image || el.metadata?.json?.image}
                                      mint={el.tokenMint}
                                      type={el.type}
                                      price={el.price}
                                      time={el.blockTime}
                                      buyer={el.buyer}
                                      seller={el.seller}
                                      wallet={wallet}
                                      signature={el.signature}
                                      socialWallets={socialWallets}
                                      chain={el.chain || 'SOL'}
                                  />
                              );
                          })
                        : map(activityData, ({ meta_data_img, name, market_place_state }, idx) => (
                              <ActivityCard
                                  idx={idx}
                                  name={name}
                                  img={meta_data_img}
                                  type={market_place_state?.type}
                                  price={market_place_state?.price}
                                  time={market_place_state?.block_timestamp}
                                  signature={market_place_state?.signature}
                                  buyer={market_place_state?.buyer_address}
                                  seller={market_place_state?.seller_address}
                                  socialWallets={socialWallets}
                              />
                          ))}

                    {isLoading && map(Array(count), (i: any) => <ActivityCardSkeleton id={i} />)}
                </InfiniteScroll>
            </div>
        </section>
    );
};

export default ActivitiesViewList;
