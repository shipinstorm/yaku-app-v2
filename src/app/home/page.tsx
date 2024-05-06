"use client";

/* eslint-disable react-hooks/exhaustive-deps */

import { useRouter } from "next/navigation";

// project imports
import { gridSpacing } from "@/store/constant";

// assets
import ProjectCard from "@/components/cards/ProjectCard";
import { useSolPrice } from "@/contexts/CoinGecko";
import DetailView from "@/components/home/DetailView";
import SiteStats from "@/components/home/SiteStats";
import { useRequests } from "@/hooks/useRequests";
import { useRequest } from "ahooks";
import useLocalStorage from "@/hooks/useLocalStorage";
import SwiperList from "@/components/SwiperList";
import BannerSpace from "@/components/home/BannerSpace";
import PartnerLogos from "@/components/home/PartnerLogos";
import TowerView from "@/components/home/TowerView";

const Home = () => {
  const solPrice = useSolPrice();
  const router = useRouter();
  const { getYakuStats, getYakuTowersInfo } = useRequests();

  const [cacheYakuStats, setCacheYakuStats] = useLocalStorage("yakuStats", {});
  const [cacheYakuTowers, setCacheYakuTowers] = useLocalStorage(
    "yakuTowers",
    {}
  );

  const { data: yakuCollections, loading: isLoadingYakuStats } = useRequest(
    getYakuStats,
    {
      cacheKey: "yakuStats",
      setCache: (data) => setCacheYakuStats(data),
      getCache: () => cacheYakuStats,
    }
  );

  const { data: yakuTowers, loading: isLoadingYakuTowers } = useRequest(
    getYakuTowersInfo,
    {
      cacheKey: "yakuTowers",
      setCache: (data) => setCacheYakuTowers(data),
      getCache: () => cacheYakuTowers,
    }
  );

  const handleUrl = (url: string) => {
    window.open(url, "_blank");
  };

  const yakuCollectionsStats = [
    {
      image:
        "https://bafybeibkjcrnct6ihayjhk5567572a5ai2bhnwb7sk3mh4yhu7pa45al5e.ipfs.dweb.link",
      name: "Yaku Motors | ONI-S01",
      description:
        "YAKU Motors ONI-S01 is the first playable customizable motorcycle available to explore Yakushima City!...",
      projectStats: yakuCollections?.stats,
      projectId: "yakucorp1",
      url: "https://magiceden.io/marketplace/yaku_corp",
    },
    {
      image: "https://arweave.net/J9hCnlJYaJqltgwcsfkPO_b_eO4Q2QsRZhA8mQnYhuI",
      name: "Yaku Estates | Capsule X",
      description:
        "Get your propoerty in Yakushima City! Hang out in your capsule apartment with friends, customize your motorcycle and avatar...",
      projectStats: yakuCollections?.stats,
      projectId: "capsulex",
      url: "https://magiceden.io/marketplace/yaku_x",
    },
    {
      image:
        "https://bafybeigaq3x3iz3v24qjnv26ql7c7fstll6reolqbxkpncpbpa23bovgva.ipfs.dweb.link/",
      name: "Yaku X | Avatars",
      description:
        "Choose your race and ascend to become a Kami! YAKU X is the customizable playable avatar to explore Yakushima City...",
      projectStats: yakuCollections?.stats,
      projectId: "yakux",
      url: "https://magiceden.io/marketplace/yaku_corp_capsulex",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-y-4.5 gap-x-2.75 pt-8 pl-4">
      <BannerSpace
        title="Craft Your Reality."
        title2=""
        description="Next-Gen Action MMO/Metaverse. Dream, Create, Own, Conquer & Forge Your Destiny in the Shadows of Yakushima"
      />
      <div className="z-10 w-full">
        <div className="flex flex-row items-center">
          <div className="pb-14 sm:pb-32 w-full sm:max-w-xl max-w-7xl m-auto">
            <div className="opacity-50 m-auto max-w-7xl px-6 lg:px-8">
              <div className="m-auto mt-16 grid max-w-lg grid-cols-1 md:grid-cols-2 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:gap-x-10 lg:mx-0">
                <img
                  className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                  src="/images/partners/Epic_Games_logo.png"
                  alt="Reform"
                  width="158"
                  height="48"
                />
                <img
                  className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                  src="/images/partners/Unreal_Engine_Logo.png"
                  alt="Tuple"
                  width="158"
                  height="48"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex flex-row items-center">
          <h2 className="text-xl font-akirabold sm:text-3xl font-bold z-10">
            Yaku Estates
          </h2>
        </div>
      </div>

      <div className="py-5">
        <div className="grid grid-cols-1 gap-x-{gridSpacing}">
          <SwiperList
            items={yakuTowers}
            css="!w-full pl-4 pt-4"
            components={(
              {
                image,
                name,
                height,
                type: estateType,
                surface,
                location,
                href,
              }: any,
              idx: number
            ) => (
              <ProjectCard
                square
                image={image}
                name={name}
                description={location}
                nameTag={estateType}
                useProxy={false}
                height={200}
                onClick={() => router.push(href)}
              >
                <TowerView
                  height={height}
                  type={estateType}
                  surface={surface}
                  loading={isLoadingYakuTowers}
                />
              </ProjectCard>
            )}
            slidesPerView={{
              sm: "auto",
              md: "auto",
              lg: "auto",
            }}
            slidesPerGroup={1}
            spaceBetween={16}
            slideCss="!h-auto sm:!w-[220px] !w-[90%]"
          />
        </div>
      </div>

      {/* collection stats */}
      <div className="w-full">
        <div className="flex flex-row items-center">
          <h2 className="text-xl font-akirabold sm:text-3xl font-bold">
            Yaku Gaming Assets
          </h2>
        </div>
      </div>

      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        style={{ filter: "blur(64px)", paddingTop: "600px" }}
        aria-hidden="true"
      >
        <div
          className="aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="py-5">
        <div className="grid grid-cols-1 gap-{gridSpacing}">
          <SwiperList
            items={[...yakuCollectionsStats]}
            css="!w-full pl-4 pt-4"
            components={(
              { image, name, description, projectId, projectStats, url }: any,
              idx: number
            ) => (
              <ProjectCard
                truncate={false}
                square={false}
                image={image}
                name={name}
                description={description}
                onClick={() => handleUrl(url)}
              >
                <DetailView
                  solPrice={solPrice}
                  projectStats={projectStats}
                  projectId={projectId}
                  loading={isLoadingYakuStats}
                />
              </ProjectCard>
            )}
            slidesPerView={{
              sm: "auto",
              md: "auto",
              lg: "auto",
            }}
            slidesPerGroup={1}
            spaceBetween="1.33%"
            slideCss="!h-auto sm:!w-[360px] !w-[90%]"
          />
        </div>
      </div>

      <div className="py-24 sm:py-32">
        <div className="flex flex-row items-center justify-center">
          <h2 className="text-xl font-akirabold sm:text-4xl font-bold py-20">
            Our Partners love Yaku
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-x-{gridSpacing}">
          <div className="col-span-1">
            <PartnerLogos />
          </div>
        </div>
      </div>

      <div className="py-20 hidden">
        <div className="grid grid-cols-1 gap-x-{gridSpacing}">
          <div className="col-span-1">
            <SiteStats />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
