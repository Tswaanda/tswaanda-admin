import React, { useEffect, useState } from 'react'
import {
    Box,
    Container,
    Typography,
    useTheme,
    Grid,
    CardActions,
    Button,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Principal } from "@dfinity/principal";
import { useAuth } from '../../hooks/auth';

const Canister = ({ canister, unauthorized, setUnauthorized }) => {
    const theme = useTheme();
    const { identity, backendActor } = useAuth()
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (canister) {
            getCanisterInfo();
        }
    }, [canister])

    const getCanisterInfo = async () => {
        try {
            setLoading(true)
            const modifyStatus = (status) => {
                if ("running" in status) {
                    return "Running"
                } else if ("stopping" in status) {
                    return "Stopping"
                } else if ("stopped" in status) {
                    return "Stopped"
                }
            }

            const status = await backendActor.getCanisterStatus(Principal.fromText(canister.id));
           if (status.ok) {
            let modifiedSatatus = {
                ...status.ok,
                memory_size: Number(status.ok.memory_size) / 1073741824,
                cycles: Number(status.ok.cycles) / 1000000000000,
                status: modifyStatus(status.ok.status),
                memory_allocation: Number(status.ok.settings.memory_allocation) / 1073741824,
            }
            setStatus(modifiedSatatus)
            setLoading(false)
           } else {
                console.log("Error fetching canister information", status)
                setLoading(false)
                setUnauthorized(true)
           }
        } catch (error) {
            console.log("Error fetching canister information", error)
            setLoading(false)
        }
    }

    return (
        <div className="">
            <Accordion sx={{ backgroundColor: theme.palette.background.alt }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography sx={{ width: "30%", flexShrink: 0 }}>
                        <span style={{ fontWeight: "bold" }}>Canister name:{" "}</span>
                        {canister.name}
                    </Typography>
                    <Typography sx={{ width: "30%", flexShrink: 0 }}>
                        <span style={{ fontWeight: "bold" }}>Id:{" "}</span>
                        {canister.id}
                    </Typography>
                    {status && <Typography sx={{ width: "30%", flexShrink: 0 }}>
                        <span style={{ fontWeight: "bold" }}>Cycles Balance:{" "}</span>
                        {status.cycles} TC
                    </Typography>}
                </AccordionSummary>
                {loading ? <h3>Loading</h3> : <AccordionDetails>
                    {status && <Box
                        sx={{
                            backgroundImage: "none",
                            backgroundColor: theme.palette.background.alt,
                            borderRadius: "0.55rem",
                        }}
                    >
                        <Container maxWidth="md" style={{ marginTop: "1rem" }}>

                            <AccordionSummary
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography sx={{ width: "50%", flexShrink: 0 }}>
                                    <span style={{ fontWeight: "bold" }}>Memory size:</span> {""}
                                    {status.memory_size} GB
                                </Typography>
                                <Typography
                                    sx={{
                                        width: "50%",
                                        flexShrink: 0,
                                    }}
                                >
                                    <span style={{ fontWeight: "bold" }}>Status</span>{" "}
                                    {status.status}
                                </Typography>
                            </AccordionSummary>
                            <AccordionSummary>
                                <Typography
                                    sx={{
                                        width: "50%",
                                        flexShrink: 0,
                                    }}
                                >
                                    <span style={{ fontWeight: "bold" }}>Memory allocation:</span>{" "}
                                    {status.memory_allocation} GB
                                </Typography>
                                <Typography sx={{ width: "50%", flexShrink: 0 }}>
                                    <span style={{ fontWeight: "bold" }}>Freezing threshold:</span> {" "}
                                    {Number(status.settings.freezing_threshold) / 86400} Days
                                </Typography>
                            </AccordionSummary>
                            <AccordionSummary>
                                <Typography
                                    sx={{
                                        width: "50%",
                                        flexShrink: 0,
                                    }}
                                >
                                    <h3 style={{ fontWeight: "bold" }}>Controllers:</h3>{" "}
                                    {status.settings.controllers.map((controller, index) => (
                                        <Typography key={index}>
                                            {controller.toString()}
                                        </Typography>
                                    ))}
                                </Typography>

                            </AccordionSummary>

                            <hr />
                            <CardActions>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    style={{ backgroundColor: "white" }}
                                >
                                    Fetch canister metrics
                                </Button>
                            </CardActions>
                        </Container>
                    </Box>}
                </AccordionDetails>}
            </Accordion>
        </div>
    )
}

export default Canister