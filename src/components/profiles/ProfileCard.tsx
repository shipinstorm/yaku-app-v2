import Image from "next/image";

import { IconButton, Avatar, useTheme, Skeleton } from "@mui/material";
import { FileUpload } from "@mui/icons-material";
import ProfileBanner from "./ProfileBanner";

import { map } from "lodash";
import {
  IMAGE_PROXY_BANNER,
  DEFAULT_BANNER,
  LOGO_BLACK,
} from "@/config/config";
import FollowSection from "./FollowSection";
import CopyToClipboard from "@/components/buttons/CopyToClipboard";
import WalletCell from "@/components/views/WalletCell";

interface ProfileCardProps {
  profileAvatar?: any;
  profileBanner?: any;
  profileName: string;
  profileBio?: string;
  collections?: [];
  imgContent?: any[];
  textContent?: any;
  isEditable?: boolean;
  isShowFollowers?: boolean;
  isEdit?: boolean;
  setEdit?: any;
  bgColor?: string;
  sx?: {};
  editComponent?: any;
  nftsDialogComponent?: any;
  handleUploadBanner?: any;
  handleShowSelectNft?: any;
  followers?: any[] | string;
  followersTitle?: string;
  followings?: any[] | string;
  followingsTitle?: string;
  showAsCell?: boolean;
  loading?: boolean;
}

const ProfileCard = ({
  profileAvatar,
  profileBanner,
  profileName,
  profileBio,
  collections,
  imgContent = [],
  textContent = [],
  isEditable = false,
  isShowFollowers = false,
  isEdit = false,
  setEdit,
  editComponent,
  handleUploadBanner,
  handleShowSelectNft,
  nftsDialogComponent: NFTsDialog,
  followers,
  followersTitle = "Followers",
  followings,
  followingsTitle = "Followings",
  showAsCell = false,
  loading = false,
}: ProfileCardProps) => {
  const theme = useTheme();

  return (
    <section className="profile-box bg-surface mb-5 p-0 card overflow-hidden">
      <div className="banner bg-high-bg relative">
        <Image
          fill
          className="w-full h-full object-cover"
          src={profileBanner || `${IMAGE_PROXY_BANNER}${DEFAULT_BANNER}`}
          alt="banner"
        />
        {isEdit && (
          <div className="absolute top-0 left-0 w-full">
            <ProfileBanner height={124} editable upload={handleUploadBanner} />
          </div>
        )}
      </div>

      <div className="p-4 text-center">
        <div className="flex justify-center">
          {isShowFollowers && (
            <FollowSection
              title={followersTitle}
              list={followers}
              loading={loading}
            />
          )}

          <div className="avatar relative z-10 flex-shrink-0 -mt-14 mx-2 rounded-3xl shadow-sm overflow-hidden">
            {!loading ? (
              <Image
                fill
                className="icon-lg w-full h-full object-cover"
                src={profileAvatar || LOGO_BLACK}
                alt="avatar"
              />
            ) : (
              <Skeleton
                variant="rounded"
                sx={{ width: "100%", height: "100%" }}
              />
            )}
            {isEdit && (
              <IconButton
                className="absolute bg-black bg-opacity-70"
                sx={{
                  top: "30px",
                  left: "30px",
                }}
                onClick={() => handleShowSelectNft()}
              >
                <FileUpload />
              </IconButton>
            )}
          </div>

          {isShowFollowers && (
            <FollowSection
              title={followingsTitle}
              list={followings}
              loading={loading}
            />
          )}
        </div>

        {/* Vanity, Solana, Ether, Discord, Twitter and Bio */}
        {isEdit ? (
          editComponent
        ) : (
          <>
            <div className="p-4 pt-6 border-elevation2">
              <h3 className="text-primary mb-2 text-base font-bold">
                {profileName || ""}
              </h3>
              <p className="text-terciary font-medium text-sm mb-2">
                {profileBio || ""}
              </p>
              {!showAsCell &&
                textContent &&
                textContent.length > 0 &&
                map(
                  textContent,
                  (idx: any) =>
                    idx && (
                      <div className="text-terciary flex items-center justify-center gap-1 text-sm font-medium mt-3">
                        <p className="text-terciary text-xs font-medium">
                          {idx.title && `${idx.title} ${idx.value ? ":" : ""} `}
                        </p>
                        {idx.value ? (
                          <p className="text-terciary font-medium text-sm">
                            {idx.value}
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                    )
                )}
              {showAsCell && (
                <div className="grid grid-cols-2 gap-2">
                  {!loading ? (
                    map(textContent, (item: any, idx: number) => (
                      <WalletCell key={`cell-${idx}`} {...item} asCol />
                    ))
                  ) : (
                    <Skeleton
                      className="col-span-2"
                      width="100%"
                      height={32}
                      variant="rounded"
                    />
                  )}
                </div>
              )}
              <p className="flex items-center justify-center gap-1 text-sm font-medium my-2">
                {imgContent &&
                  imgContent.length > 0 &&
                  map(
                    imgContent,
                    (content: any) =>
                      content && (
                        <Avatar
                          variant="rounded"
                          className="button-small"
                          sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: "all .2s ease-in-out",
                            color:
                              theme.palette.mode === "dark"
                                ? theme.palette.warning.dark
                                : theme.palette.secondary.dark,
                            '&[aria-controls="menu-list-grow"],&:hover': {
                              background:
                                theme.palette.mode === "dark"
                                  ? theme.palette.warning.dark
                                  : theme.palette.secondary.dark,
                              color:
                                theme.palette.mode === "dark"
                                  ? theme.palette.grey[800]
                                  : theme.palette.secondary.light,
                            },
                          }}
                          aria-haspopup="true"
                          color="inherit"
                        >
                          {content.link ? (
                            <a
                              href={content.link}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Image
                                fill
                                src={content.img}
                                alt={content.alt}
                                className={content.class}
                              />
                            </a>
                          ) : (
                            <CopyToClipboard value={content.value}>
                              <Image
                                fill
                                src={content.img}
                                alt={content.alt}
                                className={content.class}
                              />
                            </CopyToClipboard>
                          )}
                        </Avatar>
                      )
                  )}
              </p>
            </div>

            {isEditable && (
              <button
                type="button"
                className="button-main mt-3"
                onClick={() => setEdit(true)}
              >
                Edit Profile
              </button>
            )}
          </>
        )}
      </div>

      {/* NFT Select Dialog */}
      {NFTsDialog && NFTsDialog}
    </section>
  );
};

export default ProfileCard;
