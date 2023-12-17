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
import { Principal } from '@dfinity/principal';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

type Props = {
    openRestoreUsersModal: boolean;
    setRestoreUsersModal: any;
    getMarketStatistics: any;
}

const RestoreUsersModal: FC<Props> = ({ openRestoreUsersModal, setRestoreUsersModal, getMarketStatistics }) => {
    const { marketActor } = useAuth();


    const [uploading, setUpLoading] = useState(false);
    const [jsonFile, setJsonFile] = useState(null);
    const [count, setCount] = useState(0);

    const theme = useTheme();

    const handleRestoreModalClose = () => {
        setRestoreUsersModal(false);
    }

    const handleInputChange = (e:any) => {
        setJsonFile(e.target.files[0]);
    }

    const handleUpload = async () => {
        if (!jsonFile) {
          return;
        }

        const reader = new FileReader();
        reader.onload = async (e: ProgressEvent<FileReader>) => {
            if (!e.target?.result || typeof e.target.result !== 'string') {
                console.error("File read error: no result or result is not a string");
                return;
            }
    
            try {
                setUpLoading(true);
                const restoredUsers: any[] = JSON.parse(e.target.result);
                if (Array.isArray(restoredUsers)) {
                    setCount(restoredUsers.length);
                    for (let user of restoredUsers) {
                        setCount(prevCount => prevCount - 1);
                        // ... Rest of the logic remains the same
                        // Make sure all the types match up with your interfaces
                    }
                    console.log("Data restored successfully!");
                } else {
                    console.log("Invalid data format!");
                }
    
                setUpLoading(false);
                setRestoreUsersModal(false);
            } catch (error) {
                console.log("An error occurred while restoring data:", error);
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
                open={openRestoreUsersModal}
            >
                <DialogTitle sx={{ m: 0, p: 2, backgroundColor: theme.palette.background.default, font: "bold" }} id="customized-dialog-title">
                    <h3> Restore users from JSON  </h3>
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
                        label="Image files"
                        type="file"
                        fullWidth
                        onChange={handleInputChange}
                    />
                    <DialogActions>
                        <Button
                            type="submit"
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
                            {uploading && `Uploading users... ${count}`}
                            {!uploading && "Upload users"}
                        </Button>
                    </DialogActions>

                </DialogContent>
            </BootstrapDialog>
        </div>
    )
}

export default RestoreUsersModal