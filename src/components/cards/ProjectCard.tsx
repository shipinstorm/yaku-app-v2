/* eslint-disable */
import { useEffect, useState } from 'react';

// material-ui
import { CardContent, CardMedia, Box, Typography, Chip } from '@mui/material';

// project-imports
import { KeyedObject } from '@/types';
import MainCard from '@/components/MainCard';
import SkeletonProductPlaceholder from '@/components/skeleton/CardPlaceholder';
import { IMAGE_PROXY } from '@/config/config';

interface ProjectCardProps extends KeyedObject {
    image: string;
    name: string;
    nameTag?: string;
    description?: string;
    onClick?: Function;
    children?: any;
    sqaure?: boolean;
    height?: number;
}

const ProjectCard = ({
    image,
    name,
    nameTag,
    description,
    onClick,
    children,
    sqaure = false,
    cssClass = '',
    useProxy = true,
    height = 250,
    truncate = true
}: ProjectCardProps) => {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <>
            {isLoading ? (
                <SkeletonProductPlaceholder />
            ) : (
                <MainCard
                    border={false}
                    content={false}
                    className={`card shadow-none ${cssClass}`}
                    sx={{ cursor: 'pointer', minWidth: `calc(${height}px + 1rem)` }}
                    onClick={onClick}
                >
                    <CardMedia
                        className={`rounded-3xl m-2 ${sqaure ? 'aspect-square' : ''}`}
                        sx={{ height, width: sqaure ? height : 'auto' }}
                        image={`${useProxy ? IMAGE_PROXY : ''}${image}`}
                        title={name}
                    />
                    <CardContent
                        className={!truncate ? '' : '!pb-[4px]'}
                        sx={{ px: !truncate ? 2 : 0, pb: !truncate ? 2 : 0, pt: 0 }}
                    >
                        <Box display="flex" flexDirection="column" alignItems="center" className="pt-2 px-2 overflow-hidden">
                            <h4 className={`text-primary text-base ${truncate ? 'truncate' : ''}`}>{name}</h4>
                            {nameTag && <Chip size="small" label={nameTag} />}
                            <h6
                                className={`text-terciary text-center w-[90%] overflow-hidden text-xs ${truncate ? 'truncate' : ''}`}
                                style={{ minHeight: 19 }}
                            >
                                {description}
                            </h6>
                            {children}
                        </Box>
                    </CardContent>
                </MainCard>
            )}
        </>
    );
};

export default ProjectCard;
