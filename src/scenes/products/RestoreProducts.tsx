import React, { FC, useEffect, useState } from 'react';
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
import { Product } from '../../declarations/tswaanda_backend/tswaanda_backend.did';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

type Props = {
    openRestoreProductsModal: boolean;
    setRestoreProductsModal: any;
    getAdminStatistics: any;
}

const RestoreProducts: FC<Props> = ({ openRestoreProductsModal, setRestoreProductsModal, getAdminStatistics }) => {

    const { backendActor } = useAuth()

    const [uploading, setUpLoading] = useState(false);
    const [jsonFile, setJsonFile] = useState(null);
    const [count, setCount] = useState(0);

    const theme = useTheme();

    const handleRestoreModalClose = () => {
        setRestoreProductsModal(false);
    }

    const handleInputChange = (e:any) => {
        setJsonFile(e.target.files[0]);
    }

      const handleUpload = async (): Promise<void> => {
        if (!jsonFile) {
          return;
        }
      
     
        const reader = new FileReader();
      
        reader.onload = async (event: ProgressEvent<FileReader>) => {
          try {
            setUpLoading(true);
            const restoredProducts = JSON.parse(event.target?.result as string) as Product[];
      
            if (Array.isArray(restoredProducts)) {
              setCount(restoredProducts.length);
              for (let product of restoredProducts) {
                setCount(prevCount => prevCount - 1);
                let updatedProduct: Product = {
                  ...product,
                  ordersPlaced: 0,
                  created: BigInt(product.created),
                };
      
                console.log("Restoring product:", updatedProduct);
                await backendActor.createProduct(updatedProduct);
                getAdminStatistics();
              }
              console.log("Data restored successfully!");
            } else {
              console.log("Invalid data format!");
            }
      
            setUpLoading(false);
          } catch (error) {
            console.log("An error occurred while restoring data:", error);
            setUpLoading(false);
          }
        };
      
        reader.onerror = (error: ProgressEvent<FileReader>) => {
          console.log("An error occurred while reading the file:", error);
        };
      
        reader.readAsText(jsonFile);
      };
      




    return (
        <div>
            <BootstrapDialog
                onClose={handleRestoreModalClose}
                aria-labelledby="customized-dialog-title"
                open={openRestoreProductsModal}
            >
                <DialogTitle sx={{ m: 0, p: 2, backgroundColor: theme.palette.background.default, font: "bold" }} id="customized-dialog-title">
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
                        backgroundColor: theme.palette.background.default
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers sx={{ backgroundColor: theme.palette.background.default, minWidth: '300px', }}>
                    <TextField
                        margin="dense"
                        label=" files"
                        type="file"
                        fullWidth
                        onChange={handleInputChange}
                    />
                    <DialogActions>
                        <Button
                            disabled={!jsonFile}
                            onClick={uploading ? undefined : handleUpload}
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