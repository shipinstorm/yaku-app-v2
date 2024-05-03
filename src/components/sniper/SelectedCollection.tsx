/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { localCollectionDataAtom, localCollectionDataPriceAtom } from 'views/yaku/sniping/recoil/atom/HaloLabsAtom';
import { useRecoilState } from 'recoil';
import SolanaLogo from 'assets/images/blockchains/solana-icon.svg';
import { Transition } from '@headlessui/react';
import { Avatar, Box, Checkbox, FormControlLabel, FormGroup, Grid, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { Image } from 'mui-image';
import { NumberInput } from 'components/inputs/NumberInput';
import { CloseOutlined } from '@mui/icons-material';
import { cloneDeep, isNumber } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { IMAGE_PROXY, RARITY_COLORS } from 'config/config';
import './rainbow.css';
import useLocalStorage from 'hooks/useLocalStorage';

const SelectedCollection = ({ collectionData, removeCollection }: any) => {
    const theme = useTheme();
    const showRarityPickers = true;
    const [localCollectionData, setLocalCollectionData] = useRecoilState<any>(localCollectionDataAtom);
    const [localCollectionDataPrice, setLocalCollectionDataPrice] = useRecoilState<any>(localCollectionDataPriceAtom);

    const [cacheSniperSetting, setCacheSniperSetting] = useLocalStorage('sniper-setting', {});

    const newPrice = (value: number) => {
        const newLocalCollectionData = cloneDeep(localCollectionData);
        const newLocalCollectionDataPrice = cloneDeep(localCollectionDataPrice);

        newLocalCollectionData[collectionData.id].autoSnipe = false;

        if (String(value).length === 0) {
            newLocalCollectionData[collectionData.id].price = 0;
            newLocalCollectionDataPrice[collectionData.id].price = 0;
        } else {
            newLocalCollectionData[collectionData.id].price = Number(value);
            newLocalCollectionDataPrice[collectionData.id].price = Number(value);

            setLocalCollectionData(newLocalCollectionData);
            setLocalCollectionDataPrice(newLocalCollectionDataPrice);
            setCacheSniperSetting({
                ...cacheSniperSetting,
                collectionData: newLocalCollectionData,
                collectionDataPrice: newLocalCollectionDataPrice
            });
        }
    };

    const rarityClick = (rarityValue: string) => {
        if (localCollectionData[collectionData.id].hasRarityData) {
            const newLocalCollectionData = cloneDeep(localCollectionData);

            newLocalCollectionData[collectionData.id].rarity[rarityValue] = !newLocalCollectionData[collectionData.id].rarity[rarityValue];
            setLocalCollectionData(newLocalCollectionData);

            setCacheSniperSetting({
                ...cacheSniperSetting,
                collectionData: newLocalCollectionData
            });
        }
    };

    const snipeMode = () => {
        const newLocalCollectionData = cloneDeep(localCollectionData);
        newLocalCollectionData[collectionData.id].autoSnipe = !newLocalCollectionData[collectionData.id].autoSnipe;
        setLocalCollectionData(newLocalCollectionData);
        setCacheSniperSetting({
            ...cacheSniperSetting,
            collectionData: newLocalCollectionData
        });
    };

    return (
        <Transition
            enter="transition duration-300 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-100 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
            show
            appear
        >
            <Box
                sx={{
                    position: 'relative',
                    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                    minWidth: '100%',
                    maxWidth: '100%',
                    minHeight: '124px',
                    maxHeight: '124px',
                    background: theme.palette.mode === 'dark' ? theme.palette.dark[800] : '#fff',
                    pt: '16.83px',
                    pb: '21.26px',
                    pr: '20.19px',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    overflowY: 'hidden',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.primary[200] + 75
                }}
            >
                <Grid container>
                    <Grid
                        item
                        xs={showRarityPickers && localCollectionData[collectionData.id]?.hasRarityData ? 6 : 12}
                        md={showRarityPickers && localCollectionData[collectionData.id]?.hasRarityData ? 6 : 12}
                        lg={showRarityPickers && localCollectionData[collectionData.id]?.hasRarityData ? 5 : 12}
                        sx={{
                            display: 'flex',
                            gap: { xs: '2px', xl: '6px' },
                            overflow: 'hidden',
                            alignItems: 'center'
                        }}
                    >
                        <Avatar
                            src={`${IMAGE_PROXY}${collectionData.image}`}
                            alt="img"
                            sx={{ xs: 30, xl: 45, marginRight: '4px', background: 'none' }}
                        />
                        <Typography
                            component="div"
                            sx={{
                                minWidth: 0,
                                width: '100%',
                                maxWidth: '100%',
                                fontWeight: 700,
                                fontSize: '14px',
                                lineHeight: '21px'
                            }}
                            noWrap
                        >
                            {collectionData.name}
                        </Typography>
                    </Grid>
                    {showRarityPickers && localCollectionData[collectionData.id]?.hasRarityData && (
                        <Grid
                            item
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                userSelect: 'none'
                            }}
                            xs={6}
                            md={6}
                            lg={7}
                        >
                            <Tooltip title="Common">
                                <Avatar
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '12px',
                                        lineHeight: '18px',
                                        width: '22px',
                                        height: '22px',
                                        background: localCollectionData[collectionData.id]?.rarity?.C ? RARITY_COLORS.C : '#494747',
                                        cursor: localCollectionData[collectionData.id]?.hasRarityData ? ' cursor-pointer' : ' not-allowed',
                                        color: localCollectionData[collectionData.id]?.rarity?.C ? 'white' : '#747688'
                                    }}
                                    variant="rounded"
                                    className="transition duration-150"
                                    onClick={() => rarityClick('C')}
                                >
                                    C
                                </Avatar>
                            </Tooltip>
                            <Tooltip title="Uncommon">
                                <Avatar
                                    sx={{
                                        width: '22px',
                                        height: '22px',
                                        background: localCollectionData[collectionData.id]?.rarity?.U ? RARITY_COLORS.U : '#494747',
                                        cursor: localCollectionData[collectionData.id]?.hasRarityData ? ' cursor-pointer' : ' not-allowed',
                                        fontWeight: 700,
                                        fontSize: '12px',
                                        lineHeight: '18px',
                                        color: localCollectionData[collectionData.id]?.rarity?.U ? 'white' : '#747688'
                                    }}
                                    variant="rounded"
                                    className="transition duration-150"
                                    onClick={() => rarityClick('U')}
                                >
                                    U
                                </Avatar>
                            </Tooltip>
                            <Tooltip title="Rare">
                                <Avatar
                                    sx={{
                                        width: '22px',
                                        height: '22px',
                                        background: localCollectionData[collectionData.id]?.rarity?.R ? RARITY_COLORS.R : '#494747',
                                        cursor: localCollectionData[collectionData.id]?.hasRarityData ? ' cursor-pointer' : ' not-allowed',
                                        fontWeight: 700,
                                        fontSize: '12px',
                                        lineHeight: '18px',
                                        color: localCollectionData[collectionData.id]?.rarity?.R ? 'white' : '#747688'
                                    }}
                                    variant="rounded"
                                    className="transition duration-150"
                                    onClick={() => rarityClick('R')}
                                >
                                    R
                                </Avatar>
                            </Tooltip>
                            <Tooltip title="Epic">
                                <Avatar
                                    sx={{
                                        width: '22px',
                                        height: '22px',
                                        background: localCollectionData[collectionData.id]?.rarity?.E ? RARITY_COLORS.E : '#494747',
                                        cursor: localCollectionData[collectionData.id]?.hasRarityData ? ' cursor-pointer' : ' not-allowed',
                                        fontWeight: 700,
                                        fontSize: '12px',
                                        lineHeight: '18px',
                                        color: localCollectionData[collectionData.id]?.rarity?.E ? 'white' : '#747688'
                                    }}
                                    variant="rounded"
                                    className="transition duration-150"
                                    onClick={() => rarityClick('E')}
                                >
                                    E
                                </Avatar>
                            </Tooltip>
                            <Tooltip title="Legendary">
                                <Avatar
                                    sx={{
                                        width: '22px',
                                        height: '22px',
                                        background: localCollectionData[collectionData.id]?.rarity?.L ? RARITY_COLORS.L : '#494747',
                                        cursor: localCollectionData[collectionData.id]?.hasRarityData ? ' cursor-pointer' : ' not-allowed',
                                        fontWeight: 700,
                                        fontSize: '12px',
                                        lineHeight: '18px',
                                        color: localCollectionData[collectionData.id]?.rarity?.L ? 'white' : '#747688'
                                    }}
                                    variant="rounded"
                                    className="transition duration-150"
                                    onClick={() => rarityClick('L')}
                                >
                                    L
                                </Avatar>
                            </Tooltip>
                            <Tooltip title="Mythic">
                                <Avatar
                                    sx={{
                                        width: '22px',
                                        height: '22px',
                                        background: localCollectionData[collectionData.id]?.rarity?.M ? RARITY_COLORS.M : '#494747',
                                        cursor: localCollectionData[collectionData.id]?.hasRarityData ? ' cursor-pointer' : ' not-allowed',
                                        fontWeight: 700,
                                        fontSize: '12px',
                                        lineHeight: '18px',
                                        color: localCollectionData[collectionData.id]?.rarity.M ? 'white' : '#747688'
                                    }}
                                    variant="rounded"
                                    className="transition duration-150"
                                    onClick={() => rarityClick('M')}
                                >
                                    M
                                </Avatar>
                            </Tooltip>
                        </Grid>
                    )}
                </Grid>
                <Grid
                    container
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        pt: '4px'
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                            position: 'relative'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                gap: '5px',
                                userSelect: 'none',
                                overflowX: 'hidden'
                            }}
                        >
                            <NumberInput
                                value={
                                    localCollectionDataPrice[collectionData.id]?.price ||
                                    cacheSniperSetting?.collectionDataPrice[collectionData.id]?.price
                                }
                                min={0}
                                step={0.001}
                                precision={3}
                                placeholder="Max Price"
                                onChange={(value) => {
                                    if (value && isNumber(value) && value > 0) {
                                        newPrice(value);
                                    }
                                }}
                            />
                            <Image width={16.83} src={SolanaLogo} alt="SOL" style={{ marginLeft: '-100px' }} />
                        </Box>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="secondary"
                                        checked={localCollectionData[collectionData.id]?.autoSnipe}
                                        onChange={() => snipeMode()}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                }
                                label={
                                    <Typography noWrap>
                                        <FormattedMessage id="auto-snipe" />
                                    </Typography>
                                }
                            />
                        </FormGroup>

                        {/* <LoadingButton
                            color="secondary"
                            loading={localCollectionData[collectionData.id]?.autoSnipe}
                            variant="contained"
                            sx={{
                                lineHeight: 1
                            }}
                            startIcon={
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M0 7.5C0 3.63401 3.13401 0.5 7 0.5C10.866 0.5 14 3.63401 14 7.5C14 11.366 10.866 14.5 7 14.5C3.13401 14.5 0 11.366 0 7.5ZM6.36364 1.80768V3.36364C6.36364 3.71509 6.64855 4 7 4C7.35145 4 7.63636 3.71509 7.63636 3.36364V1.80768C10.291 2.10114 12.3989 4.20897 12.6923 6.86364H10.8182C10.4667 6.86364 10.1818 7.14855 10.1818 7.5C10.1818 7.85145 10.4667 8.13636 10.8182 8.13636H12.6923C12.3989 10.791 10.291 12.8989 7.63636 13.1923V11.6364C7.63636 11.2849 7.35145 11 7 11C6.64855 11 6.36364 11.2849 6.36364 11.6364V13.1923C3.70897 12.8989 1.60114 10.791 1.30768 8.13636H2.86364C3.21509 8.13636 3.5 7.85145 3.5 7.5C3.5 7.14855 3.21509 6.86364 2.86364 6.86364H1.30768C1.60114 4.20897 3.70897 2.10114 6.36364 1.80768Z"
                                        fill="white"
                                    />
                                </svg>
                            }
                            loadingPosition="start"
                            onClick={() => snipeMode()}
                        >
                            <FormattedMessage id={localCollectionData[collectionData.id]?.autoSnipe ? 'auto-snipe' : 'manual-snipe'} />
                        </LoadingButton> */}
                    </Grid>
                </Grid>
                <IconButton
                    size="small"
                    sx={{ position: 'absolute', color: '#d9d9d9', top: '0px', right: '0px' }}
                    onClick={() => removeCollection(collectionData)}
                >
                    <CloseOutlined />
                </IconButton>
            </Box>
        </Transition>
    );
};

export default SelectedCollection;
