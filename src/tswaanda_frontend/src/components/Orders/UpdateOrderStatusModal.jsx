import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    MenuItem,
    FormControl,
    InputLabel,
    Container,
    Button,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AccordionDetails from "@mui/material/AccordionDetails";
import { sendOrderApprovedEmail, sendOrderDeliveredEmail, sendOrderShippedEmail } from '../../emails/orderUpdateEmails';
import { useAuth } from '../../hooks/auth';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const UpdateOrderStatusModal = ({ openStatusModal, updateOrderStatus, orderStatus, setStatusModal, setOrderStatus, updating, theme, modalOrder, updated,
    setUpdated }) => {

    const { backendActor } = useAuth()

    const handleStatusModalClose = () => {
        setStatusModal(false);
    }

    const handleUpdateOrderStatus = async () => {
        const product = await backendActor.getProductById(modalOrder.orderProducts.id)
        if (product.ok) {
            const farmerInfo = await backendActor.getFarmerByEmail(product.ok.farmer)
            if (farmerInfo.ok) {
                try {
                    if (orderStatus === "approved") {
                        // sendOrderApprovedEmail(farmerInfo.ok, modalOrder)
                    } else if (orderStatus === "shipped") {
                        // sendOrderShippedEmail(farmerInfo.ok, modalOrder)
                    } else if (orderStatus === "delivered") {
                        // sendOrderDeliveredEmail(farmerInfo.ok, modalOrder)
                        console.log(modalOrder)
                    } else {
                        console.log("No email sent")
                    }
                } catch (error) {
                    console.log("Error sending email", error)
                }
            }
        }
        // updateOrderStatus(modalOrder.orderId)
    }

    useEffect(() => {
        if (updated) {
            setStatusModal(false)
            setUpdated(false)
        }
    }, [updated])

    return (
        <div>
            <BootstrapDialog
                onClose={handleStatusModalClose}
                aria-labelledby="customized-dialog-title"
                open={openStatusModal}
            >
                <DialogTitle sx={{ m: 0, p: 2, backgroundColor: theme.palette.background.alt }} id="customized-dialog-title">
                    Update Order Status
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleStatusModalClose}
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
                        <AccordionDetails>
                            <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
                                <FormControl fullWidth margin="dense">
                                    <InputLabel id="status-label">Order status</InputLabel>
                                    <Select
                                        labelId="status-label"
                                        onChange={(e) => setOrderStatus(e.target.value)}
                                    >
                                        <MenuItem value="pending">
                                            Pending Approval
                                        </MenuItem>
                                        <MenuItem value="approved">
                                            Approved-processing
                                        </MenuItem>
                                        <MenuItem value="shipped">Shipped</MenuItem>
                                        <MenuItem value="delivered">Delivered</MenuItem>
                                    </Select>
                                </FormControl>

                                <Button
                                    variant="contained"
                                    disabled={updating}
                                    color="primary"
                                    onClick={handleUpdateOrderStatus}
                                    sx={{
                                        backgroundColor: theme.palette.secondary.light,
                                        color: theme.palette.background.alt,
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        padding: "10px 20px",
                                    }}
                                >
                                    {updating ? "Updating..." : "Update Order"}
                                </Button>
                            </Container>
                        </AccordionDetails>
                    </div>

                </DialogContent>
            </BootstrapDialog>
        </div>
    )
}

export default UpdateOrderStatusModal