import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import { canister } from "../../config";
import Pending from "../../components/Customers/Pending";
import Approved from "../../components/Customers/Approved";
import { sendAutomaticEmailMessage } from "../../emails/kycApprovals";

const Customers = () => {
  const [expanded, setExpanded] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState(null);
  const [data, setData] = useState(null);
  const [pendingCustomers, setPendingCustomers] = useState(null);
  const [approvedCustomers, setApprovedCustomers] = useState(null);
  const [updated, setUpdated] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerStatus, setCustomerStatus] = useState("");
  const [value, setValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getPendingCustomers = async () => {
    const res = await canister.getPendingKYCReaquest()
    const sortedData = res.sort(
      (a, b) => Number(b.dateCreated) - Number(a.dateCreated)
    );
    const convertedCustomers = convertData(sortedData);
    setPendingCustomers(convertedCustomers);
  }

  const getApprovedCustomers = async () => {
    console.log(canister)
    const res = await canister.getApprovedKYC()
    const sortedData = res.sort(
      (a, b) => Number(b.dateCreated) - Number(a.dateCreated)
    );
    const convertedCustomers = convertData(sortedData);
    setApprovedCustomers(convertedCustomers);
  }

  function convertData(data) {
    if (!data) {
      return [];
    }

    const formatCustomerDate = (timestamp) => {
      const date = new Date(Number(timestamp));
      const options = {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    };

    const formatCustomerTime = (timestamp) => {
      const date = new Date(Number(timestamp));
      const options = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      return date.toLocaleTimeString("en-US", options);
    };

    const modifiedOrder = data.map((customer) => {


      const formattedDate = formatCustomerDate(customer.dateCreated);
      const formattedTime = formatCustomerTime(customer.dateCreated);

      return {
        ...customer,
        step: Number(customer.step),
        dateCreated: `${formattedDate} at ${formattedTime}`,
      };
    });

    return modifiedOrder;
  }

  const getCustomers = async () => {
    setIsLoading(true);
    const res = await canister.getAllKYC();
    setData(res);
  };

  useEffect(() => {
    if (data) {

      const formatCustomerDate = (timestamp) => {
        const date = new Date(Number(timestamp));
        return date.toLocaleDateString();
      };

      const modfifiedCustomers = data.map((customer) => ({
        ...customer,
        userId: customer.userId.toString(),
        zipCode: Number(customer.zipCode),
        phoneNumber: Number(customer.phoneNumber),
        dateCreated: formatCustomerDate(customer.dateCreated),
      }));
      setCustomers(modfifiedCustomers);
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    getCustomers();
    getPendingCustomers();
  }, []);

  useEffect(() => {
    if (value === 0 && !pendingCustomers) {
      getPendingCustomers();
    } else if (value === 1 && !approvedCustomers) {
      getApprovedCustomers();
    }
  }, [value]);

  const handleShowStatusForm = (id) => {
    setSelectedCustomerId(id);
    setShowStatus(true);
  };

  const updateCustomerStatus = async (id) => {
    if (data && customerStatus != "") {
      setUpdating(true);
      const customerIndex = data.findIndex((customer) => customer.id === id);

      if (customerIndex !== -1) {
        data[customerIndex].status = customerStatus;
        let userId = data[customerIndex].userId;
        const res = await canister.updateKYCRequest(
          userId,
          data[customerIndex]
        );
        if (customerStatus === "approved") {
          await sendAutomaticEmailMessage(data[customerIndex].firstName, data[customerIndex].email)
        }
        setUpdated(true);
        toast.success(
          `Customer status have been updated to ${customerStatus} ${customerStatus === "approved" ? ", Approval email have been sent" : ""} `,
          {
            autoClose: 5000,
            position: "top-center",
            hideProgressBar: true,
          }
        );
        const customerPosition = customers.findIndex(
          (customer) => customer.id === id
        );
        customers[customerPosition].status = customerStatus;
        setUpdating(false);
        setSelectedCustomerId(null);
      } else {
        toast.warning("Customer not found", {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        });
      }
    }
  };

  const renderTabContent = () => {
    switch (value) {
      case 0:
        return (
          <Pending
            {...{
              updated,
              setUpdated,
              pendingCustomers,
              updateCustomerStatus,
              handleShowStatusForm,
              setCustomerStatus,
              expanded,
              showStatus,
              updating,
              isLoading,
              selectedCustomerId,
              customerStatus,
              handleChange,
            }}
          />
        );
      case 1:
        return (
          <Approved
            {...{
              updated,
              setUpdated,
              approvedCustomers,
              updateCustomerStatus,
              handleShowStatusForm,
              setCustomerStatus,
              expanded,
              showStatus,
              updating,
              isLoading,
              selectedCustomerId,
              customerStatus,
              handleChange,

            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="">
      <Box m="1.5rem 2.5rem">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="CUSTOMERS" subtitle="List of Active Customers" />
        </Box>

        <Box m="2.5rem 0 0 0">
          <Tabs value={value} onChange={handleTabChange}>
            <Tab label="Pending Approval" />
            <Tab label="Approved" />
          </Tabs>
        </Box>
        {renderTabContent()}
      </Box>
    </div>
  );
};

export default Customers;
