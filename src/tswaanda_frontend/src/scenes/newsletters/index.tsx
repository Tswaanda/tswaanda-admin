import React, { useEffect, useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Button,
} from "@mui/material";
import Header from "../../components/Header";
import SendEmails from '../../components/Newsletter/SendMails';
import Clients from '../../components/Newsletter/Clients';
import { useAuth } from '../../hooks/auth';


const Newsletter = () => {
    const { marketActor } = useAuth()
    const [value, setValue] = useState(0);
    const [clients, setClients] = useState([])

    useEffect(() => {
        getClients()
    }, [])

    const getClients = async () => {
        const res = await marketActor.getAllNewsLetterSubcribersEntries()
        const sortedData = res.sort(
            (a, b) => Number(b.created) - Number(a.created)
        );
        const convertedClients = convertData(sortedData);
        setClients(convertedClients)
    }

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const convertData = (data) => {
        if (!data) {
            return [];
        }

        const formatCustomerDate = (timestamp) => {
            const date = new Date(Number(timestamp));
            const options = {
                weekday: "short",
                day: "numeric",
                month: "long",
                year: "numeric",
            };
            return date.toLocaleDateString("en-US", options);
        };

        const formatCustomerTime = (timestamp) => {
            const date = new Date(Number(timestamp));
            const options = {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            };
            return date.toLocaleTimeString("en-US", options);
        };

        const modifiedClients = data.map((client) => {


            const formattedDate = formatCustomerDate(client.created);
            const formattedTime = formatCustomerTime(client.created);

            return {
                ...client,
                created: `${formattedDate} at ${formattedTime}`,
            };
        });

        return modifiedClients;
    }

    const renderTabContent = () => {
        switch (value) {
            case 0:
                return (
                    <Clients
                        {...{
                            clients
                        }}
                    />
                );

            case 1:
                return (
                    <SendEmails
                        {...{
                            clients
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="">
            <Box m="1.5rem 2.5rem">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Header title="CUSTOMERS" subtitle="List of Active Customers" />
                </Box>

                <Box m="2.5rem 0 0 0">
                    <Tabs value={value} onChange={handleTabChange}>
                        <Tab label="Clients" />
                        <Tab label="Send Emails" />
                    </Tabs>
                </Box>
                {renderTabContent()}
            </Box>
        </div>
    )
}

export default Newsletter