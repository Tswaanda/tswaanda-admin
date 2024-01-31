import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";


import Header from "../../../../components/Header";
import AllTransactions from "./AllTransactions";
import ICP from "./ICP";
import CKBTC from "./ckBTC";
import CKETH from "./ckETH";

const Transactions = () => {
  const [value, setValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderTabContent = () => {
    switch (value) {
      case 0:
        return <AllTransactions />;
      case 1:
        return <ICP />;
      case 2:
        return <CKBTC />;
      case 3:
        return <CKETH />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Box m="1.5rem 2.5rem">
        <Box m="1rem 0 0 0">
          <Tabs value={value} onChange={handleTabChange}>
            <Tab label="All" />
            <Tab label="ICP" />
            <Tab label="ckBTC" />
            <Tab label="ckETH" />
          </Tabs>
        </Box>
        {renderTabContent()}
      </Box>
    </div>
  );
};

export default Transactions;
