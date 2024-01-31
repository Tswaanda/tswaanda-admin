import { useEffect, useRef, useState } from "react";
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
import { ChainEnum } from "../../../walletIDL/wallet.did";
import { useAuth } from "../../../hooks/auth";

import SendModal from "./SendModal";
import AddControllersModal from "./AddControllerModal";
import ReceiveModal from "./ReceiveModal";

const AccountAccordion = ({data}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const { walletActor } = useAuth();

  const [openSendModal, setOpenSendModal] = useState(false);
  const [openControllerModal, setOpenControllerModal] = useState(false);
  const [openReceiveModal, setOpenReceiveModal] = useState(false);

  const handleSend = (address, amount) => {
    console.log(`Sending ${amount} to ${address}`);
  };

  useEffect(() => {
    if (walletActor) {
      getBalance();
    }
  }, [walletActor]);

  const createAccountAddress = async () => {
    try {
      let arg: ChainEnum = {
        BTC: {
          Testnet: null,
        },
      };
      let res = await walletActor?.account_create_address("Tswaanda", arg);
      console.log("Create Account Address response", res);
    } catch (error) {
      console.log("Create Account Address error", error);
    }
  };

  const getBalance = async () => {
    try {
      let arg: ChainEnum = {
        BTC: {
          Testnet: null,
        },
      };
      let res = await walletActor?.account_balance("Tswaanda", arg);
      console.log("Get Balance response", res);
    } catch (error) {
      console.log("Get Balance error", error);
    }
  };

  return (
    <Box m="1rem 0 0 0">
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{
          backgroundColor: theme.palette.background.default,
          paddingY: 1.5,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "25%", flexShrink: 0 }}>
            <span style={{ fontWeight: "bold" }}>Name</span>: {data.name}
          </Typography>
          <Typography sx={{ width: "25%", flexShrink: 0 }}>
            <span style={{ fontWeight: "bold" }}>Balance</span>: {data.balance}
          </Typography>
          <Typography sx={{ width: "25%", flexShrink: 0 }}>
            <span style={{ fontWeight: "bold" }}>Address</span>:
            {data.address}
          </Typography>
          <Typography
            sx={{ color: "text.secondary", width: "25%", flexShrink: 0 }}
          >
            <span style={{ fontWeight: "bold" }}>Created</span>:{" "}
            {data.created}
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
            <Container maxWidth="md" style={{ marginTop: "1rem" }}>
              <AccordionSummary
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography sx={{ width: "50%", flexShrink: 0 }}>
                  <span style={{ fontWeight: "bold" }}>Memory size:</span> {""}{data.memorySize}
                  GB
                </Typography>
                <Typography
                  sx={{
                    width: "50%",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>Status</span>{" "}
                  {data.status}
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
                  {data.memoryAllocation} GB
                </Typography>
                <Typography
                  sx={{ width: "50%", flexShrink: 0, fontWeight: "bold" }}
                >
                  Freezing threshold:{" "}
                  
                  {data.freezingThreshold}
                </Typography>
              </AccordionSummary>
              <AccordionSummary>
                <Typography
                  sx={{
                    width: "50%",
                    flexShrink: 0,
                    fontWeight: "bold",
                  }}
                >
                  Controllers:{" "}
                  {data.controllers}
                </Typography>
              </AccordionSummary>

              <hr />
              <CardActions>
                <Button
                  variant="outlined"
                  size="small"
                  style={{
                    backgroundColor: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                  onClick={() => setOpenSendModal(true)}
                >
                  Send
                </Button>
                <SendModal
                  isOpen={openSendModal}
                  onClose={() => setOpenSendModal(false)}
                  onSend={handleSend}
                />
                <Button
                  variant="outlined"
                  size="small"
                  style={{
                    backgroundColor: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                  onClick={() => setOpenReceiveModal(true)}
                >
                  Receive
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  style={{
                    backgroundColor: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                  onClick={() => setOpenControllerModal(true)}
                >
                  Add Controller
                </Button>
                <AddControllersModal
                  isOpen={openControllerModal}
                  onClose={() => setOpenControllerModal(false)}
                />
                <ReceiveModal
                  isOpen={openReceiveModal}
                  onClose={() => setOpenReceiveModal(false)}
                />
              </CardActions>
            </Container>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default AccountAccordion;
