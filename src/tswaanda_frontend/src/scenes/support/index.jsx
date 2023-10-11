import React, { useEffect, useState } from "react";
import {
    Box,
    Tabs,
    Tab,
} from "@mui/material";
import Header from "../../components/Header";

const Support = () => {


  return (
    <div>
      <Box m="1.5rem 2.5rem">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="Support" subtitle="Customer support section" />
        </Box>
        <Box m="2.5rem 0 0 0">
          {/* <Tabs value={value} onChange={handleTabChange}>
            <Tab label="Pending Approval" />
            <Tab label="Processing" />
            <Tab label="shipped" />
            <Tab label="delivered" />
          </Tabs> */}
        </Box>
        {/* {renderTabContent()} */}
      </Box>
    </div>
  )
}

export default Support