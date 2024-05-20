/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { isEmpty, map, sortBy } from "lodash";
import dayjs from "dayjs";
import ReactApexChart from "react-apexcharts";

import { Box, Skeleton, Typography, useTheme } from "@mui/material";

import AreaChart from "@/components/charts/AreaChart";
import SwitchList from "@/components/lists/SwitchList";

import { queries } from "@/graphql/graphql";

import useAuth from "@/hooks/useAuth";
import useAuthQuery from "@/hooks/useAuthQuery";

const PortfolioChart = ({ wallet }: any) => {
  const useLightWeightChart = true;
  const datebacks: Record<string, string> = {
    "7D": "SEVEN_DAY",
    "30D": "MONTH",
  };
  const portfolioTabList = ["7D", "30D"];
  const theme = useTheme();
  const auth = useAuth();
  const [walletHist, setWalletHist] = useState<any>([]);
  const [chartData, setChartData] = useState<any>({});
  const [lightWeightChartData, setLightWeightChartData] = useState<any[]>([]);

  const [chart1SelectedDay, setChart1SelectedDay] = useState("30D");
  const { data: histData, refetch } = useAuthQuery(queries.GET_WALLET_HIST, {
    variables: {
      condition: {
        searchAddress: wallet,
        dayLookback: "MONTH",
      },
    },
  });
  const prepareChart1 = (newData: any[]) => {
    const data = sortBy(
      map(newData, ({ portfolio_value, timestamp }, idx) => ({
        time: timestamp,
        value: portfolio_value,
      })),
      "time"
    );
    setLightWeightChartData(data);
    setChartData({
      series: [
        {
          name: "Portfolio Value",
          type: "area",
          data: map(newData, ({ portfolio_value }) => portfolio_value),
        },
      ],
      options: {
        chart: {
          background: "transparent",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
          height: 280,
          type: "area",
          stacked: false,
        },
        stroke: {
          width: [2],
          curve: "smooth",
        },
        plotOptions: {
          bar: {
            columnWidth: "50%",
          },
        },
        grid: {
          borderColor: theme.palette.mode === "dark" ? "#333333" : "#cccccc",
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.55,
            opacityTo: 0.05,
            stops: [0, 80, 100, 100],
          },
        },
        colors: ["#f38aff"],
        labels:
          map(newData, ({ timestamp }) =>
            dayjs.unix(timestamp).toISOString()
          ) || [],
        markers: {
          size: 0,
        },
        xaxis: {
          type: "datetime",
        },
        yaxis: [
          {
            seriesName: "Portfolio Value",
            title: {
              text: "Portfolio Value (SOL)",
            },
            labels: {
              formatter: (value: number) => `${value.toFixed(2)}`,
            },
            min: 0,
          },
        ],
        theme: { mode: theme.palette.mode },
        tooltip: {
          shared: true,
          intersect: false,
          theme: theme.palette.mode,
          y: {
            formatter: (
              y: number,
              { series, seriesIndex, dataPointIndex, w }: any
            ) => {
              if (typeof y !== "undefined") {
                return `${y.toLocaleString()} ${
                  seriesIndex === 0 ? "SOL" : ""
                }`;
              }
              return y;
            },
          },
        },
      },
    });
  };

  const updateChart = async (params: any = {}, type: string) => {
    setChartData({});
    const { data: history } = await refetch({
      condition: {
        searchAddress: wallet,
        dayLookback: "MONTH",
        ...params,
      },
    });
    const newData = history?.getWalletStatsHist?.wallet_stats_history || [];
    if (isEmpty(newData)) {
      return;
    }
    setWalletHist(newData);
    switch (type) {
      case "all":
      case "chart1":
        prepareChart1(newData);
        break;
    }
  };

  const handlePortfolioTabChange = (event: any, day: string) => {
    if (day !== null) {
      setChart1SelectedDay(day);
      updateChart(
        {
          dayLookback: datebacks[day],
        },
        "chart1"
      );
    }
  };

  useEffect(() => {
    prepareChart1(histData?.getWalletStatsHist?.wallet_stats_history);
  }, [theme.palette.mode]);

  useEffect(() => {
    setChartData({});
    if (auth.token) {
      updateChart({}, "all");
    }
  }, [wallet, auth.token]);

  useEffect(() => {
    if (histData?.getWalletStatsHist) {
      setWalletHist(histData?.getWalletStatsHist?.wallet_stats_history);
      prepareChart1(histData?.getWalletStatsHist?.wallet_stats_history);
    }
  }, [histData]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          "& > *": {
            m: 1,
          },
        }}
      >
        <Typography fontSize={16} fontWeight={700}>
          NFT Portfolio Summary
        </Typography>
        <SwitchList
          handleTabChange={handlePortfolioTabChange}
          matchUpMd
          tabIdx={chart1SelectedDay}
          tabList={portfolioTabList}
          bgcolor="rgb(88, 101, 128)"
          contentSX={{ lineHeight: 1.75 }}
        />
      </Box>
      <div id="chart1">
        {!isEmpty(chartData) ? (
          <>
            {!useLightWeightChart || !lightWeightChartData.length ? (
              <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="line"
                height={280}
              />
            ) : (
              <AreaChart
                chartData={lightWeightChartData}
                chartId="portfolio-data"
                height={280}
                pricePrefix=" "
                priceSuffix="SOL"
              />
            )}
          </>
        ) : (
          <Skeleton width="100%" height={280} />
        )}
      </div>
    </>
  );
};

export default PortfolioChart;
