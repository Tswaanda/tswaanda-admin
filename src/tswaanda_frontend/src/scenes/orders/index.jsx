import { Box, useTheme, Tabs, Tab } from "@mui/material";
import Header from "../../components/Header";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PendingApprovalComponent from "../../components/Orders/PendingApprovalComponent";
import ProcessingComponent from "../../components/Orders/ProcessingComponent";
import ShippedComponent from "../../components/Orders/ShippedComponent";
import DeliveredComponent from "../../components/Orders/DeliveredComponent";
import { marketActor } from "../../config";
import { sendAutomaticOrderUpdateEmail } from "../../emails/orders";

const Orders = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [shippedData, setShippedData] = useState(null);
  const [deliveredData, setDeliverdData] = useState(null);
  const [approvedData, setApprovedData] = useState(null);
  const [pendingOrders, setPendingOrders] = useState(null);
  const [shippedOrders, setShippedOrders] = useState(null);
  const [deliveredOrders, setDeliverdOrders] = useState(null);
  const [approvedOrders, setApprovedOrders] = useState(null);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showStatus, setShowStatus] = useState(false);
  const [showStep, setShowStep] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const [orderStatus, setOrderStatus] = useState("");
  const [orderStep, setOrderStep] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);

  //Setting of the value of the currect tab
  const [value, setValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (value === 0 && !pendingData) {
      getPendingOrders();
    } else if (value === 1 && !approvedData) {
      getApprovedOrders();
    } else if (value === 2 && !shippedData) {
      getShippedOrders();
    } else if (value === 3 && !deliveredData) {
      getDeliveredOrders();
    }
  }, [value]);

  const getPendingOrders = async () => {
    const res = await marketActor.getPendingOrders();
    const sortedData = res.sort(
      (a, b) => Number(b.dateCreated) - Number(a.dateCreated)
    );
    setPendingData(sortedData);
    const convertedOrders = convertData(sortedData);
    setPendingOrders(convertedOrders);
  };
  const getApprovedOrders = async () => {
    const res = await marketActor.getApprovedOrders();
    const sortedData = res.sort(
      (a, b) => Number(b.dateCreated) - Number(a.dateCreated)
    );
    setApprovedData(sortedData);
    const convertedOrders = convertData(sortedData);
    setApprovedOrders(convertedOrders);
  };
  const getShippedOrders = async () => {
    const res = await marketActor.getShippedOrders();
    const sortedData = res.sort(
      (a, b) => Number(b.dateCreated) - Number(a.dateCreated)
    );
    setShippedData(sortedData);
    const convertedOrders = convertData(sortedData);
    setShippedOrders(convertedOrders);
  };
  const getDeliveredOrders = async () => {
    const res = await marketActor.getDeliveredOrders();
    const sortedData = res.sort(
      (a, b) => Number(b.dateCreated) - Number(a.dateCreated)
    );
    setDeliverdData(sortedData);
    const convertedOrders = convertData(sortedData);
    setDeliverdOrders(convertedOrders);
  };

  function convertData(data) {
    if (!data) {
      return [];
    }

    const formatOrderDate = (timestamp) => {
      const date = new Date(Number(timestamp));
      const options = {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    };

    const formatOrderTime = (timestamp) => {
      const date = new Date(Number(timestamp));
      const options = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      return date.toLocaleTimeString("en-US", options);
    };

    const modifiedOrder = data.map((order) => {


      const formattedDate = formatOrderDate(order.dateCreated);
      const formattedTime = formatOrderTime(order.dateCreated);

      return {
        ...order,
        step: Number(order.step),
        dateCreated: `${formattedDate} at ${formattedTime}`,
      };
    });

    return modifiedOrder;
  }

  const updatePendingOrderStatus = async (id) => {
    updateOrderStatus(id, pendingData, pendingOrders);
  };
  const updateProcessingOrderStatus = async (id) => {
    updateOrderStatus(id, approvedData, approvedOrders);
  };
  const updateShippedOrderStatus = async (id) => {
    updateOrderStatus(id, shippedData, shippedOrders);
  };
  const updateDeliverdOrderStatus = async (id) => {
    updateOrderStatus(id, deliveredData, deliveredOrders);
  };

  const updateOrderStatus = async (id, data, orders) => {
    if (data && orderStatus != "") {
      setUpdating(true);
      const orderIndex = data.findIndex((order) => order.orderId === id);

      if (orderIndex !== -1) {
        data[orderIndex].status = orderStatus;
        if (orderStatus === "pending") {
          data[orderIndex].step = Number(0);
        } else if (orderStatus === "approved") {
          data[orderIndex].step = Number(1);
        } else if (orderStatus === "shipped") {
          data[orderIndex].step = Number(2);
        } else if (orderStatus === "delivered") {
          data[orderIndex].step = Number(3);
        }
        const res = await marketActor.updatePOrder(id, data[orderIndex]);
        if (orderStatus !== "pending") {
          await sendAutomaticOrderUpdateEmail(data[orderIndex].fistName, data[orderIndex].userEmail, orderStatus);
          console.log("id", id)
          console.log(data[orderIndex].fistName, data[orderIndex].userEmail, orderStatus, data[orderIndex], data);

        }
        setUpdated(true);
        toast.success(`Order status have been updated${orderStatus !== "pending" ? `. Order update email sent to the customer ${data[orderIndex].userEmail}`: ``}`, {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        });
        const orderPosition = orders.findIndex((order) => order.orderId === id);
        orders[orderPosition].status = orderStatus;
        setUpdating(false);
        setSelectedOrderId(null);
        if (value === 0) {
          const filteredOrders = pendingOrders.filter(
            (order) => order.orderId !== id
          );
          setPendingOrders(filteredOrders);
        } else if (value === 1) {
          const filteredOrders = approvedOrders.filter(
            (order) => order.orderId !== id
          );
          setApprovedOrders(filteredOrders);
        } else if (value === 2) {
          const filteredOrders = shippedOrders.filter(
            (order) => order.orderId !== id
          );
          setShippedOrders(filteredOrders);
        } else if (value === 3) {
          const filteredOrders = deliveredOrders.filter(
            (order) => order.orderId !== id
          );
          setDeliverdOrders(filteredOrders);
        }
        setOrderStatus("");
        setSelectedOrderId(null);
      } else {
        toast.warning("Order not found", {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        });
      }
    }
  };

  const handleShowStatusForm = (id) => {
    setSelectedOrderId(id);
    setShowStatus(true);
    setShowContact(false);
    setShowStep(false);
  };
  const handleShowCustomerForm = (id) => {
    setSelectedOrderId(id);
    setShowContact(true);
    setShowStatus(false);
    setShowStep(false);
  };
  const handleShowStepForm = (id) => {
    setSelectedOrderId(id);
    setShowStep(true);
    setShowStatus(false);
    setShowContact(false);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderTabContent = () => {
    switch (value) {
      case 0:
        return (
          <PendingApprovalComponent
            {...{
              updated,
              setUpdated,
              pendingOrders,
              handleShowStepForm,
              handleChange,
              handleShowCustomerForm,
              handleShowStatusForm,
              updatePendingOrderStatus,
              expanded,
              theme,
              selectedOrderId,
              showContact,
              showStatus,
              showStep,
              updating,
              setOrderStep,
              setOrderStatus,
            }}
          />
        );
      case 1:
        return (
          <ProcessingComponent
            {...{
              updated,
              setUpdated,
              approvedOrders,
              handleShowStepForm,
              handleChange,
              handleShowCustomerForm,
              handleShowStatusForm,
              updateProcessingOrderStatus,
              expanded,
              theme,
              selectedOrderId,
              showContact,
              showStatus,
              showStep,
              updating,
              setOrderStep,
              setOrderStatus,
            }}
          />
        );
      case 2:
        return (
          <ShippedComponent
            {...{
              updated,
              setUpdated,
              shippedOrders,
              handleShowStepForm,
              handleChange,
              handleShowCustomerForm,
              handleShowStatusForm,
              updateShippedOrderStatus,
              expanded,
              theme,
              selectedOrderId,
              showContact,
              showStatus,
              showStep,
              updating,
              setOrderStep,
              setOrderStatus,
            }}
          />
        );
      case 3:
        return (
          <DeliveredComponent
            {...{
              updated,
              setUpdated,
              deliveredOrders,
              handleShowStepForm,
              handleChange,
              handleShowCustomerForm,
              handleShowStatusForm,
              updateDeliverdOrderStatus,
              expanded,
              theme,
              selectedOrderId,
              showContact,
              showStatus,
              showStep,
              updating,
              setOrderStep,
              setOrderStatus,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Box m="1.5rem 2.5rem">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="Orders" subtitle="Managing markertplace orders" />
        </Box>
        <Box m="2.5rem 0 0 0">
          <Tabs value={value} onChange={handleTabChange}>
            <Tab label="Pending Approval" />
            <Tab label="Processing" />
            <Tab label="shipped" />
            <Tab label="delivered" />
          </Tabs>
        </Box>
        {renderTabContent()}
      </Box>
    </div>
  );
};

export default Orders;
