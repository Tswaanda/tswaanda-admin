import React, { useState } from 'react'
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
import ContactFarmer from './ContactFarmer';
import UpdateFarmer from '../../scenes/updateFarmer/index';
import UpdateFarmerStatus from './UpdateFarmerStatus';

const PendingFarmers = ({
    pendingFarmers,
    updateFarmerStatus,
    setFarmerStatus,
    expanded,
    showStatus,
    updating,
    selectedFarmerId,
    handleChange,
    updated,
    setUpdated
}) => {

    const theme = useTheme();

    const [showContact, setShowContactForm] = useState(false);
    const [showStatusForm, setShowStatusForm] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [farmer, setFarmer] = useState(null);

    const [openStatusModal, setStatusModal] = useState(false);
    const [openContactModal, setContactModal] = useState(false);

    const onClose = () => {
        setIsOpen(false);
    };

    const showContactForm = (farmer) => {
        setFarmer(farmer);
        setShowContactForm(!showContact);
        setContactModal(true);
        setShowStatusForm(false);
        setIsOpen(false);
    }

    const handleShowStatusForm = (farmer) => {
        setFarmer(farmer);
        setShowStatusForm(!showStatusForm);
        setStatusModal(true);
        setShowContactForm(false);
        setIsOpen(false);
    }

    const showUpdateForm = (farmer) => {
        setFarmer(farmer);
        setIsOpen(!isOpen);
        setShowStatusForm(false);
        setShowContactForm(false);
    }

    return (
        <Box m="1rem 0 0 0">
            {pendingFarmers?.map((farmer) => (
                <Accordion
                    key={farmer.id}
                    expanded={expanded === farmer.id}
                    onChange={handleChange(farmer.id)}
                    sx={{ backgroundColor: theme.palette.background.alt }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{ width: "25%", flexShrink: 0 }}>
                            <span style={{ fontWeight: "bold" }}>Username</span>:
                            {farmer.fullName}
                        </Typography>
                        <Typography
                            sx={{ color: "text.secondary", width: "25%", flexShrink: 0 }}
                        >
                            <span style={{ fontWeight: "bold" }}>Email</span>:{" "}
                            {farmer.email}
                        </Typography>
                        <Typography sx={{ color: "text.secondary", width: "25%" }}>
                            <span style={{ fontWeight: "bold" }}>Status</span>:{" "}
                            {farmer.isVerified ? "Approved" : "Pending"}
                        </Typography>
                        <Typography sx={{ color: "text.secondary", width: "25%" }}>
                            <span style={{ fontWeight: "bold" }}>Date</span>:{" "}
                            {farmer.created}
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
                                        farmer
                                        xs={6}
                                    >
                                        <Typography
                                            style={{ fontSize: "2rem", fontWeight: "bold" }}
                                        >
                                            {farmer.fullName}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <hr />
                                <AccordionSummary
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <Typography sx={{ width: "50%", flexShrink: 0 }}>
                                        <span style={{ fontWeight: "bold" }}>Username</span>:
                                        {farmer.fullName}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            width: "50%",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <span style={{ fontWeight: "bold" }}>Phone Number</span>:{" "}
                                        {farmer.phone}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionSummary>
                                    <Typography
                                        sx={{
                                            width: "50%",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <span style={{ fontWeight: "bold" }}>Location</span>:{" "}
                                        {farmer.location}
                                    </Typography>
                                    <Typography sx={{ width: "50%", flexShrink: 0 }}>
                                        <span style={{ fontWeight: "bold" }}>Farm</span>:
                                        {farmer.farmName}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionSummary>
                                    <Typography sx={{ width: "50%", flexShrink: 0 }}>
                                        <span style={{ fontWeight: "bold" }}>About</span>:{" "}
                                        {farmer.description}
                                    </Typography>
                                    <Typography sx={{ width: "50%", flexShrink: 0 }}>
                                        <span style={{ fontWeight: "bold" }}>Address</span>:{" "}
                                        {farmer.streetAdrees}
                                    </Typography>
                                </AccordionSummary>
                                <hr />
                                <CardActions>
                                    <Button
                                        onClick={() => handleShowStatusForm(farmer)}
                                        variant="outlined"
                                        size="small"
                                        style={{
                                            backgroundColor:
                                                selectedFarmerId === farmer.id && showStatus
                                                    ? "white"
                                                    : undefined,
                                            color:
                                                selectedFarmerId === farmer.id && showStatus
                                                    ? "green"
                                                    : "white",
                                        }}
                                    >
                                        Update Farmer status
                                    </Button>
                                    <Button
                                        onClick={() => showContactForm(farmer)}
                                        variant="outlined"
                                        size="small"
                                        style={{
                                            backgroundColor:
                                                showContact
                                                    ? "white"
                                                    : undefined,
                                            color:
                                                showContact
                                                    ? "green"
                                                    : "white",
                                        }}
                                    >
                                        Contact Farmer
                                    </Button>
                                    <Button
                                        onClick={() => showUpdateForm(farmer)}
                                        variant="outlined"
                                        size="small"
                                        style={{
                                            backgroundColor:
                                                isOpen
                                                    ? "white"
                                                    : undefined,
                                            color:
                                                isOpen
                                                    ? "green"
                                                    : "white",
                                        }}
                                    >
                                        Update information
                                    </Button>
                                </CardActions>
                            </Container>

                           
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
            <>
                {showContact && (
                    <ContactFarmer {...{ farmer, setShowContactForm, theme, openContactModal, setContactModal }} />
                )}
                 {showStatusForm && (
                           <UpdateFarmerStatus {...{
                                farmer,
                                theme,
                                openStatusModal,
                                setStatusModal,
                                updateFarmerStatus,
                                setFarmerStatus,
                                updating,
                                updated,
                                setUpdated,
                            }}/>
                            )}

                {isOpen && <UpdateFarmer
                    {...{
                        farmer, isOpen, onClose
                    }} />}
            </>
        </Box>
    )
}

export default PendingFarmers