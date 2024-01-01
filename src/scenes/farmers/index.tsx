import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab, Button, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import FarmerListing from "../../scenes/farmerlisting";
import { useAuth } from "../../hooks/auth";
import { Farmer } from "../../declarations/tswaanda_backend/tswaanda_backend.did";
import { formatDate} from "../../utils/time";
import { ApprovedFarmers, PendingFarmers, SuspendedFarmers } from "./components";

const Farmers = () => {
  const { backendActor } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [farmers, setFarmers] = useState<any[] | null>(null);
  const [data, setData] = useState<any[] | null>(null);
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

  const handleTabChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const handleChange = (panel: any) => (event: any, isExpanded: any) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getPendingFarmers = async () => {
    try {
      const res = await backendActor.getUnverifiedFarmers();
      const sortedData = res.sort(
        (a: any, b: any) => Number(b.created) - Number(a.created)
      );
      const convertedFarmers = convertData(sortedData);
      setPendingFarmers(convertedFarmers);
    } catch (error) {
      console.log("Error getting pending farmers", error);
    }
  };
  const getSuspended = async () => {
    try {
      const res = await backendActor.getSuspendedFarmers();
      const sortedData = res.sort(
        (a: any, b: any) => Number(b.created) - Number(a.created)
      );
      const convertedFarmers = convertData(sortedData);
      setSuspendedFarmers(convertedFarmers);
    } catch (error) {
      console.log("Error getting suspended farmers", error);
    }
  };

  const getApprovedFarmers = async () => {
    try {
      const res = await backendActor.getVerifiedFarmers();
      const sortedData = res.sort(
        (a: any, b: any) => Number(b.created) - Number(a.created)
      );
      const convertedFarmers = convertData(sortedData);
      setApprovedFarmers(convertedFarmers);
    } catch (error) {
      console.log("Error getting approved farmers", error);
    }
  };

  const convertData = (data: any) => {
    if (!data) {
      return [];
    }

    const modifiedOrder = data.map((farmer: any) => {
      const formattedDate = formatDate(farmer.created);

      return {
        ...farmer,
        step: Number(farmer.step),
        created: `${formattedDate}`,
      };
    });

    return modifiedOrder;
  };

  const getFarmers = async () => {
    setIsLoading(true);
    try {
      const res = await backendActor.getAllFarmers();
      setData(res);
    } catch (error) {
      console.log("Error getting farmers", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      const modfifiedCustomers = data.map((farmer: any) => ({
        ...farmer,
        phone: Number(farmer.phone),
        created: formatDate(farmer.created),
      }));
      setFarmers(modfifiedCustomers);
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    getFarmers();
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

  const handleShowStatusForm = (id: any) => {
    setSelectedFarmerId(id);
    setShowStatus(true);
  };

  const updateFarmerStatus = async (id: any) => {
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
        const res = await backendActor.updateFarmer(data[farmerIndex]);
        setUpdated(true);
        toast.success(`Farmer status have been updated`, {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        });
        const customerPosition = farmers?.findIndex(
          (farmer) => farmer.id === id
        );
        if (customerPosition !== undefined && farmers) {
          farmers[customerPosition].status = farmerStatus;
        }
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
              color: theme.palette.background.default,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <AddIcon sx={{ mr: "10px" }} />
            Add New Farmer
          </Button>
          {isOpen && (
            <FarmerListing
              isOpen={isOpen}
              onClose={handleListPopClose}
              getPendingFarmers={getPendingFarmers}
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
