import React, { FC, useEffect, useState } from 'react'
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
import { useAuth } from '../../../hooks/auth';
import { type } from 'os';
import { Status } from '../../../declarations/tswaanda_backend/tswaanda_backend.did';
import { CustomStatus } from './utils/types';

type Props = {
    canister: any,
    unauthorized: boolean,
    setUnauthorized: any
}

const Canister : FC<Props> = ({ canister, unauthorized, setUnauthorized }) => {
    const theme = useTheme();
    const { identity, backendActor } = useAuth()
    const [status, setStatus] = useState<CustomStatus| null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (canister) {
            getCanisterInfo();
        }
    }, [canister])

    const getCanisterInfo = async () => {
        try {
            setLoading(true)
            const modifyStatus = (status: any) => {
                if ("running" in status) {
                    return "Running"
                } else if ("stopping" in status) {
                    return "Stopping"
                } else if ("stopped" in status) {
                    return "Stopped"
                }
            }

            const status = await backendActor?.getCanisterStatus(Principal.fromText(canister.id));
           if (status && "ok" in status) {
            let modifiedStatus: CustomStatus = {
                ...status.ok,
                memory_size: Number(status.ok.memory_size) / 1073741824,
                cycles: Number(status.ok.cycles) / 1000000000000,
                status: modifyStatus(status.ok.status),
                memory_allocation: Number(status.ok.settings.memory_allocation) / 1073741824,
            }
            setStatus(modifiedStatus)
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
            <Accordion sx={{ backgroundColor: theme.palette.background.default }}>
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
                        {Number(status.cycles)} TC
                    </Typography>}
                </AccordionSummary>
                {loading ? <h3>Loading</h3> : <AccordionDetails>
                    {status && <Box
                        sx={{
                            backgroundImage: "none",
                            backgroundColor: theme.palette.background.default,
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
                                    {Number(status.memory_size)} GB
                                </Typography>
                                <Typography
                                    sx={{
                                        width: "50%",
                                        flexShrink: 0,
                                    }}
                                >
                                    <span style={{ fontWeight: "bold" }}>Status</span>{" "}
                                    {("Stopped" === status.status && "Stopped") ||""}
                                    {("Running" === status.status && "Running") ||""}
                                    {("Stopping" === status.status && "Stopping") ||""}
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
                                    {Number(status.settings.memory_allocation)} GB
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