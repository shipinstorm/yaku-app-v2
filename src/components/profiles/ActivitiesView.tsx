/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { useRequests } from 'hooks/useRequests';
import ActivitiesViewList from './ActivitiesViewList';
import { useRequest } from 'ahooks';
import useLocalStorage from 'hooks/useLocalStorage';

const pageSize = 30;
const actionTypes = ['TRANSACTION', 'BID', 'CANCELBID', 'LISTING', 'DELISTING'];

const ActivitiesView = ({ project_id, mobileActive }: any) => {
    const [listData, setListData] = useState<any>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const { getMPActivities } = useRequests();
    const [cacheMPActs, setCache] = useLocalStorage(`${project_id}-acts`, []);

    const updateView = async () => {
        if (cacheMPActs) {
            setListData(cacheMPActs);
        }
        const firstList = await getMPActivities({
            condition: {
                projects: [{ project_id }],
                actionTypes
            },
            paginationInfo: {
                page_number: pageNumber,
                page_size: pageSize
            }
        });
        setListData(firstList);
        setCache(firstList);
        setHasNextPage(firstList?.length === pageSize);
    };

    const { loading: isInitialing, run: init } = useRequest(updateView, { manual: true });

    const loadMore = async () => {
        console.debug('loadMore', mobileActive, hasNextPage);
        if (!mobileActive || !hasNextPage) {
            return;
        }
        const oldMaster = cloneDeep(listData);
        const newListData = await getMPActivities({
            condition: {
                projects: [{ project_id }],
                actionTypes
            },
            paginationInfo: {
                page_number: pageNumber + 1,
                page_size: pageSize
            }
        });
        if (newListData) {
            if (newListData.length > 0) {
                setPageNumber(pageNumber + 1);
                const newList = [...(oldMaster || []), ...newListData];
                setListData(newList);
                setCache(newList);
            }
            if (newListData.length < 30) {
                setHasNextPage(false);
            }
        }
    };

    const { runAsync: runLoadMore, loading: isLoading } = useRequest(loadMore, { manual: true });

    useEffect(() => {
        init();
    }, []);

    return (
        <ActivitiesViewList
            loadMore={runLoadMore}
            hasNextPage={hasNextPage}
            listData={listData}
            isLoading={isInitialing || isLoading}
            isMyActivity={false}
            mobileActive={mobileActive}
        />
    );
};

export default ActivitiesView;
