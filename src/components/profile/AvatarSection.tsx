/* eslint-disable no-extra-boolean-cast */
import copy from "copy-to-clipboard";
import { filter, find } from "lodash";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMediaQuery } from "react-responsive";

import {
  Dialog,
  DialogHeader,
  DialogBody,
  Tooltip,
} from "@material-tailwind/react";
import {
  IconBrandDiscord,
  IconBrandTwitter,
  IconUpload,
} from "@tabler/icons-react";

import Badges from "@/components/icons/BadgeIcons";

import { mutations } from "@/graphql/graphql";

import useAuth from "@/hooks/useAuth";
import useAuthMutation from "@/hooks/useAuthMutation";
import { useToasts } from "@/hooks/useToasts";

// eslint-disable-next-line
import ProfileBanner from "./ProfileBanner";

const EditProfileDialog = ({
  src,
  showEditProfile,
  setShowEditProfile,
  handleSave,
  handleUploadBanner,
  isLoading,
  handleShowSelectNft,
  username,
  handleUsername,
  bio,
  handleBio,
  locale,
  handleLocale,
}: any) => (
  <Dialog
    open={showEditProfile}
    handler={() => {}}
    placeholder=""
    onPointerEnterCapture={() => {}}
    onPointerLeaveCapture={() => {}}
  >
    <DialogHeader
      className="flex items-center justify-between gap-1"
      placeholder=""
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    >
      <h2 className="text-2xl font-bold">Edit profile</h2>
      <button
        className="bg-white text-black rounded-full"
        onClick={() => handleSave()}
        disabled={isLoading}
      >
        Save
      </button>
    </DialogHeader>
    <DialogBody
      placeholder=""
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    >
      <ProfileBanner height={240} editable upload={handleUploadBanner} />
      <div className="mt-[-40px] md:mt-[-75px] flex items-center relative">
        <img
          src="{src}"
          className="w-[60px] md:w-[150px] h-[60px] md:h-[150px] object-contain border-none bg-black z-20"
        />
        <div className="relative">
          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-full">
            <button
              className="bg-black bg-opacity-50"
              onClick={() => handleShowSelectNft()}
            >
              <IconUpload />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 items-center">
        <input
          type="text"
          className="w-full"
          maxLength={30}
          placeholder="Vanity"
          value="{username}"
          onChange={(e) => handleUsername(e.target.value)}
        />
        <input
          type="text"
          className="w-full"
          maxLength={600}
          placeholder="Bio"
          value="{bio}"
          onChange={(e) => handleBio(e.target.value)}
        />
        <input
          type="text"
          className="w-full"
          maxLength={30}
          placeholder="Location"
          value="{locale}"
          onChange={(e) => handleLocale(e.target.value)}
        />
      </div>
    </DialogBody>
  </Dialog>
);

