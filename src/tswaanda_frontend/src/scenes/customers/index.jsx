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
import Anon from "../../components/Customers/Anon";
import All from "../../components/Customers/All";

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
  const [anonUsers, setAnonUsers] = useState(null);

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
      (a, b) => Number(b.created) - Number(a.created)
    );
    const convertedCustomers = convertData(sortedData);
    setPendingCustomers(convertedCustomers);
  }

  const getApprovedCustomers = async () => {
    const res = await canister.getApprovedKYC()
    const sortedData = res.sort(
      (a, b) => Number(b.created) - Number(a.created)
    );
    const convertedCustomers = convertData(sortedData);
    setApprovedCustomers(convertedCustomers);
  }

  const getAnonUsers = async () => {
    const res = await canister.getAnonUsers()
    const sortedData = res.sort(
      (a, b) => Number(b.created) - Number(a.created)
    );
    const convertedCustomers = convertData(sortedData);
    setAnonUsers(convertedCustomers);
  }

  const convertData = (data) => {
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

    const modfifiedCustomers = data.map((customer) => {


      const formattedDate = formatCustomerDate(customer.created);
      const formattedTime = formatCustomerTime(customer.created);

      return {
        ...customer,
        step: Number(customer.step),
        created: `${formattedDate} at ${formattedTime}`,
      };
    });

    return modfifiedCustomers;
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
        principal: customer.principal.toString(),
        created: formatCustomerDate(customer.created),
        body: customer.body ?
          {
            ...customer.body,
            zipCode: Number(customer.zipCode),
            phoneNumber: Number(customer.phoneNumber),
          }
          : undefined
      }));
      setCustomers(modfifiedCustomers);
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    getCustomers();
    getPendingCustomers();
    getApprovedCustomers();
    getAnonUsers();
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
      try {
        setUpdating(true);
        const customerIndex = data.findIndex((customer) => customer.id === id);

        if (customerIndex !== -1) {
          data[customerIndex].body.status = customerStatus;
          await canister.updateKYCRequest(
            data[customerIndex]
          );
          if (customerStatus === "approved") {
            await sendAutomaticEmailMessage(data[customerIndex].body.firstName, data[customerIndex].body.email)
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
          customers[customerPosition].body.status = customerStatus;
          setUpdating(false);
          setSelectedCustomerId(null);
        } else {
          toast.warning("Customer not found", {
            autoClose: 5000,
            position: "top-center",
            hideProgressBar: true,
          });
        }
      } catch (error) {
        console.log("Error updating the customer status", error)
      }
    }
  };

  const renderTabContent = () => {
    switch (value) {
      case 0:
        return (
          <All
            {...{
              updated,
              setUpdated,
              customers,
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
      case 2:
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
      case 3:
        return (
          <Anon
            {...{
              updated,
              setUpdated,
              anonUsers,
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
            <Tab label="All" />
            <Tab label="Pending Approval" />
            <Tab label="Approved" />
            <Tab label="Anon" />
          </Tabs>
        </Box>
        {renderTabContent()}
      </Box>
    </div>
  );
};

export default Customers;
