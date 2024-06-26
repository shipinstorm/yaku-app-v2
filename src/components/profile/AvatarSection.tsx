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
    size="sm"
    className="bg-[#1f1f23] text-[#d5d9e9] transition-shadow duration-300 ease-in-out shadow-[rgba(0,0,0,0.2)_0px_11px_15px_-7px,rgba(0,0,0,0.14)_0px_24px_38px_3px,rgba(0,0,0,0.12)_0px_9px_46px_8px] bg-none rounded-lg m-8 relative overflow-y-auto flex flex-col max-h-[calc(100%-64px)] py-3 !w-full"
  >
    <DialogHeader
      className="flex items-center justify-between gap-1"
      placeholder=""
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    >
      <h2 className="text-2xl font-bold text-white">Edit profile</h2>
    </DialogHeader>
    <DialogBody
      placeholder=""
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
    >
      {/* <ProfileBanner height={240} editable upload={handleUploadBanner} /> */}
      <div className="flex items-center relative justify-center">
        <img
          src={src}
          className="w-[60px] md:w-[150px] h-[60px] md:h-[150px] object-contain border-none bg-black z-20 rounded-2xl"
        />
        <div className="relative">
          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-full left-[-60px] md:left-[-150px] z-30">
            <button
              className="bg-transparent bg-opacity-50 text-white"
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
          className="w-full bg-[#e0e0ff08] border-2 border-[#0000] text-white h-12 pr-4 py-2 pl-10 transition-all duration-300 rounded-2xl"
          maxLength={30}
          placeholder="Vanity"
          value={username}
          onChange={(e) => handleUsername(e.target.value)}
        />
        <input
          type="text"
          className="w-full bg-[#e0e0ff08] border-2 border-[#0000] text-white h-12 pr-4 py-2 pl-10 transition-all duration-300 rounded-2xl"
          maxLength={600}
          placeholder="Bio"
          value={bio}
          onChange={(e) => handleBio(e.target.value)}
        />
        <input
          type="text"
          className="w-full bg-[#e0e0ff08] border-2 border-[#0000] text-white h-12 pr-4 py-2 pl-10 transition-all duration-300 rounded-2xl"
          maxLength={30}
          placeholder="Location"
          value={locale}
          onChange={(e) => handleLocale(e.target.value)}
        />
        <div className="flex w-full gap-2">
          <button
            className="mt-3 h-11 w-full rounded-xl bg-elevation2 text-sm font-medium text-secondary duration-300"
            onClick={() => handleSave()}
            disabled={isLoading}
          >
            Save
          </button>
          <button
            className="mt-3 h-11 w-full rounded-xl bg-elevation2 text-sm font-medium text-secondary duration-300"
            onClick={() => setShowEditProfile(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
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
      <section className="profile-box bg-surface mb-5 p-0 card overflow-hidden">
        <div className="p-4 text-center pt-20">
          <div className="flex justify-center">
            <div>
              <button className="text-primary mb-1 bg-transparent text-xl font-bold">
                {Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(followers || 0)}{" "}
              </button>
              <p className="text-terciary text-xs font-medium">Followers</p>
            </div>

            <div className="avatar relative z-10 flex-shrink-0 -mt-14 mx-2 rounded-3xl shadow-sm overflow-hidden">
              {src ? (
                <img src={src} className="icon-lg w-full object-cover" />
              ) : (
                <div className="bg-[#111111ec] z-20 rounded-full w-[60px] h-[60px] md:w-[240px] md:h-[240px]"></div>
              )}
            </div>

            <div>
              <button className="text-primary mb-1 bg-transparent text-xl font-bold">
                {Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(followings || 0)}{" "}
              </button>
              <p className="text-terciary text-xs font-medium">Followings</p>
            </div>
          </div>

          {mainWallet?.publicKey?.toBase58() === wallet && user ? (
            <button
              className="bg-[#2D2F33] text-[#d5d9e9] rounded-2xl w-full px-4 py-2 mt-6"
              onClick={() => handleEditProfile()}
            >
              {matchUpMd ? "Edit Profile" : "Edit"}
            </button>
          ) : (
            <></>
          )}
        </div>
      </section>

      <section className="mb-5">
        <h2 className="text-primary mb-3 text-lg font-bold">Badges</h2>
        <div className="flex items-center flex-wrap gap-3">
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
                ({ amount }: any) => amount >= 2000000000 && amount < 4000000000
              ) && <Badges icon="BadgeIconMotor" alt="Bike Holder" />}
            {stakedYakuNfts &&
              stakedYakuNfts.length > 0 &&
              filter(stakedYakuNfts, ({ amount }: any) => amount === 4000000000)
                .length > 9 && <Badges icon="BadgeIconWhale" alt="Whale" />}
            {/* <Badges icon="BadgeIconTwitter" /> */}
            {/* <Badges icon="BadgeIconGoldMedal" /> */}
          </div>
        </div>
      </section>

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
          </div>

          <div
            className={`grid-item xs:w-4.5 ${
              !!handleFollow ? "flex" : "hidden"
            } flex flex-col justify-between items-end h-full`}
          >
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
