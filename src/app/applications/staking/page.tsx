"use client";

/* eslint-disable */
import { ReactElement, useState, useEffect } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Grid,
  Button,
  Tooltip,
  Tab,
  Box,
  IconButton,
  Stack,
  styled,
  Paper,
  Skeleton,
} from "@mui/material";

// web3 imports
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { calculateAllRewards, claimRewardAll } from "@/actions/stake";

// project imports
import RevenueCard from "@/components/cards/RevenueCard";
import SkeletonProductPlaceholder from "@/components/skeleton/CardPlaceholder";
import MainCard from "@/components/cards/MainCard";
import StakeEmpty from "./StakeEmpty";
import StakedNftCard from "./StakedNftCard";
import NftCard from "./StakeNftCard";
import { formatNumber, formatUSD } from "@/utils/utils";
import { useMeta } from "@/contexts/meta/meta";
import { useToasts } from "@/hooks/useToasts";
import { gridSpacing } from "@/store/constant";

// assets
import MonetizationOnTwoToneIcon from "@mui/icons-material/MonetizationOnTwoTone";
import AccountBalanceTwoToneIcon from "@mui/icons-material/AccountBalanceTwoTone";
import FormatListBulletedTwoToneIcon from "@mui/icons-material/FormatListBulletedTwoTone";
import EqualizerTwoToneIcon from "@mui/icons-material/EqualizerTwoTone";

import { calculateAllYakuRewards } from "./fetchData";
import YakuStakeNftCard from "./YakuStakedNftCard";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  claimRewardV2Multiple,
  loadYakuProgram,
  stakeNftV2Multiple,
  unStakeNftV2Multiple,
} from "@/actions/yakuStake";
import { get, isEmpty, map, pull } from "lodash";
import { PublicKey } from "@solana/web3.js";
import { RefreshOutlined } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";
import useConnections from "@/hooks/useConnetions";
import useStaked from "@/hooks/useStaked";
import CAConversion from "@/components/home/CAConversion";
import { usePriority } from "@/contexts/SolPriorityContext";

