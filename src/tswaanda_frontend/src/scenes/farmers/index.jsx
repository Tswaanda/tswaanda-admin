import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
  useTheme
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import PendingFarmers from "../../components/Farmers/PendingFarmers";
import ApprovedFarmers from "../../components/Farmers/ApprovedFarmers";
import FarmerListing from "../../scenes/farmerlisting";
import SuspendedFarmers from "../../components/Farmers/SuspendedFarmers";
import { backendActor } from "../../config";

const Farmers = () => {
  const [expanded, setExpanded] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [farmers, setFarmers] = useState(null);
  const [data, setData] = useState(null);
  const [pendingFarmers, setPendingFarmers] = useState(null);
  const [approvedFarmers, setApprovedFarmers] = useState(null);
  const [suspendedFarmers, setSuspendedFarmers] = useState(null);

  const [selectedFarmerId, setSelectedFarmerId] = useState(null);
  const [farmerStatus, setFarmerStatus] = useState("");
  const [value, setValue] = useState(0);

  const [isOpen, setIsOpen] = useState(false);

  const [updated, setUpdated] = useState(false);

  const handleListButton = () => {
    setIsOpen(true);
  };

  const handleListPopClose = () => {
    setIsOpen(false);
  };

  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getPendingFarmers = async () => {
    const res = await backendActor.getUnverifiedFarmers()
    const sortedData = res.sort(
      (a, b) => Number(b.created) - Number(a.created)
    );
    const convertedFarmers = convertData(sortedData);
    setPendingFarmers(convertedFarmers);
  }
  const getSuspended = async () => {
    const res = await backendActor.getSuspendedFarmers()
    const sortedData = res.sort(
      (a, b) => Number(b.created) - Number(a.created)
    );
    const convertedFarmers = convertData(sortedData);
    setSuspendedFarmers(convertedFarmers);
  }

  const getApprovedFarmers = async () => {
    const res = await backendActor.getVerifiedFarmers()
    const sortedData = res.sort(
      (a, b) => Number(b.created) - Number(a.created)
    );
    const convertedFarmers = convertData(sortedData);
    setApprovedFarmers(convertedFarmers);
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

    const modifiedOrder = data.map((farmer) => {


      const formattedDate = formatCustomerDate(farmer.created);
      const formattedTime = formatCustomerTime(farmer.created);

      return {
        ...farmer,
        step: Number(farmer.step),
        created: `${formattedDate} at ${formattedTime}`,
      };
    });

    return modifiedOrder;
  }

  const getCustomers = async () => {
    setIsLoading(true);
    const res = await backendActor.getAllFarmers();
    setData(res);
  };

  useEffect(() => {
    if (data) {

      const formatCustomerDate = (timestamp) => {
        const date = new Date(Number(timestamp));
        return date.toLocaleDateString();
      };

      const modfifiedCustomers = data.map((farmer) => ({
        ...farmer,
        phone: Number(farmer.phone),
        created: formatCustomerDate(farmer.created),
      }));
      setFarmers(modfifiedCustomers);
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    getCustomers();
    getPendingFarmers();
  }, []);

  useEffect(() => {
    if (value === 0 && !pendingFarmers) {
      getPendingFarmers();
    } else if (value === 1 && !approvedFarmers) {
      getApprovedFarmers();
    } else if (value === 2 && !suspendedFarmers) {
      getSuspended();
    }
  }, [value]);

  const handleShowStatusForm = (id) => {
    setSelectedFarmerId(id);
    setShowStatus(true);
  };

  const updateFarmerStatus = async (id) => {
    if (data && farmerStatus != "") {
      setUpdating(true);
      const farmerIndex = data.findIndex((farmer) => farmer.id === id);

      if (farmerIndex !== -1) {
        if (farmerStatus === "approved") {
          data[farmerIndex].isVerified = true;
        }
        if (farmerStatus === "suspended") {
          data[farmerIndex].isSuspended = true;
          
        }
        if (farmerStatus === "pending") {
          data[farmerIndex].isVerified = false;
          data[farmerIndex].isSuspended = false;
        }
        const res = await backendActor.updateFarmer(
          data[farmerIndex]
        );
        setUpdated(true);
        toast.success(
          `Farmer status have been updated`,
          {
            autoClose: 5000,
            position: "top-center",
            hideProgressBar: true,
          }
        );
        const customerPosition = farmers.findIndex(
          (farmer) => farmer.id === id
        );
        farmers[customerPosition].status = farmerStatus;
        setUpdating(false);
        setSelectedFarmerId(null);
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
          <PendingFarmers
            {...{
              updated,
              setUpdated,
              pendingFarmers,
              updateFarmerStatus,
              handleShowStatusForm,
              setFarmerStatus,
              expanded,
              showStatus,
              updating,
              isLoading,
              selectedFarmerId,
              farmerStatus,
              handleChange,

            }}
          />
        );
      case 1:
        return (
          <ApprovedFarmers
            {...{
              updated,
              setUpdated,
              approvedFarmers,
              updateFarmerStatus,
              handleShowStatusForm,
              setFarmerStatus,
              expanded,
              showStatus,
              updating,
              isLoading,
              selectedFarmerId,
              farmerStatus,
              handleChange,

            }}
          />
        );
      case 2:
        return (
          <SuspendedFarmers
            {...{
              updated,
              setUpdated,
              suspendedFarmers,
              updateFarmerStatus,
              handleShowStatusForm,
              setFarmerStatus,
              expanded,
              showStatus,
              updating,
              isLoading,
              selectedFarmerId,
              farmerStatus,
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
          <Header title="Farmers" subtitle="List of Active Farmers" />
          <Button
            variant="contained"
            onClick={handleListButton}
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <AddIcon sx={{ mr: "10px" }} />
            List New Farmer
          </Button>
          {isOpen && (
            <FarmerListing
              isOpen={isOpen}
              onClose={handleListPopClose}
            />
          )}
        </Box>

        <Box m="2.5rem 0 0 0">
          <Tabs value={value} onChange={handleTabChange}>
            <Tab label="Pending Approval" />
            <Tab label="Verified" />
            <Tab label="Suspended" />
          </Tabs>
        </Box>
        {renderTabContent()}
      </Box>
    </div>
  );
};

export default Farmers;
