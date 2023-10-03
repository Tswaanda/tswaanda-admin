import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Container,
    TextField,
    Button,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AccordionDetails from "@mui/material/AccordionDetails";
import { sendFarmerEmailMessage } from '../../emails/farmers';
import { toast } from "react-toastify";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));



const ContactFarmer = ({ farmer, setShowContactForm, theme, openContactModal, setContactModal }) => {

    const [sending, setSending] = useState(false)
    const [message, setMessage] = useState("")


    const handleContactModalClose = () => {
        setContactModal(false);
    }

    const handleEmailSend = async (e) => {
        e.preventDefault()
        setSending(true)
        console.log("sending")
        // try {
        //     if (message !== "") {
        //         await sendFarmerEmailMessage(message, farmer.email)
        //         toast.success(
        //             `Message sent to ${farmer.email} `,
        //             {
        //                 autoClose: 5000,
        //                 position: "top-center",
        //                 hideProgressBar: true,
        //             }
        //         );
        //         setSending(false)
        //     }
        // } catch (error) {
        //     console.log("Error sending email", error)
        //     toast.error(
        //         `Error sending message to ${farmer.email} `,
        //         {
        //             autoClose: 5000,
        //             position: "top-center",
        //             hideProgressBar: true,
        //         }
        //     );
        //     setSending(false)
        // }
    }

    return (
        <div>
            <BootstrapDialog
                onClose={handleContactModalClose}
                aria-labelledby="customized-dialog-title"
                open={openContactModal}
            >
                <DialogTitle sx={{ m: 0, p: 2, backgroundColor: theme.palette.background.alt }} id="customized-dialog-title">
                    Contact Farmer
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleContactModalClose}
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
                <DialogContent dividers sx={{ backgroundColor: theme.palette.background.alt, minWidth: '600px' }}>
                    <div className="" style={{ minWidth: '500px' }}>
                        <form onSubmit={handleEmailSend}>
                            <AccordionDetails>
                                <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
                                    <DialogTitle
                                        sx={{
                                            fontSize: "20px",
                                            fontWeight: "bold",
                                            color: "white",
                                        }}
                                    >
                                        Send Message to {farmer.email}
                                    </DialogTitle>
                                    <DialogContent>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            label="Message"
                                            type="text"
                                            multiline
                                            rows={4}
                                            defaultValue="Default Value"
                                            fullWidth
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => setShowContactForm(false)} variant="contained" sx={{
                                            backgroundColor: theme.palette.secondary.light,
                                            color: theme.palette.background.alt,
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            padding: "10px 20px",
                                        }} >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            disabled={sending}
                                            color="primary"
                                            onClick={handleEmailSend}
                                            sx={{
                                                backgroundColor: theme.palette.secondary.light,
                                                color: theme.palette.background.alt,
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                                padding: "10px 20px",
                                            }}
                                        >
                                            {sending ? "Sending..." : "Send Message"}
                                        </Button>
                                    </DialogActions>
                                </Container>
                            </AccordionDetails>
                        </form>
                    </div>

                </DialogContent>
            </BootstrapDialog>
        </div>
    )
}

export default ContactFarmer