import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    useTheme,
    styled,
    Rating,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const MoreInfo = ({ product, openMoreModal, setMoreModal, reviews }) => {

    const theme = useTheme();

    const handleMoreModalClose = () => {
        setMoreModal(false);
    }

    return (
        <div>
            <BootstrapDialog
                onClose={handleMoreModalClose}
                aria-labelledby="customized-dialog-title"
                open={openMoreModal}
            >
                <DialogTitle sx={{ m: 0, p: 2, backgroundColor: theme.palette.background.alt, font: "bold" }} id="customized-dialog-title">
                    <h3> More information about {product.name}</h3>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleMoreModalClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: "white",
                        backgroundColor: theme.palette.background.alt
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers sx={{ backgroundColor: theme.palette.background.alt, minWidth: '600px', minHeight: "300px" }}>
                    {reviews.length > 0 ? reviews.map((review, index) => {
                        return (
                            <Card sx={{ minWidth: 275, backgroundColor: "#108b42" }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        <Rating value={Number(review.rating)} readOnly />
                                    </Typography>
                                    <Typography variant="body2">
                                        {review.review}
                                    </Typography>
                                </CardContent>
                            </Card>

                        )
                    }) : <div>No reviews yet</div>}
                </DialogContent>
            </BootstrapDialog>
        </div>
    )
}

export default MoreInfo