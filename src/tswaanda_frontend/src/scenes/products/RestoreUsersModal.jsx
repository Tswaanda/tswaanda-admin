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
import { Principal } from '@dfinity/principal';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const RestoreUsersModal = ({ openRestoreUsersModal, setRestoreUsersModal, getMarketStatistics }) => {
    const { marketActor } = useAuth();


    const [uploading, setUpLoading] = useState(false);
    const [jsonFile, setJsonFile] = useState(null);
    const [count, setCount] = useState(0);

    const theme = useTheme();

    const handleRestoreModalClose = () => {
        setRestoreUsersModal(false);
    }

    const handleInputChange = (e) => {
        setJsonFile(e.target.files[0]);
    }

    const handleUpload = async (e) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                setUpLoading(true);
                const restoredUsers = JSON.parse(e.target.result);
                if (Array.isArray(restoredUsers)) {
                    setCount(restoredUsers.length);
                    for (let user of restoredUsers) {
                        setCount(prevCount => prevCount - 1);
                        let updatedUser = {
                            id: user.id,
                            principal: Principal.fromText(user.userId),
                            created: BigInt(user.dateCreated),
                            body: [
                                {
                                    userName: user.userName,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    about: user.about,
                                    email: user.email,
                                    organization: user.organization,
                                    country: user.country,
                                    streetAddress: user.streetAdrees,
                                    city: user.city,
                                    province: user.province,
                                    zipCode: BigInt(user.zipCode),
                                    phoneNumber: BigInt(user.phoneNumber),
                                    profilePhoto: user.profilePhoto,
                                    kycIDCopy: user.kycIDCopy,
                                    proofOfAddressCopy: user.proofOfAddressCopy,
                                    status: "pending",
                                    isUpdated: user.isUpdated,
                                    isEmailVerified: user.isEmailVerified,
                                    membershipLevel: user.membershipLevel,
                                    userWebsite: user.userWebsite,
                                    pushNotification: {
                                        email: user.pushNotification.email,
                                        sms: user.pushNotification.sms,
                                        everything: user.pushNotification.everything,
                                    },
                                }
                            ]
                        }
                        console.log("Restoring user:", updatedUser);
                        await marketActor.createKYCRequest(updatedUser);
                        getMarketStatistics()
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
                open={openRestoreUsersModal}
            >
                <DialogTitle sx={{ m: 0, p: 2, backgroundColor: theme.palette.background.alt, font: "bold" }} id="customized-dialog-title">
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