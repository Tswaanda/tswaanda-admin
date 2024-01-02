import React, { FC, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
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
import CloseIcon from "@mui/icons-material/Close";
import AccordionDetails from "@mui/material/AccordionDetails";
import {
  sendOrderApprovedEmail,
  sendOrderDeliveredEmail,
  sendOrderShippedEmail,
} from "../../../emails/orderUpdateEmails";
import { useAuth } from "../../../hooks/auth";
import {
  AdminMessage,
  AdminOrderUpdate,
  AppMessage,
  OrderStatus,
} from "../../../declarations/tswaanda_backend/tswaanda_backend.did";
import { ProductOrderType } from "../utils/types";
import { Principal } from "@dfinity/principal";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

type Props = {
  openStatusModal: boolean;
  updateOrderStatus: any;
  orderStatus: any;
  setStatusModal: any;
  setOrderStatus: any;
  updating: boolean;
  theme: any;
  modalOrder: ProductOrderType | null;
  updated: boolean;
  setUpdated: any;
};

const UpdateOrderStatusModal: FC<Props> = ({
  openStatusModal,
  updateOrderStatus,
  orderStatus,
  setStatusModal,
  setOrderStatus,
  updating,
  theme,
  modalOrder,
  updated,
  setUpdated,
}) => {
  const { backendActor, ws } = useAuth();

  const handleStatusModalClose = () => {
    setStatusModal(false);
  };

  const handleUpdateOrderStatus = async () => {
    const product = await backendActor.getProductById(
      modalOrder?.orderProducts.id
    );
    if (product.ok) {
      const farmerInfo = await backendActor.getFarmerByEmail(product.ok.farmer);
      if (farmerInfo.ok) {
        try {
          if (orderStatus === "approved") {
            // sendOrderApprovedEmail(farmerInfo.ok, modalOrder);
            await sendOrderUpdateWSMessage(orderStatus);
          } else if (orderStatus === "shipped") {
            // sendOrderShippedEmail(farmerInfo.ok, modalOrder);
            await sendOrderUpdateWSMessage(orderStatus);
          } else if (orderStatus === "delivered") {
            // sendOrderDeliveredEmail(farmerInfo.ok, modalOrder);
            await sendOrderUpdateWSMessage(orderStatus);
          } else {
            console.log("No email sent");
          }
        } catch (error) {
          console.log("Error sending email", error);
        }
      }
    }
    updateOrderStatus(modalOrder?.orderId);
  };

  useEffect(() => {
    if (updated) {
      setStatusModal(false);
      setUpdated(false);
    }
  }, [updated]);

  const getStatus = (status: string): OrderStatus => {
    switch (status) {
      case "pending":
        return { Pending: null };
      case "approved":
        return { Approved: null };
      case "shipped":
        return { Shipped: null };
      case "delivered":
        return { Delivered: null };
      case "completed":
        return { Completed: null };
      case "cancelled":
        return { Cancelled: null };
      case "rejected":
        return { Rejected: null };
      default:
        return { Pending: null };
    }
  };

  const sendOrderUpdateWSMessage = async (status: string) => {
    if (modalOrder) {
      let orderMsg: AdminOrderUpdate = {
        marketPlUserclientId: modalOrder.orderOwner.toString(),
        orderId: modalOrder.orderId,
        status: getStatus(status),
        timestamp: BigInt(Date.now()),
      };
      let adminMessage: AdminMessage = {
        OrderUpdate: orderMsg,
      };
      const msg: AppMessage = {
        FromAdmin: adminMessage,
      };
      ws.send(msg);
    }
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleStatusModalClose}
        aria-labelledby="customized-dialog-title"
        open={openStatusModal}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, backgroundColor: theme.palette.background.alt }}
          id="customized-dialog-title"
        >
          Update Order Status
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleStatusModalClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
            backgroundColor: theme.palette.background.alt,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers
          sx={{
            backgroundColor: theme.palette.background.alt,
            minWidth: "600px",
          }}
        >
          <div className="" style={{ minWidth: "500px" }}>
            <AccordionDetails>
              <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="status-label">Order status</InputLabel>
                  <Select
                    labelId="status-label"
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                  >
                    <MenuItem value="pending">Pending Approval</MenuItem>
                    <MenuItem value="approved">Approved-processing</MenuItem>
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
  );
};

export default UpdateOrderStatusModal;
