import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FileUpload } from "@mui/icons-material";
import Loading from "@/components/loaders/Loading";
import { useToasts } from "@/hooks/useToasts";
import { useCallback, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import getCroppedImg from "@/utils/cropImage";
// import { useTheme } from "@mui/styles";
import CropDialogContent from "./CropDialogContent";

const ProfileBanner = ({
  height = 360,
  editable = false,
  upload,
  url,
}: any) => {
  // const theme = useTheme();
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
    <Box className="h-32 z-[1] relative">
      {editable && (
        <Box className="absolute inset-0 bg-[#00000066] justify-center items-center flex p-4 z-20">
          <ImageUploading
            value={images}
            onChange={onChange}
            acceptType={["jpg", "gif", "png"]}
            maxFileSize={3.5 * 1024 * 1024}
          >
            {({ imageList, onImageUpload, errors }) => (
              <>
                {!isLoading ? (
                  <>
                    <IconButton
                      className="bg-[#00000070]"
                      onClick={onImageUpload}
                    >
                      <FileUpload />
                    </IconButton>
                    <div className="mr-2 text-red-400">
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
                    onClose={() => setShowCrop(false)}
                    fullWidth
                    maxWidth="md"
                  >
                    <DialogContent>
                      <CropDialogContent
                        // theme={theme}
                        image={imageList[0].dataURL}
                        onCropComplete={onCropComplete}
                        crop={crop}
                        zoom={zoom}
                        setCrop={setCrop}
                        setZoom={setZoom}
                      />
                    </DialogContent>
                    <DialogActions>
                      <LoadingButton
                        variant="contained"
                        color="secondary"
                        loading={isLoading}
                        className="w-20 mr-4 bg-gray-600 text-white rounded-xl shadow-sm duration-300 hover:bg-gray-900"
                        onClick={uploadImage}
                      >
                        Confirm
                      </LoadingButton>
                    </DialogActions>
                  </Dialog>
                )}
              </>
            )}
          </ImageUploading>
        </Box>
      )}
    </Box>
  );
};

export default ProfileBanner;
