import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, DialogContent } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { getAsset } from '../../storage-config/functions';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const ProofOfAddress = ({ setPOAModal, openPOAModal, showProofOfAddressDoc, customer }) => {
    const [isPdf, setIsPdf] = useState(false)

    const theme = useTheme();

    const handlePOAModalClose = () => {
        setPOAModal(false);
        showProofOfAddressDoc()
    };

    useEffect(() => {
        const getFile = async () => {
            try {
                let asset = await getAsset(customer.proofOfAddressCopy)
                console.log(asset)
                if (asset.ok.content_type === "application/pdf") {
                    setIsPdf(true)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getFile()

    }, [customer])

    const newPlugin = defaultLayoutPlugin()
    return (
        <div>
            <BootstrapDialog
                onClose={handlePOAModalClose}
                aria-labelledby="customized-dialog-title"
                open={openPOAModal}
            >
                <DialogTitle sx={{ m: 0, p: 2, backgroundColor: theme.palette.background.alt }} id="customized-dialog-title">
                    Proof of Address Document
                </DialogTitle>

                {!isPdf && <Button variant="outlined" color="primary" onClick={() => window.open(customer.proofOfAddressCopy, "_blank")} sx={{ m: 2 }}>
                    Download Document
                </Button>}
                <IconButton
                    aria-label="close"
                    onClick={handlePOAModalClose}
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
                <DialogContent dividers sx={{ backgroundColor: theme.palette.background.alt, }}>
                    <div className="" style={{ width: "900px", height: "900px", overflow: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {isPdf ? <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                            {customer
                                && (
                                    <Viewer fileUrl={customer.proofOfAddressCopy} plugins={[newPlugin]} />

                                )}
                        </Worker> :
                            <img src={customer.proofOfAddressCopy} alt="Proof of Address" style={{ width: "100%", height: "100%" }} />}
                    </div>
                </DialogContent>
            </BootstrapDialog>
        </div>
    )
}

export default ProofOfAddress