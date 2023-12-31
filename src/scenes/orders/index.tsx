import { Box, useTheme, Tabs, Tab } from "@mui/material";
import Header from "../../components/Header";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { sendAutomaticOrderUpdateEmail } from "../../emails/orders";
import { formatDate} from "../../utils/time";
import { useAuth } from "../../hooks/auth";
import { DeliveredComponent, PendingApprovalComponent, ProcessingComponent, ShippedComponent } from "./components";

const Orders = () => {
  const { marketActor } = useAuth();
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [pendingData, setPendingData] = useState<any[] | null>(null);
  const [shippedData, setShippedData] = useState<any[] | null>(null);
  const [deliveredData, setDeliverdData] = useState<any[] | null>(null);
  const [approvedData, setApprovedData] = useState<any[] | null>(null);
  const [pendingOrders, setPendingOrders] = useState<any[] | null>(null);
  const [shippedOrders, setShippedOrders] = useState<any[] | null>(null);
  const [deliveredOrders, setDeliverdOrders] = useState<any[] | null>(null);
  const [approvedOrders, setApprovedOrders] = useState<any[] | null>(null);

  const [showStep, setShowStep] = useState(false);

  const [orderStatus, setOrderStatus] = useState("");
  const [orderStep, setOrderStep] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);

  //Setting of the value of the currect tab
  const [value, setValue] = useState(0);
  const handleTabChange = (newValue: any) => {
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
    const res = (await marketActor.getPendingOrders()) as any[];
    const sortedData = res.sort(
      (a: any, b: any) => Number(b.dateCreated) - Number(a.dateCreated)
    );
    setPendingData(sortedData);
    const convertedOrders = convertData(sortedData);
    setPendingOrders(convertedOrders);
  };
  const getApprovedOrders = async () => {
    const res = (await marketActor.getApprovedOrders()) as any[];
    const sortedData = res.sort(
      (a: any, b: any) => Number(b.dateCreated) - Number(a.dateCreated)
    );
    setApprovedData(sortedData);
    const convertedOrders = convertData(sortedData);
    setApprovedOrders(convertedOrders);
  };
  const getShippedOrders = async () => {
    const res = (await marketActor.getShippedOrders()) as any[];
    const sortedData = res.sort(
      (a: any, b: any) => Number(b.dateCreated) - Number(a.dateCreated)
    );
    setShippedData(sortedData);
    const convertedOrders = convertData(sortedData);
    setShippedOrders(convertedOrders);
  };
  const getDeliveredOrders = async () => {
    const res = (await marketActor.getDeliveredOrders()) as any[];
    const sortedData = res.sort(
      (a: any, b: any) => Number(b.dateCreated) - Number(a.dateCreated)
    );
    setDeliverdData(sortedData);
    const convertedOrders = convertData(sortedData);
    setDeliverdOrders(convertedOrders);
  };

  const convertData = (data: any) => {
    if (!data) {
      return [];
    }

    const modifiedOrder = data.map((order: any) => {
      const formattedDate = formatDate(order.dateCreated);

      return {
        ...order,
        step: Number(order.step),
        dateCreated: `${formattedDate}`,
      };
    });

    return modifiedOrder;
  };


  const updatePendingOrderStatus = async (id: any) => {
    updateOrderStatus(id, pendingData, pendingOrders);
  };
  const updateProcessingOrderStatus = async (id: any) => {
    updateOrderStatus(id, approvedData, approvedOrders);
  };
  const updateShippedOrderStatus = async (id: any) => {
    updateOrderStatus(id, shippedData, shippedOrders);
  };
  const updateDeliverdOrderStatus = async (id: any) => {
    updateOrderStatus(id, deliveredData, deliveredOrders);
  };

  const updateOrderStatus = async (id: any, data: any, orders: any) => {
    if (data && orderStatus != "") {
      setUpdating(true);
      const orderIndex = data.findIndex((order: any) => order.orderId === id);

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
        await marketActor.updatePOrder(id, data[orderIndex]);
        if (orderStatus !== "pending") {
          await sendAutomaticOrderUpdateEmail(
            data[orderIndex].fistName,
            data[orderIndex].userEmail,
            orderStatus
          );
        }
        setUpdated(true);
        toast.success(
          `Order status have been updated${
            orderStatus !== "pending"
              ? `. Order update email sent to the customer ${data[orderIndex].userEmail}`
              : ``
          }`,
          {
            autoClose: 5000,
            position: "top-center",
            hideProgressBar: true,
          }
        );
        const orderPosition = orders.findIndex(
          (order: any) => order.orderId === id
        );
        orders[orderPosition].status = orderStatus;
        setUpdating(false);

        if (value === 0) {
          const filteredOrders = pendingOrders?.filter(
            (order) => order.orderId !== id
          );
          if (filteredOrders) {
            setPendingOrders(filteredOrders);
          }
        } else if (value === 1) {
          const filteredOrders = approvedOrders?.filter(
            (order) => order.orderId !== id
          );
          if (filteredOrders) {
            setApprovedOrders(filteredOrders);
          }
        } else if (value === 2) {
          const filteredOrders = shippedOrders?.filter(
            (order) => order.orderId !== id
          );
          if (filteredOrders) {
            setShippedOrders(filteredOrders);
          }
        } else if (value === 3) {
          const filteredOrders = deliveredOrders?.filter(
            (order) => order.orderId !== id
          );
          if (filteredOrders) {
            setDeliverdOrders(filteredOrders);
          }
        }
        setOrderStatus("");
      } else {
        toast.warning("Order not found", {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        });
      }
    }
  };

  const handleShowStepForm = (id:any) => {
    setShowStep(true);
  };

  const handleChange = (panel:any) => (isExpanded:any) => {
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
              updatePendingOrderStatus,
              expanded,
              theme,
              showStep,
              updating,
              setOrderStep,
              setOrderStatus,
              orderStatus,
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
              updateProcessingOrderStatus,
              expanded,
              theme,
              showStep,
              updating,
              setOrderStep,
              setOrderStatus,
              orderStatus,
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
              updateShippedOrderStatus,
              expanded,
              theme,
              showStep,
              updating,
              setOrderStep,
              setOrderStatus,
              orderStatus,
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
              updateDeliverdOrderStatus,
              expanded,
              theme,
              showStep,
              updating,
              setOrderStep,
              setOrderStatus,
              orderStatus,
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
