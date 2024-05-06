/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Container, Skeleton, Typography } from "@mui/material";
import { useRequests } from "@/hooks/useRequests";

const ValueSpan = ({ val }: any) => (
  <>
    {!val ? (
      <div className="animate-pulse h-10 w-32 bg-gray-300 rounded-md"></div>
    ) : (
      <span className="text-secondary text-xs">{(+val).toLocaleString()}</span>
    )}
  </>
);

const SiteStats = () => {
  const { getSiteStats } = useRequests();
  const [stats, setStats] = useState<any>({});
  const updateView = async () => {
    const statsData = await getSiteStats();
    if (statsData) {
      setStats(statsData);
    }
  };
  useEffect(() => {
    updateView();
  }, []);
  return (
    <div className="container mx-auto flex flex-wrap justify-start sm:justify-center md:justify-center items-center gap-4">
      <p className="text-base">
        Total users: <ValueSpan val={stats.total} />
      </p>
      <p className="text-base">
        Total active users: <ValueSpan val={stats.activeCount} />
      </p>
      <p className="text-base">
        Total linked twitter: <ValueSpan val={stats.twitterCount} />
      </p>
      <p className="text-base">
        Total linked discord: <ValueSpan val={stats.discordCount} />
      </p>
      <p className="text-base">
        Total linked ETH address: <ValueSpan val={stats.ethCount} />
      </p>
    </div>
  );
};

export default SiteStats;
