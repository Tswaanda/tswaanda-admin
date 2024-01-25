import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  CardActions,
  Button,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContactCustomerForm from "./ContactCustomerForm";
import IdentficationDoc from "./IdentficationDoc";
import ProofOfAddress from "./ProofOfAddress";
import UpdateCustomerStatusForm from "./UpdateCustomerStatusForm";

const CustomerAccordion = ({
  customer,
  theme,
  updating,
  setUpdated,
  updated,
  updateCustomerStatus,
  setCustomerStatus,
}) => {
  const [showContact, setShowContactForm] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [showIdentification, setShowIdentification] = useState(false);
  const [showProofOfAddress, setShowProofOfAddress] = useState(false);

  const [openStatusModal, setStatusModal] = useState(false);
  const [openContactModal, setContactModal] = useState(false);
  const [openPOAModal, setPOAModal] = useState(false);
  const [openIDModal, setIDModal] = useState(false);
  const [expanded, setExpanded] = useState<boolean| false>(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  const showContactForm = () => {
    setShowContactForm(!showContact);
    setContactModal(true);
    setShowStatusForm(false);
    setShowIdentification(false);
    setShowProofOfAddress(false);
  };

  const showIdentificationDoc = () => {
    setShowIdentification(!showIdentification);
    setIDModal(!openIDModal);
    setShowStatusForm(false);
    setShowContactForm(false);
    setShowProofOfAddress(false);
  };

  const showProofOfAddressDoc = () => {
    setShowProofOfAddress(!showProofOfAddress);
    setPOAModal(!openPOAModal);
    setShowStatusForm(false);
    setShowContactForm(false);
    setShowIdentification(false);
  };

  const handleShowStatusForm = () => {
    setStatusModal(true);
    setShowStatusForm(!showStatusForm);
    setShowContactForm(false);
    setShowIdentification(false);
    setShowProofOfAddress(false);
  };
  return (
    <>
      <Accordion
        key={customer.id}
        expanded={expanded}
        onChange={handleChange}
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "25%", flexShrink: 0 }}>
            <span style={{ fontWeight: "bold" }}>Username</span>: @
            {customer.body[0] ? customer.body[0].userName : "Anon"}
          </Typography>
          <Typography
            sx={{ color: "text.secondary", width: "25%", flexShrink: 0 }}
          >
            <span style={{ fontWeight: "bold" }}>Email</span>:{" "}
            {customer.body[0] ? customer.body[0].email : "Anon"}
          </Typography>
          <Typography sx={{ color: "text.secondary", width: "25%" }}>
            <span style={{ fontWeight: "bold" }}>Status</span>:{" "}
            {customer.body[0] ? customer.body[0].status : "Anon"}
          </Typography>
          <Typography sx={{ color: "text.secondary", width: "25%" }}>
            <span style={{ fontWeight: "bold" }}>Date</span>: {customer.created}
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
                <Grid style={{ display: "flex", alignItems: "center" }}>
                  <Typography style={{ fontSize: "2rem", fontWeight: "bold" }}>
                    {customer.body[0] ? customer.body[0].firstName : "Anon"}
                  </Typography>
                  <Typography
                    style={{ fontSize: "2rem", fontWeight: "bold" }}
                    m="0 0 0 2rem"
                  >
                    {customer.body[0] ? customer.body[0].lastName : "Anon"}
                  </Typography>
                </Grid>
                <Grid>
                  <Box
                    component="img"
                    alt="profile"
                    src={
                      customer.body[0]
                        ? customer.body[0].profilePicture
                        : `/anon.png`
                    }
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
                  {customer.body[0] ? customer.body[0].userName : "Anon"}
                </Typography>
                <Typography
                  sx={{
                    width: "50%",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>Phone Number</span>:{" "}
                  {customer.body[0] ? customer.body[0].phoneNumber : "Anon"}
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
                  {customer.body[0] ? customer.body[0].country : "Anon"}
                </Typography>
                <Typography sx={{ width: "50%", flexShrink: 0 }}>
                  <span style={{ fontWeight: "bold" }}>Organization</span>:
                  {customer.body[0] ? customer.body[0].organization : "Anon"}
                </Typography>
              </AccordionSummary>
              <AccordionSummary>
                <Typography sx={{ width: "50%", flexShrink: 0 }}>
                  <span style={{ fontWeight: "bold" }}>About</span>:{" "}
                  {customer.body[0] ? customer.body[0].about : "Anon"}
                </Typography>
                <Typography sx={{ width: "50%", flexShrink: 0 }}>
                  <span style={{ fontWeight: "bold" }}>Address</span>:{" "}
                  {customer.body[0] ? customer.body[0].address : "Anon"}
                </Typography>
              </AccordionSummary>
              <hr />
              {customer.body[0] && (
                <CardActions>
                  <Button
                    onClick={handleShowStatusForm}
                    variant="outlined"
                    size="small"
                    style={{
                      backgroundColor: showStatusForm ? "white" : undefined,
                      color: showStatusForm ? "green" : "white",
                    }}
                  >
                    Update Customer status
                  </Button>
                  <Button
                    onClick={ showContactForm}
                    variant="outlined"
                    size="small"
                    style={{
                      backgroundColor: showContact ? "white" : undefined,
                      color: showContact ? "green" : "white",
                    }}
                  >
                    Contact customer
                  </Button>
                  <Button
                    onClick={showIdentificationDoc}
                    variant="outlined"
                    size="small"
                    style={{
                      backgroundColor: showIdentification ? "white" : undefined,
                      color: showIdentification ? "green" : "white",
                    }}
                  >
                    View Identification
                  </Button>
                  <Button
                    onClick={showProofOfAddressDoc}
                    variant="outlined"
                    size="small"
                    style={{
                      backgroundColor: showProofOfAddress ? "white" : undefined,
                      color: showProofOfAddress ? "green" : "white",
                    }}
                  >
                    View Proof of Address
                  </Button>
                </CardActions>
              )}
            </Container>
          </Box>
        </AccordionDetails>
      </Accordion>
      {showStatusForm && (
        <UpdateCustomerStatusForm
          {...{
            setUpdated,
            updated,
            openStatusModal,
            setStatusModal,
            customer,
            setShowStatusForm,
            theme,
            updateCustomerStatus,
            setCustomerStatus,
            updating,
          }}
        />
      )}
      {showContact && (
        <ContactCustomerForm
          {...{
            openContactModal,
            setContactModal,
            customer,
            setShowContactForm,
            theme,
          }}
        />
      )}
      {showIdentification && (
        <IdentficationDoc
          {...{ setIDModal, openIDModal, showIdentificationDoc, customer }}
        />
      )}
      {showProofOfAddress && (
        <ProofOfAddress
          {...{ openPOAModal, setPOAModal, showProofOfAddressDoc, customer }}
        />
      )}
    </>
  );
};

export default CustomerAccordion;
