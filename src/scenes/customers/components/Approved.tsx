import { FC } from "react";
import { Box, useTheme } from "@mui/material";
import CustomerAccordion from "./CustomerAccordion";

type ApprovedProps = {
  approvedCustomers: any;
  updateCustomerStatus: any;
  setCustomerStatus: any;
  updating: any;
  setUpdated: any;
  updated: any;
};

const Approved: FC<ApprovedProps> = ({
  approvedCustomers,
  updateCustomerStatus,
  setCustomerStatus,
  updating,
  setUpdated,
  updated,
}) => {
  const theme = useTheme();

  return (
    <Box m="1rem 0 0 0">
      {approvedCustomers?.map((customer: any) => (
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

export default Approved;
