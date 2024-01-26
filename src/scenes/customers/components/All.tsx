import { FC } from "react";
import { Box, useTheme } from "@mui/material";
import CustomerAccordion from "./CustomerAccordion";

type Props = {
  customers: any;
  updateCustomerStatus: any;
  setCustomerStatus: any;
  updating: any;
  setUpdated: any;
  updated: any;
};

const All: FC<Props> = ({
  customers,
  updateCustomerStatus,
  setCustomerStatus,
  updating,
  setUpdated,
  updated,
}) => {
  const theme = useTheme();
  return (
    <Box m="1rem 0 0 0">
      {customers?.map((customer) => (
        <CustomerAccordion
          key={customer.id}
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

export default All;
