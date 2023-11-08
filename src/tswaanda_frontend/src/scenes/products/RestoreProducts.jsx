import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    useTheme,
    styled,
    TextField,
    Button,
    DialogActions,
    Rating,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../hooks/auth';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const RestoreProducts = ({ openRestoreModal, setRestoreModal, setProductsUpdated }) => {

    const { backendActor } = useAuth()

    const [uploading, setUpLoading] = useState(false);
    const [jsonFile, setJsonFile] = useState(null);
    const [count, setCount] = useState(0);

    const theme = useTheme();

    const handleRestoreModalClose = () => {
        setRestoreModal(false);
    }

    const handleInputChange = (e) => {
        setJsonFile(e.target.files[0]);
    }

    const handleUpload = async (e) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                setUpLoading(true);
                const restoredProducts = JSON.parse(e.target.result);
                if (Array.isArray(restoredProducts)) {
                    setCount(restoredProducts.length);
                    for (let product of restoredProducts) {
                        setCount(prevCount => prevCount - 1);
                        let updatedProduct = {
                            ...product,
                            ordersPlaced: 0,
                            created: BigInt(product.created),
                        }
                        console.log("Restoring product:", updatedProduct);
                        await backendActor.createProduct(updatedProduct);
                        setProductsUpdated(true);
                    }
                    console.log("Data restored successfully!");
                } else {
                    console.log("Invalid data format!");
                }

                setUpLoading(false);
                setRestoreModal(false);
            } catch (error) {
                console.log("An error occurred while restoring data:", error);
            }
        };

        reader.onerror = (error) => {
            console.log("An error occurred while reading the file:", error);
        };

        reader.readAsText(jsonFile);
    }




    return (
        <div>
            <BootstrapDialog
                onClose={handleRestoreModalClose}
                aria-labelledby="customized-dialog-title"
                open={openRestoreModal}
            >
                <DialogTitle sx={{ m: 0, p: 2, backgroundColor: theme.palette.background.alt, font: "bold" }} id="customized-dialog-title">
                    <h3> Restore products from JSON  </h3>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleRestoreModalClose}
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
                <DialogContent dividers sx={{ backgroundColor: theme.palette.background.alt, minWidth: '300px', }}>
                    <TextField
                        margin="dense"
                        label="Image files"
                        type="file"
                        fullWidth
                        onChange={handleInputChange}
                    />
                    <DialogActions>
                        <Button
                            type="submit"
                            disabled={!jsonFile}
                            onClick={uploading ? null : handleUpload}
                            variant="contained"
                            color="success"
                            sx={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                padding: "10px 20px",
                            }}
                        >
                            {uploading && `Uploading products... ${count}`}
                            {!uploading && "Upload products"}
                        </Button>
                    </DialogActions>

                </DialogContent>
            </BootstrapDialog>
        </div>
    )
}

export default RestoreProducts