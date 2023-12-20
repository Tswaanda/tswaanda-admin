import React, { useEffect, useState } from "react";
import {
    Box,
    Tabs,
    Tab,
} from "@mui/material";
import Header from "../../components/Header";
import Staff from '../../components/Admin/Staff';
import AccessRequest from '../../components/Admin/AccessRequest';
import { useAuth } from "../../hooks/auth";
import Suspended from "../../components/Admin/Suspended";

const Support = () => {
    const { backendActor } = useAuth()
    const [value, setValue] = useState(0);
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleTabChange = (newValue: any) => {
        setValue(newValue);
    };

    const handleChange = (panel: any) => (event: any, isExpanded: any) => {
        setExpanded(isExpanded ? panel : false);
    };

    const renderTabContent = () => {
        switch (value) {
            case 0:
                return (
                    <Staff
                        {...{
                            expanded,
                            handleChange,
                        }}
                    />
                );
            case 1:
                return (
                    <AccessRequest
                        {...{
                            expanded,
                            handleChange,
                        }}
                    />
                );
            case 2:
                return (
                    <Suspended
                        {...{
                            expanded,
                            handleChange,
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <Box m="1.5rem 2.5rem">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Header title="Admin" subtitle="Admin and access control management" />
                </Box>
                <Box m="2.5rem 0 0 0">
                    <Tabs value={value} onChange={handleTabChange}>
                        <Tab label="Staff" />
                        <Tab label="Access Request" />
                        <Tab label="Suspended" />
                    </Tabs>
                </Box>
                {renderTabContent()}
            </Box>
        </div>
    )
}

export default Support