import { useEffect, useState } from "react";
import { Box, Tabs, Tab} from "@mui/material";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import { sendAutomaticEmailMessage } from "../../emails/kycApprovals";
import { useAuth } from "../../hooks/auth";
import { formatDate } from "../../utils/time";
import { All, Anon, Approved, Pending } from "./components";
import { backendActor } from "../../hooks/live-config";
import { Customer } from "../../declarations/marketplace_backend/marketplace_backend.did";

const Customers = () => {
  const { marketActor } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [customers, setCustomers] = useState<any[] | null>(null);
  const [data, setData] = useState<Customer[] | null>(null);
  const [pendingCustomers, setPendingCustomers] = useState(null);
  const [approvedCustomers, setApprovedCustomers] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [anonUsers, setAnonUsers] = useState(null);
  const [customerStatus, setCustomerStatus] = useState("");
  const [value, setValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const getPendingCustomers = async () => {
    const res = await marketActor?.getPendingKYCReaquest();
    if (res) {
      const sortedData = res.sort(
        (a: any, b: any) => Number(b.created) - Number(a.created)
      );
      const convertedCustomers = convertData(sortedData);
      setPendingCustomers(convertedCustomers);
    } else {
      console.log("Pending customers undefined");
    }
  };

  const getApprovedCustomers = async () => {
    const res = await marketActor?.getApprovedKYC();
    if (res) {
      const sortedData = res.sort(
        (a: any, b: any) => Number(b.created) - Number(a.created)
      );
      const convertedCustomers = convertData(sortedData);
      setApprovedCustomers(convertedCustomers);
    } else {
      console.log("Approved customers undefined");
    }
  };

  const getAnonUsers = async () => {
    const res = await marketActor?.getAnonUsers();
    if (res) {
      const sortedData = res.sort(
        (a: any, b: any) => Number(b.created) - Number(a.created)
      );
      const convertedCustomers = convertData(sortedData);
      setAnonUsers(convertedCustomers);
    } else {
      console.log("Anon users undefined");
    }
  };

  const convertData = (data: any) => {
    if (!data) {
      return [];
    }

    const modfifiedCustomers = data.map((customer: any) => {
      const formattedDate = formatDate(customer.created);

      return {
        ...customer,
        step: Number(customer.step),
        created: `${formattedDate}`,
        body: customer.body
          ? {
              ...customer.body,
              zipCode: Number(customer.body.zipCode),
              phoneNumber: Number(customer.body.phoneNumber),
            }
          : undefined,
      };
    });

    return modfifiedCustomers;
  };

  const getCustomers = async () => {
    const res = await marketActor?.getAllKYC();
    if (res) {
      setData(res);
    }
  };

  useEffect(() => {
    if (data) {
      const modfifiedCustomers = data?.map((customer) => ({
        ...customer,
        principal: customer.principal.toString(),
        created: formatDate(Number(customer.created)),
        body: customer.body
          ? {
              ...customer.body,
              zipCode: Number(customer.body[0]?.zipCode),
              phoneNumber: Number(customer.body[0]?.phoneNumber),
            }
          : undefined,
      }));
      setCustomers(modfifiedCustomers);
    }
  }, [data]);

  useEffect(() => {
    if (backendActor) {
      getCustomers();
      getPendingCustomers();
      getApprovedCustomers();
      getAnonUsers();
    }
  }, [backendActor]);

  useEffect(() => {
    if (value === 0 && !pendingCustomers) {
      getPendingCustomers();
    } else if (value === 1 && !approvedCustomers) {
      getApprovedCustomers();
    }
  }, [value]);

  const updateCustomerStatus = async (id: any) => {
    if (data && customerStatus != "") {
      try {
        setUpdating(true);
        const customerIndex = data.findIndex((customer) => customer.id === id);

        if (customerIndex !== -1) {
          const customer = data[customerIndex];
          if (customer.body[0]) {
            if (customer.body) {
              customer.body[0].status = customerStatus;
            }
            await marketActor?.updateKYCRequest(data[customerIndex]);
            if (customerStatus === "approved") {
              await sendAutomaticEmailMessage(
                data[customerIndex].body[0]?.firstName,
                data[customerIndex].body[0]?.email
              );
            }
            setUpdated(true);
            toast.success(
              `Customer status have been updated to ${customerStatus} ${
                customerStatus === "approved"
                  ? ", Approval email have been sent"
                  : ""
              } `,
              {
                autoClose: 5000,
                position: "top-center",
                hideProgressBar: true,
              }
            );
            const customerPosition = customers?.findIndex(
              (customer) => customer.id === id
            );
            if (customerPosition !== undefined) {
              if (customers) {
                customers[customerPosition].body.status = customerStatus;
              }
            }
            setUpdating(false);
          } else {
            toast.warning("Customer not found", {
              autoClose: 5000,
              position: "top-center",
              hideProgressBar: true,
            });
          }
        }
      } catch (error) {
        console.log("Error updating the customer status", error);
      }
    }
  };

  const renderTabContent = () => {
    switch (value) {
      case 0:
        return (
          <All
            {...{
              customers,
              updateCustomerStatus,
              setCustomerStatus,
              updating,
              setUpdated,
              updated,
            }}
          />
        );
      case 1:
        return (
          <Pending
            {...{
              pendingCustomers,
              customers,
              updateCustomerStatus,
              setCustomerStatus,
              updating,
              setUpdated,
              updated,
            }}
          />
        );
      case 2:
        return (
          <Approved
            {...{
              approvedCustomers,
              pendingCustomers,
              customers,
              updateCustomerStatus,
              setCustomerStatus,
              updating,
              setUpdated,
              updated,
            }}
          />
        );
      case 3:
        return (
          <Anon
            {...{
              anonUsers,
              approvedCustomers,
              pendingCustomers,
              customers,
              updateCustomerStatus,
              setCustomerStatus,
              updating,
              setUpdated,
              updated,
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
