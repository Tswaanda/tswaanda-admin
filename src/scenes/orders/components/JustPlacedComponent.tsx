import React, { FC, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CardActions,
  Button,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import UpdateOrderStatusModal from "./UpdateOrderStatusModal";
import ContactCustomerOnOrder from "./ContactCustomerOnOrder";
import { ProductOrder } from "../../../declarations/marketplace_backend/marketplace_backend.did";
import { formatDate } from "../../../utils/time";

type Props = {
  updated: boolean,
  setUpdated: (updated: boolean) => void,
  pendingOrders : ProductOrder[]| null,
  handleChange: any,
  updatePendingOrderStatus: any,
  expanded: any,
  theme: any,
  updating: boolean,
  setOrderStatus: any,
  orderStatus: any
}

const JustPlacedComponent: FC<Props> = ({
  updated,
  setUpdated,
  pendingOrders,
  handleChange,
  updatePendingOrderStatus,
  expanded,
  theme,
  updating,
  setOrderStatus,
  orderStatus
}) => {

  const [orders, setOrders] = useState<ProductOrder[] | null>(null)
  const [updateSatus, setUpdateStatus] = useState(false)
  const [contactCustomer, setContactCustomer] = useState(false)

  const [openStatusModal, setStatusModal] = useState(false);
  const [openContactModal, setContactModal] = useState(false);

  const [modalOrder, setOrder] = useState<ProductOrder| null>(null)

  const handleContactCustomer = (order: any) => {
    setOrder(order)
    setContactCustomer(!contactCustomer)
    setContactModal(true)
    setUpdateStatus(false)
  }

  const handleUpdateStatus = (order: any) => {
    setOrder(order)
    setUpdateStatus(!updateSatus)
    setStatusModal(true)
    setContactCustomer(false)
  }

  const updateOrderStatus = (id: any) => {
    updatePendingOrderStatus(id)
  }

  useEffect(() => {
    setOrders(pendingOrders)
  }, [pendingOrders])


  return (
    <Box m="1rem 0 0 0">
      {orders?.map((order, index) => (
        <Accordion
          key={index}
          expanded={expanded === order.orderId}
          onChange={handleChange(order.orderId)}
          sx={{ backgroundColor: theme.palette.background.alt }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography sx={{ width: "25%", flexShrink: 0 }}>
              <span style={{ fontWeight: "bold" }}>Order</span>:{" "}
              {order.orderNumber}
            </Typography>
            <Typography
              sx={{ color: "text.secondary", width: "30%", flexShrink: 0 }}
            >
              <span style={{ fontWeight: "bold" }}>Customer</span>:{" "}
              {order.userEmail}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              <span style={{ fontWeight: "bold" }}>Date</span>:{" "}
              {formatDate(Number(order.created))}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                backgroundImage: "none",
                backgroundColor: theme.palette.background.alt,
                borderRadius: "0.55rem",
              }}
            >
              <Grid container spacing={4} m="0 0.1rem 0 0.1rem">
                <Grid item xs={6}>
                  <Typography>Status: Just placed</Typography>
                </Grid>
              
              </Grid>
              <hr />
              <Grid container spacing={4} m="0 0.1rem 0 0.1rem">

                <Grid key={order.orderProducts.id} item xs={4} display="flex" alignItems="center">
                  <Box
                    component="img"
                    alt="profile"
                    src={order.orderProducts.image}
                    height="100px"
                    width="100px"
                    sx={{ objectFit: "cover" }}
                  />
                  <Box m="0 0.1rem 0 0.1rem" textAlign="left">
                    <Typography
                      fontSize="0.9rem"
                      sx={{ color: theme.palette.secondary[100] }}
                    >
                      Name: {order.orderProducts.name}
                    </Typography>
                    <Typography
                      fontSize="0.9rem"
                      sx={{ color: theme.palette.secondary[100] }}
                    >
                      Quantity: {Number(order.orderProducts.quantity)}
                    </Typography>
                    <Typography
                      fontSize="0.9rem"
                      sx={{ color: theme.palette.secondary[100] }}
                    >
                      Price: ${order.orderProducts.price.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>

              </Grid>
              <hr />
              <Grid container spacing={4} m="0 0.1rem 0 0.1rem">
                <Grid item xs={3}>
                  <Typography>
                    Subtotal: ${order.subtotal.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>
                    Shipping estimate ${order.shippingEstimate.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>
                    Tax Estimate: ${order.taxEstimate.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography fontWeight="bold">
                    Total: ${order.totalPrice.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
              <hr />
              <CardActions>
                <Button
                  onClick={() => handleUpdateStatus(order)}
                  variant="outlined"
                  size="small"
                  style={{
                    backgroundColor:
                      updateSatus
                        ? "white"
                        : undefined,
                    color:
                      updateSatus
                        ? "green"
                        : "white",
                  }}
                >
                  Update Order status
                </Button>
                <Button
                  onClick={() => handleContactCustomer(order)}
                  variant="outlined"
                  size="small"
                  style={{
                    backgroundColor:
                      contactCustomer
                        ? "white"
                        : undefined,
                    color:
                      contactCustomer
                        ? "green"
                        : "white",
                  }}
                >
                  Contact customer
                </Button>
              </CardActions>

            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
      <>
        {updateSatus && (
          <UpdateOrderStatusModal {...{
            updateOrderStatus, setOrderStatus, orderStatus, updating, theme, setStatusModal, openStatusModal, modalOrder, updated,
            setUpdated
          }} />
        )}
        {contactCustomer && (
          <ContactCustomerOnOrder {...{ openContactModal, setContactModal, theme, modalOrder }} />
        )}
      </>
    </Box>
  );
};

export default JustPlacedComponent;
