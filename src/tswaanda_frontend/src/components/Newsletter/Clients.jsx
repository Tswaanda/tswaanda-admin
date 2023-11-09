import React, { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    useTheme
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useAuth } from '../../hooks/auth'
import Header from "../../components/Header";

const Clients = ({ clients }) => {
    const theme = useTheme();

    // Calculate the total number of clients
    const unverified = clients?.filter(client => client.isVerified === false)
    const verified = clients?.filter(client => client.isVerified === true)

    return (
        <Box m="1rem 0 0 0">
            <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: "10px" }}>
                <Header title="Clients" subtitle="Email subscribed clients emails data" />
                <Box display="flex" flexDirection="column">
                    <Typography
                        sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "1rem" }}
                    >
                        <span>Total</span>:{" "}
                        {clients?.length}
                    </Typography>
                    <Typography
                        sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "1rem" }}
                    >
                        <span>Verified</span>:{" "}
                        {verified?.length}
                    </Typography>
                    <Typography
                        sx={{ color: "text.secondary", fontWeight: "bold", fontSize: "1rem" }}
                    >
                        <span>Unverified</span>:{" "}
                        {unverified?.length}
                    </Typography>
                </Box>
            </Box>
            {clients?.map((client) => (
                <Accordion
                    key={client.id}
                    sx={{ backgroundColor: theme.palette.background.alt, }}
                >
                    <AccordionSummary
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography
                            sx={{ color: "text.secondary", width: "25%", flexShrink: 0 }}
                        >
                            <span style={{ fontWeight: "bold" }}>Email</span>:{" "}
                            {client.email}
                        </Typography>
                        <Typography sx={{ color: "text.secondary", width: "25%" }}>
                            <span style={{ fontWeight: "bold" }}>Date</span>:{" "}
                            {client.created}
                        </Typography>
                        <Typography sx={{ color: "text.secondary", width: "25%" }}>
                            <span style={{ fontWeight: "bold" }}>Status</span>:{" "}
                            {client.isVerified ? "Email verified" : "Not Verified"}
                        </Typography>
                    </AccordionSummary>
                </Accordion>
            ))}

        </Box>
    )
}

export default Clients