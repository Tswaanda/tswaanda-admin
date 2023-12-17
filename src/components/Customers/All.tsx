import React, { FC, useState } from 'react'
import {
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
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
import ContactCustomerForm from './ContactCustomerForm';
import IdentficationDoc from './IdentficationDoc';
import ProofOfAddress from './ProofOfAddress';
import UpdateCustomerStatusForm from './UpdateCustomerStatusForm';

type Props = {
    customers: any,
    updateCustomerStatus: any,
    setCustomerStatus: any,
    expanded: any,
    updating: any,
    handleChange: any,
    setUpdated: any,
    updated: any,
}

const All: FC<Props> = ({
    customers,
    updateCustomerStatus,
    setCustomerStatus,
    expanded,
    updating,
    handleChange, setUpdated,
    updated, }) => {

    const theme = useTheme();

    const [showContact, setShowContactForm] = useState(false);
    const [showStatusForm, setShowStatusForm] = useState(false);
    const [showIdentification, setShowIdentification] = useState(false);
    const [showProofOfAddress, setShowProofOfAddress] = useState(false);

    const [openPOAModal, setPOAModal] = useState(false);
    const [openIDModal, setIDModal] = useState(false);

    const [openStatusModal, setStatusModal] = useState(false);
    const [openContactModal, setContactModal] = useState(false);

    const [customer, setCustomer] = useState({});

    const showContactForm = (customer: any) => {
        setCustomer(customer);
        setShowContactForm(!showContact);
        setContactModal(true)
        setShowStatusForm(false);
        setShowIdentification(false);
        setShowProofOfAddress(false);
    }

    const showIdentificationDoc = (customer: any) => {
        setCustomer(customer);
        setShowIdentification(!showIdentification);
        setIDModal(!openIDModal)
        setShowStatusForm(false);
        setShowContactForm(false);
        setShowProofOfAddress(false);
    }

    const showProofOfAddressDoc = (customer: any) => {
        setCustomer(customer);
        setShowProofOfAddress(!showProofOfAddress);
        setPOAModal(!openPOAModal)
        setShowStatusForm(false);
        setShowContactForm(false);
        setShowIdentification(false);
    }

    const handleShowStatusForm = (customer: any) => {
        setCustomer(customer);
        setStatusModal(true)
        setShowStatusForm(!showStatusForm);
        setShowContactForm(false);
        setShowIdentification(false);
        setShowProofOfAddress(false);
    }

    return (
        <Box m="1rem 0 0 0">
            {customers?.map((customer) => (
                <Accordion
                    key={customer.id}
                    expanded={expanded === customer.id}
                    onChange={handleChange(customer.id)}
                    sx={{ backgroundColor: theme.palette.background.default }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{ width: "25%", flexShrink: 0 }}>
                            <span style={{ fontWeight: "bold" }}>Username</span>: @
                            {customer.body ? customer.body.userName : "Anon"}
                        </Typography>
                        <Typography
                            sx={{ color: "text.secondary", width: "25%", flexShrink: 0 }}
                        >
                            <span style={{ fontWeight: "bold" }}>Email</span>:{" "}
                            {customer.body ? customer.body.email : "Anon"}
                        </Typography>
                        <Typography sx={{ color: "text.secondary", width: "25%" }}>
                            <span style={{ fontWeight: "bold" }}>Status</span>:{" "}
                            {customer.body ? customer.body.status : "Anon"}
                        </Typography>
                        <Typography sx={{ color: "text.secondary", width: "25%" }}>
                            <span style={{ fontWeight: "bold" }}>Date</span>:{" "}
                            {customer.created}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box
                            sx={{
                                backgroundImage: "none",
                                backgroundColor: theme.palette.background.default,
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
                                        xs={6}
                                    >
                                        <Typography
                                            style={{ fontSize: "2rem", fontWeight: "bold" }}
                                        >
                                            {customer.body ? customer.body.firstName : "Anon"}
                                        </Typography>
                                        <Typography
                                            style={{ fontSize: "2rem", fontWeight: "bold" }}
                                            m="0 0 0 2rem"
                                        >
                                            {customer.body ? customer.body.lastName : "Anon"}
                                        </Typography>
                                    </Grid>
                                    <Grid  xs={6}>
                                        <Box
                                            component="img"
                                            alt="profile"
                                            src={customer.body ? customer.body.profilePicture : `/anon.png`}
                                            height="200px"
                                            width="200px"
                                            sx={{ objectFit: "cover" }}
                                        />
                                    </Grid>
                                </Grid>
                                <hr />
                                <AccordionSummary
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <Typography sx={{ width: "50%", flexShrink: 0 }}>
                                        <span style={{ fontWeight: "bold" }}>Username</span>:
                                        {customer.body ? customer.body.userName : "Anon"}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            width: "50%",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <span style={{ fontWeight: "bold" }}>Phone Number</span>:{" "}
                                        {customer.body ? customer.body.phoneNumber : "Anon"}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionSummary>
                                    <Typography
                                        sx={{
                                            width: "50%",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <span style={{ fontWeight: "bold" }}>Country</span>:{" "}
                                        {customer.body ? customer.body.country : "Anon"}
                                    </Typography>
                                    <Typography sx={{ width: "50%", flexShrink: 0 }}>
                                        <span style={{ fontWeight: "bold" }}>Organization</span>:
                                        {customer.body ? customer.body.organization : "Anon"}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionSummary>
                                    <Typography sx={{ width: "50%", flexShrink: 0 }}>
                                        <span style={{ fontWeight: "bold" }}>About</span>:{" "}
                                        {customer.body ? customer.body.about : "Anon"}
                                    </Typography>
                                    <Typography sx={{ width: "50%", flexShrink: 0 }}>
                                        <span style={{ fontWeight: "bold" }}>Address</span>:{" "}
                                        {customer.body ? customer.body.address : "Anon"}
                                    </Typography>
                                </AccordionSummary>
                                <hr />
                                {customer.body && <CardActions>
                                    <Button
                                        onClick={
                                            () => handleShowStatusForm(customer)
                                        }
                                        variant="outlined"
                                        size="small"
                                        style={{
                                            backgroundColor:
                                                showStatusForm
                                                    ? "white"
                                                    : undefined,
                                            color:
                                                showStatusForm
                                                    ? "green"
                                                    : "white",
                                        }}
                                    >
                                        Update Customer status
                                    </Button>
                                    <Button
                                        onClick={
                                            () => showContactForm(customer)
                                        }
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
                                        Contact customer
                                    </Button>
                                    <Button
                                        onClick={
                                            () => showIdentificationDoc(customer)
                                        }
                                        variant="outlined"
                                        size="small"
                                        style={{
                                            backgroundColor:
                                                showIdentification
                                                    ? "white"
                                                    : undefined,
                                            color:
                                                showIdentification
                                                    ? "green"
                                                    : "white",
                                        }}
                                    >
                                        View Identification
                                    </Button>
                                    <Button
                                        onClick={
                                            () => showProofOfAddressDoc(customer)
                                        }
                                        variant="outlined"
                                        size="small"
                                        style={{
                                            backgroundColor:
                                                showProofOfAddress
                                                    ? "white"
                                                    : undefined,
                                            color:
                                                showProofOfAddress
                                                    ? "green"
                                                    : "white",
                                        }}
                                    >
                                        View Proof of Address
                                    </Button>

                                </CardActions>}
                            </Container>



                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
            <>

                {showStatusForm && (
                    <UpdateCustomerStatusForm {...{
                        setUpdated,
                        updated, openStatusModal, setStatusModal, customer, setShowStatusForm, theme, updateCustomerStatus, setCustomerStatus, updating
                    }} />
                )}
                {showContact && (
                    <ContactCustomerForm {...{ openContactModal, setContactModal, customer, setShowContactForm, theme }} />
                )}
                {showIdentification && (
                    <IdentficationDoc {...{ setIDModal, openIDModal, showIdentificationDoc, customer }} />
                )}
                {showProofOfAddress && (
                    <ProofOfAddress {...{ openPOAModal, setPOAModal, showProofOfAddressDoc, customer }} />
                )}
            </>
        </Box>
    )
}

export default All