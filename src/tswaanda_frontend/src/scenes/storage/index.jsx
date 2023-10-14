import { Box, useTheme, Tabs, Tab } from "@mui/material";
import Header from "../../components/Header";
import React, { useState } from "react";
import StorageFiles from "../../components/storage/StorageFiles";
import Canisters from "../../components/storage/Canisters";

const Storage = () => {

  const [value, setValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderTabContent = () => {
    switch (value) {
      case 0:
        return (
          <Canisters />
        );
      case 1:
        return (
          <StorageFiles />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Box m="1.5rem 2.5rem">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="Storage" subtitle="Managing file storage files and canisters" />
        </Box>
        <Box m="2.5rem 0 0 0">
          <Tabs value={value} onChange={handleTabChange}>
            <Tab label="Canisters" />
            <Tab label="Storage Files" />
          </Tabs>
        </Box>
        {renderTabContent()}
      </Box>
    </div>
  )
}

export default Storage