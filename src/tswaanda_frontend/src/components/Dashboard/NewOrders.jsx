import React, { useState } from "react";
import {
    Box,
    Typography,
    useTheme,
    CardActions,
    Button,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";

const NewOrders = ({
    orders,
}) => {

    const theme = useTheme();

    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    return (
        <Box m="1rem 0 0 0">
            {orders?.map((order, index) => (
                <Accordion
                    key={index}
                    expanded={expanded === order.orderId}
                    onChange={handleChange(order.orderId)}
                    sx={{ backgroundColor: theme.palette.background.alt }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{ width: "25%", flexShrink: 0 }}>
                            <span style={{ fontWeight: "bold" }}>Order</span>:{" "}
                            {order.orderNumber}
                        </Typography>
                        <Typography
                            sx={{ color: "text.secondary", width: "30%", flexShrink: 0 }}
                        >
                            <span style={{ fontWeight: "bold" }}>Customer</span>:{" "}
                            {order.userEmail}
                        </Typography>
                        <Typography sx={{ color: "text.secondary" }}>
                            <span style={{ fontWeight: "bold" }}>Date</span>:{" "}
                            {order.dateCreated}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <CardActions>
                            <Button
                                component={Link}
                                to={`/orders`}
                                variant="outlined"
                                size="small"
                                style={{
                                    backgroundColor: "green",
                                    color: "white",
                                }}
                            >
                                View more
                            </Button>
                        </CardActions>
                      
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default NewOrders;
