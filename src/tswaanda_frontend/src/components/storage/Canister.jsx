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

const Canister = ({ canister }) => {
    const theme = useTheme();
    return (
        <div className="">
            <Accordion sx={{ backgroundColor: theme.palette.background.alt }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography sx={{ width: "25%", flexShrink: 0 }}>
                        <span style={{ fontWeight: "bold" }}>Canister</span>:
                        {canister.name}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box
                        sx={{
                            backgroundImage: "none",
                            backgroundColor: theme.palette.background.alt,
                            borderRadius: "0.55rem",
                        }}
                    >
                        <Container maxWidth="md" style={{ marginTop: "2rem" }}>
                            <Grid
                                container
                                style={{ display: "flex", alignItems: "center" }}
                                spacing={4}
                                m="0 0.1rem 0 0.1rem"
                            >
                                <Grid
                                    style={{ display: "flex", alignItems: "center" }}
                                    canister
                                    xs={6}
                                >
                                    <Typography
                                        style={{ fontSize: "2rem", fontWeight: "bold" }}
                                    >
                                        Something here
                                    </Typography>
                                </Grid>
                            </Grid>
                            <hr />
                            <CardActions>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    style={{ backgroundColor: "white" }}
                                >
                                    Update Access Level
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    style={{
                                        backgroundColor: "white"
                                    }}
                                >
                                    Contact Member
                                </Button>
                            </CardActions>
                        </Container>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default Canister