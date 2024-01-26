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
  AppMessage,
  OrderStatus,
  UserNotification,
} from "../../../declarations/tswaanda_backend/tswaanda_backend.did";
import { ProductOrderType } from "../utils/types";
import { v4 as uuidv4 } from "uuid";

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
    if (modalOrder) {
      const product = await backendActor?.getProductById(
        modalOrder.orderProducts.id
      );
      if (product) {
        if ("ok" in product) {
          const farmerInfo = await backendActor?.getFarmerByEmail(
            product.ok.farmer
          );
          if (farmerInfo) {
            if ("ok" in farmerInfo) {
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
        }
      }
      // updateOrderStatus(modalOrder?.orderId);
    }
  };

  useEffect(() => {
    if (updated) {
      setStatusModal(false);
      setUpdated(false);
    }
  }, [updated]);

  const getStatus = (status: string) => {
    if (status === "orderplaced") {
      let _status: OrderStatus = { orderplaced: null };
      let message: string = "We have received your order";
      let res = {
        status: _status,
        message: message,
      };
      return res;
    } else if (status === "purchased") {
      let _status: OrderStatus = { purchased: null };
      let message: string = "We have received your payment, order is processing for shippment, you will be notified when order is shipped";
      let res = {
        status: _status,
        message: message,
      };
      return res;
    } else if (status === "cancelled") {
      let _status: OrderStatus = { cancelled: null };
      let message: string = "Order has been cancelled";
      let res = {
        status: _status,
        message: message,
      };
      return res;
    } else if (status === "shippment") {
      let _status: OrderStatus = { shippment: null };
      let message: string = "Order have been shipped, you will be notified when order is delivered";
      let res = {
        status: _status,
        message: message,
      };
      return res;
    } else if (status === "completed") {
      let _status: OrderStatus = { fulfillment: null };
      let message: string = "Order has been delivered, thank you for shopping with us";
      let res = {
        status: _status,
        message: message,
      };
      return res;
    } else {
      let _status: OrderStatus = { orderplaced: null };
      let message: string = "We have received your order";
      let res = {
        status: _status,
        message: message,
      };
      return res;
    }
  };
  const sendOrderUpdateWSMessage = async (status: string) => {
    let data = getStatus(status);
    if (modalOrder) {
      const msg: AppMessage = {
        FromAdmin: {
          OrderUpdate: {
            marketPlUserclientId: modalOrder.orderOwner.toString(),
            status: data.status,
            message: data.message,
          },
        },
      };
      let notification: UserNotification = {
        id: uuidv4(),
        notification: {
          OrderUpdate: {
            orderId: modalOrder.orderId,
            message: data.message,
            status: data.status,
          },
        },
        read: false,
        created: BigInt(Date.now()),
      };

      await backendActor?.createUserNotification(
        modalOrder.orderOwner,
        notification
      );
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
                    <MenuItem value="orderplaced">Order Recieved</MenuItem>
                    <MenuItem value="purchased">Purchased, payment recieved</MenuItem>
                    <MenuItem value="cancelled">Cancel Order</MenuItem>
                    <MenuItem value="shippment">Order Shipped</MenuItem>
                    <MenuItem value="fulfillment">Order Delivered</MenuItem>
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
