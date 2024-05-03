import { Slider } from '@mui/material';
import Cropper from 'react-easy-crop';

const CropDialogContent = ({ theme, image, crop, zoom, setCrop, onCropComplete, setZoom }: any) => (
    <>
        <div className="relative w-full h-100 bg-[#333] sm:h-150">
            <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={308 / 124}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
            />
        </div>
        <div className="p-4 flex flex-col items-stretch sm:flex-row sm: items-center">
            <div className="flex flex-1 items-center my-2">
                <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    color="secondary"
                    className=""
                    sx={{
                        root: {
                            padding: '22px 0px',
                            marginLeft: 32,
                            [theme.breakpoints.up('sm')]: {
                                flexDirection: 'row',
                                alignItems: 'center',
                                margin: '0 16px'
                            }
                        }
                    }}
                    onChange={(e, _zoom) => setZoom(_zoom)}
                />
            </div>
        </div>
    </>
);

export default CropDialogContent;
