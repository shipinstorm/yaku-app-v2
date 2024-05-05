/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Avatar, Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { showSearchAtom } from '@app/sniping/recoil/atom/HaloLabsAtom';
import { AddOutlined } from '@mui/icons-material';
import { IMAGE_PROXY } from '@/config/config';

const EachSearchResult = ({ collectionData, addCollection }: any) => {
    const [addingCollection] = useState(false);
    const [showSearch, setShowSearch] = useRecoilState(showSearchAtom);

    const compAddCollection = async () => {
        if (!addingCollection) {
            addCollection(collectionData);
            setShowSearch(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '58px',
                maxHeight: '58px',
                minWidth: '100%',
                maxWidth: '100%',
                display: 'flex',
                overflowX: 'hidden',
                alignItems: 'center'
            }}
        >
            <Box
                sx={{
                    minHeight: '100%',
                    height: '100%',
                    maxHeight: '100%',
                    minWidth: 0,
                    width: '100%',
                    maxWidth: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    overflowX: 'hidden'
                }}
            >
                <Avatar src={`${IMAGE_PROXY}${collectionData.image}`} alt="img" sx={{ width: 56, height: 56, background: 'none' }} />

                <Typography
                    component="div"
                    sx={{
                        minWidth: 0,
                        width: '100%',
                        maxWidth: '100%',
                        fontWeight: 700,
                        fontSize: '15px'
                    }}
                    noWrap
                >
                    {collectionData.name}
                </Typography>
            </Box>
            <Button
                sx={{
                    paddingLeft: '7px',
                    paddingRight: '7px',
                    fontWeight: 700,
                    fontSize: '15px',
                    borderRadius: '5px',
                    minWidth: 'unset',
                    cursor: addingCollection ? 'wait' : ' pointer'
                }}
                color="secondary"
                variant="contained"
                onClick={() => compAddCollection()}
            >
                <AddOutlined />
            </Button>
        </Box>
    );
};

export default EachSearchResult;
