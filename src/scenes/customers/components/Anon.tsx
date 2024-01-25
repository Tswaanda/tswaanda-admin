import React, { FC, useState } from "react";
import {
  Box,
  useTheme,
} from "@mui/material";
import CustomerAccordion from "./CustomerAccordion";

type AnonProps = {
  anonUsers: any;
  updateCustomerStatus: any;
  setCustomerStatus: any;
  updating: any;
  setUpdated: any;
  updated: any;
};

const Anon: FC<AnonProps> = ({
  anonUsers,
  updateCustomerStatus,
  setCustomerStatus,
  updating,
  setUpdated,
  updated,
}) => {
  const theme = useTheme();

  return (
    <Box m="1rem 0 0 0">
      {anonUsers?.map((customer) => (
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

export default Anon;
