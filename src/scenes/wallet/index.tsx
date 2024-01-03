import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";

import Header from "../../components/Header";
import { Transactions, Wallet } from "./components";

const WalletPage = () => {
  const [value, setValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderTabContent = () => {
    switch (value) {
      case 0:
        return <Wallet />;
      case 1:
        return <Transactions />;
      default:
        return null;
    }
  };

  console.log("Value", value)

  return (
    <div>
      <Box m="1.5rem 2.5rem">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="Tswaanda Token" subtitle="Managing tswaanda token" />
        </Box>
        <Box m="2.5rem 0 0 0">
          <Tabs value={value} onChange={handleTabChange}>
            <Tab label="Wallet" />
            <Tab label="Transactions" />
          </Tabs>
        </Box>
        {renderTabContent()}
      </Box>
    </div>
  );
};

export default WalletPage;
