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

const Support = () => {
    const { backendActor } = useAuth()
    const [staff, setStaff] = useState([])
    const [accessRequest, setAccessRequest] = useState([])
    const [value, setValue] = useState(0);
    const [expanded, setExpanded] = useState(false);

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        getStaff()
        getAccessRequest()
    }, [])

    const getStaff = async () => {
        try {
            const _staff = await backendActor.getApprovedStaff()
            setStaff(_staff)
        } catch (error) {
            console.log("Error getting staff members", error)
        }
    }

    const getAccessRequest = async () => {
        try {
            const _accessRequest = await backendActor.getUnapprovedStaff()
            setAccessRequest(_accessRequest)
        } catch (error) {
            console.log("Error getting access request", error)
        }
    }

    const renderTabContent = () => {
        switch (value) {
            case 0:
                return (
                    <Staff
                        {...{
                            expanded,
                            staff,
                            handleChange,
                        }}
                    />
                );
            case 1:
                return (
                    <AccessRequest
                        {...{
                            expanded,
                            accessRequest,
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
                    </Tabs>
                </Box>
                {renderTabContent()}
            </Box>
        </div>
    )
}

export default Support