const AvatarSection = ({
  src,
  vanity,
  sol_name,
  discord,
  twitter,
  stakedYakuNfts,
  wallet,
  mainWallet,
  handleFollow,
  isFollowed,
  followers,
  followings,
  handleShowSelectNft,
}: any) => {
  const { user, setUserData } = useAuth();
  const { showSuccessToast } = useToasts();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState(user?.vanity || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [locale, setLocale] = useState(user?.location || "");
  const matchUpMd = useMediaQuery({ query: "(min-width: 900px)" });
  const [updateProfile] = useAuthMutation(mutations.UPDATE_PROFILE);
  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleUsername = async (name: string) => {
    setUsername(name);
  };
  const handleBio = async (name: string) => {
    setBio(name);
  };
  const handleLocale = async (name: string) => {
    setLocale(name);
  };
  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        variables: {
          profile: {
            vanity: username,
            bio,
            location: locale,
          },
        },
      });
      setUserData({
        ...user,
        vanity: username,
        bio,
        location: locale,
      });
      showSuccessToast("Successfully updated your profile.");
      setShowEditProfile(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUploadBanner = async (image: string) => {
    await axios.post("https://project.yaku.ai/files/upload", {
      user: user.id,
      update: true,
      file: image,
    });
    setUserData({
      ...user,
      banner: image,
    });
  };
  useEffect(() => {
    if (user) {
      setUsername(user?.vanity);
      setBio(user?.bio);
      setLocale(user?.location);
    }
  }, [user]);
  return (
    <>
      {src ? (
        <img
          src={src}
          className="object-contain bg-black z-20 w-[60px] h-[60px] md:w-[240px] md:h-[240px]"
        />
      ) : (
        <div className="bg-[#111111ec] z-20 rounded-full w-[60px] h-[60px] md:w-[240px] md:h-[240px]"></div>
      )}
      <div className="bg-opacity-70 bg-black w-full md:w-auto md:min-w-[480px] max-w-[80vw] min-h-[100px] max-h-[140px] z-19 pl-5 pr-2 rounded-lg ml-[-24px] flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 md:gap-x-0 justify-between items-center">
          <div className="md:col-span-12">
            <div className="flex gap-1 items-center flex-1">
              <p className="whitespace-nowrap text-[20px] font-extrabold">
                {mainWallet?.publicKey?.toBase58() === wallet && user
                  ? user.vanity
                  : vanity}{" "}
                {sol_name && `| ${sol_name}`}
              </p>
            </div>
            <div className="flex gap-x-1 items-center flex-wrap flex-1">
              {discord && (
                <Tooltip title="Click to copy">
                  <div
                    className="flex items-center gap-0.5 cursor-pointer"
                    onClick={() => {
                      copy("${discord?.name}#${discord?.discriminator}");
                      showSuccessToast(
                        "Copied discord id: ${discord?.name}#${discord?.discriminator}"
                      );
                    }}
                  >
                    <IconBrandDiscord style={{ height: 16, width: 14 }} />
                    <p className="overflow-hidden whitespace-nowrap">{`${discord?.name}#${discord?.discriminator}`}</p>
                  </div>
                </Tooltip>
              )}
              {twitter && (
                <div
                  className="flex items-center gap-0.5 cursor-pointer"
                  onClick={() =>
                    window.open(
                      "https://twitter.com/${twitter?.username}",
                      "_blank"
                    )
                  }
                >
                  <IconBrandTwitter
                  // style={{ height: 16, width: 14 }}
                  />
                  <p className="overflow-hidden whitespace-nowrap">
                    {twitter?.username}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-1 items-center flex-1">
              <div className="flex gap-2 cursor-pointer">
                {stakedYakuNfts &&
                  stakedYakuNfts.length > 0 &&
                  filter(
                    stakedYakuNfts,
                    ({ amount }: any) => amount === 36000000000
                  ).length > 0 && (
                    <Badges icon="BadgeIconDiamond" alt="Mansion Owner" />
                  )}
                {/* <Badges icon="BadgeIconDiploma" /> */}
                {stakedYakuNfts && stakedYakuNfts.length > 0 && (
                  <Badges icon="BadgeIconLemon" alt="Yaku Holder" />
                )}
                {stakedYakuNfts &&
                  stakedYakuNfts.length > 0 &&
                  !!find(
                    stakedYakuNfts,
                    ({ amount }: any) =>
                      amount >= 2000000000 && amount < 4000000000
                  ) && <Badges icon="BadgeIconMotor" alt="Bike Holder" />}
                {stakedYakuNfts &&
                  stakedYakuNfts.length > 0 &&
                  filter(
                    stakedYakuNfts,
                    ({ amount }: any) => amount === 4000000000
                  ).length > 9 && <Badges icon="BadgeIconWhale" alt="Whale" />}
                {/* <Badges icon="BadgeIconTwitter" /> */}
                {/* <Badges icon="BadgeIconGoldMedal" /> */}
              </div>
            </div>
          </div>
          <div
            className={`grid-item xs:w-4.5 ${
              !!handleFollow ? "flex" : "hidden"
            }`}
            // style={{
            //   alignItems: "flex-end",
            //   flexDirection: "column",
            //   justifyContent: "space-between",
            //   height: "100%",
            // }}
          >
            <div className="flex items-center justify-end gap-1">
              {mainWallet?.publicKey?.toBase58() === wallet && user ? (
                <button
                  className="bg-secondary text-black rounded-full px-4 py-2"
                  onClick={() => handleEditProfile()}
                >
                  {matchUpMd ? "Edit Profile" : "Edit"}
                </button>
              ) : (
                <></>
              )}
            </div>
            <div className="flex items-center justify-end gap-1">
              {mainWallet?.publicKey?.toBase58() !== wallet ? (
                <>
                  <button
                    className="bg-secondary text-black rounded-full px-4 py-2"
                    onClick={() => handleFollow()}
                  >
                    {isFollowed ? "Unfollow" : "Follow"}
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="mt-1 flex flex-col md:flex-row gap-1 items-center md:items-center justify-center md:justify-end">
              <p className="whitespace-nowrap">
                {Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(followings || 0)}{" "}
                Followings
              </p>

              <p className="whitespace-nowrap">
                {Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(followers || 0)}{" "}
                Followers
              </p>
            </div>
          </div>
        </div>
      </div>
      <EditProfileDialog
        {...{
          src,
          showEditProfile,
          setShowEditProfile,
          handleSave,
          handleUploadBanner,
          isLoading,
          handleShowSelectNft,
          username,
          handleUsername,
          bio,
          handleBio,
          locale,
          handleLocale,
        }}
      />
    </>
  );
};

export default AvatarSection;
