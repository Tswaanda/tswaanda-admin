import React, { FC } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import FlexBetween from './FlexBetween';

type Props = {
    title: string,
    value: string,
    increase: string,
    icon: any,
    description: string
}

const StatBox: FC<Props> = ({ title, value, increase, icon, description }) => {
    const theme = useTheme();
    return (
        <Box
            gridColumn="span 2"
            gridRow="span 1"
            display="flex"
            component="div"
            flexDirection="column"
            justifyContent="space-between"
            p="1.25rem 1rem"
            flex="1 1 100%"
            sx={{ backgroundColor: theme.palette.background.default }}
            borderRadius="0.55rem"
        >
            <FlexBetween>
                <Typography variant='h6' sx={{ color: (theme.palette.secondary as any)[100] }}>
                    {title}
                </Typography>
                {icon}
            </FlexBetween>

                <Typography
                    variant='h3' 
                    fontWeight="600" 
                    sx={{ color: (theme.palette.secondary as any)[200] }}
                >
                    {value}
                </Typography>
            <FlexBetween gap="1rem">
                <Typography
                    variant='h5' 
                    fontStyle="italic" 
                    sx={{ color: (theme.palette.secondary as any).light }}
                >
                    {increase}
                </Typography>
                <Typography>{description}</Typography>
            </FlexBetween>

        </Box>
    )
}

export default StatBox