import { useCallback, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import Cropper from "react-easy-crop";
import Image from "mui-image";

import { Dialog, DialogBody, Slider } from "@material-tailwind/react";

import { IconUpload } from "@tabler/icons-react";

import Loading from "@/components/loaders/Loading";

import { DEFAULT_BANNER, IMAGE_PROXY_BANNER } from "@/config/config";

import useAuth from "@/hooks/useAuth";
import { useToasts } from "@/hooks/useToasts";

import getCroppedImg from "@/utils/cropImage";

const CropDialogContent = ({
  image,
  crop,
  zoom,
  setCrop,
  onCropComplete,
  setZoom,
}: any) => (
  <>
    <div
      // style={{
      //   position: "relative",
      //   width: "100%",
      //   height: 400,
      //   background: "#333",
      // }}
      className="sm:h-[600px]"
    >
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1920 / 400}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
    </div>
    <div
      // style={{
      //   padding: 16,
      //   display: "flex",
      //   flexDirection: "column",
      //   alignItems: "stretch",
      // }}
      className="sm:flex-row sm:items-center"
    >
      <div
      // style={{
      //   display: "flex",
      //   flex: "1",
      //   alignItems: "center",
      //   marginTop: 8,
      //   marginBottom: 8,
      // }}
      >
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          className="sm:flex-row sm:items-center sm:mx-4 py-[22px] ml-8"
          // onChange={(e, _zoom) => setZoom(_zoom)}
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
      </div>
    </div>
  </>
);
const ProfileBanner = ({
  height = 360,
  editable = false,
  upload,
  url,
}: any) => {
  const { user } = useAuth();
  const [images, setImages] = useState<ImageListType>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showErrorToast, showSuccessToast } = useToasts();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const uploadImage = async () => {
    setIsLoading(true);
    try {
      const croppedImage = await getCroppedImg(
        images[0].dataURL!,
        croppedAreaPixels,
        0
      );
      await upload(croppedImage);
      showSuccessToast("Successfully updated banner.");
      setShowCrop(false);
    } catch (error) {
      showErrorToast("There is some error when uploading, please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const onCropComplete = useCallback(
    (croppedArea: any, _croppedAreaPixels: any) => {
      setCroppedAreaPixels(_croppedAreaPixels);
    },
    []
  );
  const onChange = async (
    imageList: ImageListType,
    addUpdateIndex?: number[]
  ) => {
    setImages(imageList);
    setShowCrop(true);
  };
  return (
    <div className="w-[calc(100% + 40px)] -m-20 bg-black z-1 relative">
      <Image
        src={user.banner || url || `${IMAGE_PROXY_BANNER}${DEFAULT_BANNER}`}
        fit="cover"
        className="w-full"
      />
      {editable && (
        <div className="w-[calc(100% + 60px)] md:w-[calc(100% + 60px)] sm:w-[calc(100% + 40px)] xs:w-[calc(100% + 30px)] absolute bottom-0 left-0 top-0 right-0 bg-black bg-opacity-60 justify-center items-center flex p-8 z-20">
          <ImageUploading
            value={images}
            onChange={onChange}
            acceptType={["jpg", "gif", "png"]}
            maxFileSize={3.5 * 1024 * 1024}
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
              errors,
            }) => (
              <>
                {!isLoading ? (
                  <>
                    <button
                      className="p-2 rounded-full bg-black bg-opacity-25"
                      onClick={() => onImageUpload()}
                    >
                      <IconUpload />
                    </button>
                    <div
                    // style={{ color: "red", marginLeft: 1 }}
                    >
                      {errors &&
                        errors.maxFileSize &&
                        "Image should be less than 3.5MB."}
                    </div>
                  </>
                ) : (
                  <Loading />
                )}

                {imageList && imageList[0] && (
                  <Dialog
                    open={showCrop}
                    handler={() => {}}
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    <DialogBody
                      placeholder=""
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      <CropDialogContent
                        image={imageList[0].dataURL}
                        onCropComplete={onCropComplete}
                        crop={crop}
                        zoom={zoom}
                        setCrop={setCrop}
                        setZoom={setZoom}
                      />
                    </DialogBody>
                    <div>
                      <button
                        onClick={() => uploadImage()}
                        className="bg-secondary text-white rounded-full px-4 py-2 mr-2"
                      >
                        Confirm
                      </button>
                    </div>
                  </Dialog>
                )}
              </>
            )}
          </ImageUploading>
        </div>
      )}
    </div>
  );
};

export default ProfileBanner;
