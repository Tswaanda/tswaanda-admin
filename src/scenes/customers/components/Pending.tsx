import { FC } from "react";
import { Box, useTheme } from "@mui/material";
import CustomerAccordion from "./CustomerAccordion";

type PendingProps = {
  pendingCustomers: any;
  updateCustomerStatus: any;
  setCustomerStatus: any;
  updating: boolean;
  setUpdated: (updated: boolean) => void;
  updated: boolean;
};

const Pending: FC<PendingProps> = ({
  pendingCustomers,
  updateCustomerStatus,
  setCustomerStatus,
  updating,
  setUpdated,
  updated,
}) => {
  const theme = useTheme();

  return (
    <Box m="1rem 0 0 0">
      {pendingCustomers?.map((customer: any) => (
        <CustomerAccordion
          {...{
            customer,
            theme,
            updating,
            setUpdated,
            updated,
            updateCustomerStatus,
            setCustomerStatus,
          }}
        />
      ))}
    </Box>
  );
};

export default Pending;