function Staking() {
  const { connection } = useConnections();
  const theme = useTheme();
  const showCAConvert = true;
  const {
    totalStaked,
    valueLocked,
    tokenDistributed,
    dailyYield,
    nftList,
    stakedNfts,
    stakedYakuNfts,
    rewardAmount,
    setRewardAmount,
    yakuRewardAmount,
    setYakuRewardAmount,
    totalCount,
    assetsCount,
    updateContext,
    isLoading,
  } = useStaked();

  const { priorityRate, setShowPriorityDialog } = usePriority();

  const { showInfoToast, showTxErrorToast, showErrorToast } = useToasts();
  const { startLoading, stopLoading } = useMeta();
  const wallet: any = useAnchorWallet();
  const mainWallet = useWallet();

  const [tabIdx, setTabIdx] = useState(
    nftList && nftList.length > 0 ? "1" : "2"
  );
  const [selected, setSelected] = useState<any[]>([]);
  const [selectedUnstake, setSelectedUnstake] = useState<any[]>([]);

  let timer: any;

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabIdx(newValue);
  };

  // Claim all COSMIC
  const claimAll = async () => {
    try {
      startLoading();
      await claimRewardAll(connection, mainWallet);
      showInfoToast("You have claimed all of your $COSMIC.");
      updatePage();
    } catch (error: any) {
      console.error(error);
      showTxErrorToast(
        error,
        "An error has occured while claiming your rewards, please try again."
      );
    } finally {
      stopLoading();
    }
  };

  const claimAllYaku = async () => {
    try {
      startLoading();
      const program = loadYakuProgram(connection, wallet);
      const mintList = map(stakedYakuNfts, ({ mint }) => new PublicKey(mint));
      await claimRewardV2Multiple(
        connection,
        program,
        wallet,
        mintList,
        priorityRate
      );
      showInfoToast("You have claimed all of your $YAKU.");
      updatePage();
    } catch (error) {
      console.error(error);
      showTxErrorToast(
        error,
        "An error has occured while claiming your rewards, please try again."
      );
    } finally {
      stopLoading();
    }
  };

  const claimSelected = async () => {
    try {
      startLoading();
      const program = loadYakuProgram(connection, wallet);
      const mintList = map(selected, (mint) => new PublicKey(mint));
      await claimRewardV2Multiple(
        connection,
        program,
        wallet,
        mintList,
        priorityRate
      );
      showInfoToast(`You have claimed ${selected.length} of your $YAKU.`);
      setSelected([]);
      updatePage();
    } catch (error) {
      console.error(error);
      showTxErrorToast(
        error,
        "An error has occured while claiming your rewards, please try again."
      );
    } finally {
      stopLoading();
    }
  };

  const stakeAll = async () => {
    try {
      startLoading();
      const program = loadYakuProgram(connection, wallet);
      const mintList = map(
        nftList,
        ({ mint, mintAddress }) => new PublicKey(mint || mintAddress)
      );
      await stakeNftV2Multiple(
        connection,
        program,
        wallet,
        mintList,
        priorityRate
      );
      showInfoToast("You have staked all of your NFTs.");
      updatePage();
    } catch (error) {
      console.error(error);
      showTxErrorToast(
        error,
        "An error has occured while staking your nfts, please try again."
      );
    } finally {
      stopLoading();
    }
  };

  const stakeSelected = async () => {
    try {
      startLoading();
      const program = loadYakuProgram(connection, wallet);
      const mintList = map(selectedUnstake, (mint) => new PublicKey(mint));
      await stakeNftV2Multiple(
        connection,
        program,
        wallet,
        mintList,
        priorityRate
      );
      showInfoToast(`You have staked ${selectedUnstake.length} of your NFTs.`);
      setSelectedUnstake([]);
      updatePage();
    } catch (error) {
      console.error(error);
      showTxErrorToast(
        error,
        "An error has occured while staking your nfts, please try again."
      );
    } finally {
      stopLoading();
    }
  };

  const unstakeAll = async () => {
    try {
      startLoading();
      const program = loadYakuProgram(connection, wallet);
      const mintList = map(
        stakedYakuNfts,
        ({ mint, mintAddress }) => new PublicKey(mint || mintAddress)
      );
      const withType = map(
        stakedYakuNfts,
        ({ mint, mintAddress, stakedType }) => ({
          mint: new PublicKey(mint || mintAddress),
          stakedType,
        })
      );
      await unStakeNftV2Multiple(
        connection,
        program,
        wallet,
        withType,
        priorityRate
      );
      showInfoToast("You have unstaked all of your NFTs.");
      updatePage();
    } catch (error) {
      console.error(error);
      showTxErrorToast(
        error,
        "An error has occured while unstaking your nfts, please try again."
      );
    } finally {
      stopLoading();
    }
  };

  const unstakeSelected = async () => {
    try {
      startLoading();
      const program = loadYakuProgram(connection, wallet);
      const mintList = map(selected, (mint) => new PublicKey(mint));
      await unStakeNftV2Multiple(
        connection,
        program,
        wallet,
        mintList,
        priorityRate
      );
      showInfoToast(`You have unstaked ${mintList.length} of your NFTs.`);
      setSelected([]);
      updatePage();
    } catch (error) {
      console.error(error);
      showTxErrorToast(
        error,
        "An error has occured while unstaking your nfts, please try again."
      );
    } finally {
      stopLoading();
    }
  };

  const refreshYakuReward = () => {
    timer = setInterval(() => {
      const rewardAmount = calculateAllYakuRewards(stakedYakuNfts);
      if (rewardAmount) {
        setYakuRewardAmount(rewardAmount);
      }
    }, 1000);
  };

  const updatePage = () => {
    updateContext();
  };

  const handleSelect = (mint: any) => {
    if (selected.includes(mint)) {
      pull(selected, mint);
    } else {
      selected.push(mint);
    }
    setSelected([...selected]);
  };

  const handleSelectUnstake = (mint: any) => {
    if (selectedUnstake.includes(mint)) {
      pull(selectedUnstake, mint);
    } else {
      selectedUnstake.push(mint);
    }
    setSelectedUnstake([...selectedUnstake]);
  };

  useEffect(() => {
    if (!wallet || wallet?.publicKey === null) {
      showErrorToast("Failed to found wallet public key.");
      return;
    }
    updatePage();

    let timerId = 0;
    const queryClaimAmount = async () => {
      const claimReward = await calculateAllRewards(connection, wallet);
      setRewardAmount(claimReward);

      startTimer();
    };

    const startTimer = () => {
      timerId = window.setTimeout(async () => {
        await queryClaimAmount();
      }, 35000);
    };

    queryClaimAmount();
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    refreshYakuReward();
    return () => clearInterval(timer);
  }, [stakedYakuNfts]);

  let stakedNftResult: ReactElement | ReactElement[] = <></>;
  if (stakedNfts && stakedNfts.length !== 0) {
    stakedNftResult = stakedNfts.map((nft: any, index: number) => (
      <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
        <StakedNftCard
          mint={nft.mint}
          name={nft.name}
          image={nft.image}
          role={nft.role}
          lockTime={nft.lockTime}
          rate={nft.rate}
          rewardTime={nft.rewardTime}
          stakedTime={nft.stakedTime}
          startLoading={() => startLoading()}
          stopLoading={() => stopLoading()}
          updatePage={() => updatePage()}
        />
      </Grid>
    ));
  } else {
    stakedNftResult = <></>;
  }

  let stakedYakuNftResult: ReactElement | ReactElement[] = <></>;
  if (stakedYakuNfts && stakedYakuNfts.length !== 0) {
    stakedYakuNftResult = stakedYakuNfts.map((nft: any, index: number) => (
      <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
        <YakuStakeNftCard
          mint={nft.mint || nft.mintAddress}
          name={get(nft, "metadata.json.name")}
          image={get(nft, "metadata.json.image")}
          reward={nft.reward}
          interval={nft.interval}
          lastClaim={nft.lastClaim}
          amount={nft.amount}
          isPNft={!isEmpty(get(nft, "metaplex.programmableConfig"))}
          stakedType={get(nft, "stakedType", "custodial")}
          startLoading={() => startLoading()}
          stopLoading={() => stopLoading()}
          updatePage={() => updatePage()}
          isSelected={selected?.includes(nft.mint || nft.mintAddress)}
          onSelect={handleSelect}
        />
      </Grid>
    ));
  } else {
    stakedYakuNftResult = <></>;
  }

  let nftResult: ReactElement | ReactElement[] = <></>;
  if (nftList && nftList.length !== 0) {
    nftResult = nftList.map((nft: any, index: number) => (
      <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
        <NftCard
          mint={nft.mint || nft.mintAddress}
          reward={nft.reward}
          name={get(nft, "metadata.json.name", nft.name)}
          image={get(nft, "metadata.json.image", nft.image)}
          isPNft={!isEmpty(get(nft, "metaplex.programmableConfig"))}
          startLoading={() => startLoading()}
          stopLoading={() => stopLoading()}
          updatePage={() => updatePage()}
          isSelected={selectedUnstake?.includes(nft.mint || nft.mintAddress)}
          onSelect={handleSelectUnstake}
        />
      </Grid>
    ));
  } else if (nftList && nftList.length === 0) {
    nftResult = (
      <Grid item xs={12}>
        <StakeEmpty />
      </Grid>
    );
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <>
      <Grid container spacing={gridSpacing} sx={{ pb: 2 }}>
        <Grid item xs={12} lg={3} sm={6}>
          <RevenueCard
            primary={<FormattedMessage id="total-staked" />}
            secondary={formatNumber.format(totalStaked)}
            content={<FormattedMessage id="vault-holdings" />}
            iconPrimary={AccountBalanceTwoToneIcon}
            iconSx={{
              top: "calc((100% - 48px)/2)",
              "&> svg": { width: 48, height: 48, opacity: "0.5" },
              [theme.breakpoints.down("sm")]: {
                top: "calc((100% - 32px)/2)",
                "&> svg": { width: 32, height: 32 },
              },
            }}
            color={theme.palette.secondary.dark}
          />
        </Grid>

        <Grid item xs={12} lg={3} sm={6}>
          <RevenueCard
            primary={<FormattedMessage id="tvl" />}
            secondary={formatUSD.format(valueLocked)}
            content={<FormattedMessage id="tvl-desc" />}
            iconPrimary={MonetizationOnTwoToneIcon}
            iconSx={{
              top: "calc((100% - 48px)/2)",
              "&> svg": { width: 48, height: 48, opacity: "0.5" },
              [theme.breakpoints.down("sm")]: {
                top: "calc((100% - 32px)/2)",
                "&> svg": { width: 32, height: 32 },
              },
            }}
            color={theme.palette.primary.dark}
          />
        </Grid>

        <Grid item xs={12} lg={3} sm={6}>
          <RevenueCard
            primary={<FormattedMessage id="distributed" />}
            secondary={formatNumber.format(tokenDistributed)}
            content={<FormattedMessage id="est-circular-supply" />}
            iconPrimary={EqualizerTwoToneIcon}
            iconSx={{
              top: "calc((100% - 48px)/2)",
              "&> svg": { width: 48, height: 48, opacity: "0.5" },
              [theme.breakpoints.down("sm")]: {
                top: "calc((100% - 32px)/2)",
                "&> svg": { width: 32, height: 32 },
              },
            }}
            color={theme.palette.warning.main}
          />
        </Grid>

        <Grid item xs={12} lg={3} sm={6}>
          <RevenueCard
            primary={<FormattedMessage id="daily-yield" />}
            secondary={formatNumber.format(dailyYield)}
            content={<FormattedMessage id="daily-yield-desc" />}
            iconPrimary={FormatListBulletedTwoToneIcon}
            iconSx={{
              top: "calc((100% - 48px)/2)",
              "&> svg": { width: 48, height: 48, opacity: "0.5" },
              [theme.breakpoints.down("sm")]: {
                top: "calc((100% - 32px)/2)",
                "&> svg": { width: 32, height: 32 },
              },
            }}
            color={theme.palette.info.dark}
          />
        </Grid>
      </Grid>

      <Grid container spacing={gridSpacing} sx={{ pb: 2 }}>
        <Grid item xs={6} lg={2} md={3} sm={4}>
          <Stack>
            <Item>
              Your Assets
              <br />
              {totalCount}
            </Item>
          </Stack>
        </Grid>
        <Grid item xs={6} lg={2} md={3} sm={4}>
          <Stack>
            <Item>
              Yaku X
              <br />
              {isLoading ? (
                <Skeleton
                  variant="rounded"
                  sx={{ mx: "auto" }}
                  width={60}
                  height={16}
                />
              ) : (
                assetsCount?.yakuXCnt ?? 0
              )}
            </Item>
          </Stack>
        </Grid>
        <Grid item xs={6} lg={2} md={3} sm={4}>
          <Stack>
            <Item>
              Capsule X
              <br />
              {isLoading ? (
                <Skeleton
                  variant="rounded"
                  sx={{ mx: "auto" }}
                  width={60}
                  height={16}
                />
              ) : (
                assetsCount?.capsuleCnt ?? 0
              )}
            </Item>
          </Stack>
        </Grid>
        <Grid item xs={6} lg={2} md={3} sm={4}>
          <Stack>
            <Item>
              ONI S-01
              <br />
              {isLoading ? (
                <Skeleton
                  variant="rounded"
                  sx={{ mx: "auto" }}
                  width={60}
                  height={16}
                />
              ) : (
                assetsCount?.bikeCnt ?? 0
              )}
            </Item>
          </Stack>
        </Grid>
        <Grid item xs={6} lg={2} md={3} sm={4}>
          <Stack>
            <Item>
              Mansion
              <br />
              {isLoading ? (
                <Skeleton
                  variant="rounded"
                  sx={{ mx: "auto" }}
                  width={60}
                  height={16}
                />
              ) : (
                assetsCount?.mansionCnt ?? 0
              )}
            </Item>
          </Stack>
        </Grid>
        <Grid item xs={6} lg={2} md={3} sm={4}>
          <Stack>
            <Item>
              Sets
              <br />
              {isLoading ? (
                <Skeleton
                  variant="rounded"
                  sx={{ mx: "auto" }}
                  width={60}
                  height={16}
                />
              ) : (
                assetsCount?.setCnt ?? 0
              )}
            </Item>
          </Stack>
        </Grid>
      </Grid>
      {showCAConvert && <CAConversion />}
      <TabContext value={tabIdx}>
        <MainCard
          sx={{
            ".MuiCardHeader-root": {
              overflowX: "auto",
            },
          }}
          title={
            <Box
              sx={{
                display: "flex",
              }}
            >
              <TabList
                onChange={handleTabChange}
                sx={{
                  marginTop: "-12px",
                  ".MuiTabs-flexContainer": { borderBottom: "none" },
                }}
                textColor="secondary"
                indicatorColor="secondary"
              >
                <Tab
                  label={<FormattedMessage id="unstaked" />}
                  id="unstakedTab"
                  value="1"
                />
                <Tab
                  label={<FormattedMessage id="staked" />}
                  id="stakedTab"
                  value="2"
                />
              </TabList>
            </Box>
          }
          secondary={
            <>
              {selected && selected.length > 0 && (
                <>
                  <Button
                    color="error"
                    variant="contained"
                    disabled={selected && !selected.length}
                    onClick={() => unstakeSelected()}
                    sx={{ ml: 2 }}
                  >
                    Unstake ({selected.length})
                  </Button>
                  <Button
                    color="warning"
                    variant="contained"
                    disabled={selected && !selected.length}
                    onClick={() => claimSelected()}
                    sx={{ ml: 2 }}
                  >
                    Claim ({selected.length})
                  </Button>
                </>
              )}
              {selectedUnstake && selectedUnstake.length > 0 && (
                <>
                  <Button
                    color="secondary"
                    variant="contained"
                    disabled={selectedUnstake && !selectedUnstake.length}
                    onClick={() => stakeSelected()}
                    sx={{ ml: 2 }}
                  >
                    Stake ({selectedUnstake.length})
                  </Button>
                </>
              )}
              {(!selectedUnstake || selectedUnstake?.length === 0) &&
                tabIdx === "1" && (
                  <>
                    <Button
                      color="secondary"
                      variant="contained"
                      disabled={nftList && !nftList.length}
                      onClick={() => stakeAll()}
                      sx={{ ml: 2 }}
                    >
                      <FormattedMessage id="stake-all" />
                    </Button>
                  </>
                )}
              {(!selected || selected?.length === 0) && tabIdx === "2" && (
                <>
                  <Button
                    color="error"
                    variant="contained"
                    onClick={() => unstakeAll()}
                    sx={{ ml: 2 }}
                  >
                    <FormattedMessage id="unstake-all" />
                  </Button>
                  {rewardAmount > 0 && (
                    <Tooltip
                      title="You may lose 25% of accumlated rewards if claiming within 15 days of the original staking date."
                      arrow
                    >
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => claimAll()}
                        sx={{ ml: 2 }}
                      >
                        <FormattedMessage id="claim-all" /> (
                        {rewardAmount.toLocaleString()} $COSMIC)
                      </Button>
                    </Tooltip>
                  )}
                  <Button
                    color="warning"
                    variant="contained"
                    onClick={() => claimAllYaku()}
                    sx={{ ml: 2 }}
                  >
                    <FormattedMessage id="claim-all" /> (
                    {yakuRewardAmount.toFixed(3).toLocaleString()} $YAKU)
                  </Button>
                </>
              )}
              <IconButton sx={{ ml: 2 }} onClick={() => updatePage()}>
                <RefreshOutlined />
              </IconButton>
              <Button
                color="secondary"
                variant="contained"
                sx={{ ml: 2 }}
                onClick={() => setShowPriorityDialog(true)}
              >
                Priority Rate
              </Button>
            </>
          }
        >
          {/* Content */}
          <TabPanel value="1">
            <Grid container spacing={gridSpacing}>
              {isLoading ? (
                [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <Grid key={item} item xs={12} sm={6} md={4} lg={3}>
                    <SkeletonProductPlaceholder />
                  </Grid>
                ))
              ) : (
                <>{nftResult}</>
              )}
            </Grid>
          </TabPanel>

          <TabPanel value="2">
            <Grid container spacing={gridSpacing}>
              {isLoading ? (
                [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <Grid key={item} item xs={12} sm={6} md={4} lg={3}>
                    <SkeletonProductPlaceholder />
                  </Grid>
                ))
              ) : (
                <>
                  {stakedNftResult}
                  {stakedYakuNftResult}
                </>
              )}
            </Grid>
          </TabPanel>
        </MainCard>
      </TabContext>
    </>
  );
}

export default Staking;
