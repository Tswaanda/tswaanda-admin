import React, { FC } from "react";
import { Typography, Box, useTheme } from "@mui/material";

type Props = {
    title: string;
    subtitle: string;
};

const Header: FC<Props> = ({ title, subtitle }) => {
    const theme = useTheme();
    return (
        <Box>
        <Typography
            variant="h2"
            color={(theme.palette.secondary as any)[100]}
            fontWeight="bold"
            sx={{ mb: "5px" }}
        >
            {title}
        </Typography>
        <Typography
            variant="h5"
            color={(theme.palette.secondary as any)[300]}
        >
            {subtitle}
        </Typography>
        </Box>
    );
};

export default Header;
