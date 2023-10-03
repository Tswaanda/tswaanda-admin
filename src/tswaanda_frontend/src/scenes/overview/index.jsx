import React, { useState } from "react";
import { FormControl, MenuItem, InputLabel, Box, Select } from "@mui/material";
import Header from "../../components/Header";
import OverviewChart from "../../components/OverviewChart";

const Overview = () => {
    const [view, setView] = useState("sales");

    return (
        <Box m="1.5rem 2.5rem">
            <Header
                title="OVERVIEW"
                subtitle="General Revenue and Profit overview"
            />
                <Box height="75vh">
                    <FormControl sx={{ mt: "1rem" }}>
                        <InputLabel>View</InputLabel>
                        <Select 
                            value={view} 
                            label="View" 
                            onChange={(e) => setView(e.target.value)}
                        >
                            <MenuItem value="sales">Sales</MenuItem>
                            <MenuItem value="units">Units</MenuItem>
                        </Select>
                    </FormControl>
                    <OverviewChart view={view} />
                </Box>
        </Box>
        );
};

export default Overview;
