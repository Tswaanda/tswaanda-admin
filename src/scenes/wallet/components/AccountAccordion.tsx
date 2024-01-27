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

const AccountAccordion = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const { walletActor } = useAuth();

  const [openSendModal, setOpenSendModal] = useState(false);
  const [openControllerModal, setOpenControllerModal] = useState(false);
  const [openReceiveModal, setOpenReceiveModal] = useState(false);

  const accordionRef = useRef<HTMLDivElement>(null);

  const handleSend = (address, amount) => {
    console.log(`Sending ${amount} to ${address}`);
    // Add logic to handle sending cryptocurrency
    };


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accordionRef.current &&
        !accordionRef.current.contains(event.target as Node)
      ) {
        setExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [accordionRef]);

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
    <Box m="1rem 0 0 0" ref={accordionRef}>
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
            <span style={{ fontWeight: "bold" }}>Name</span>: ckBTC
          </Typography>
          <Typography sx={{ width: "25%", flexShrink: 0 }}>
            <span style={{ fontWeight: "bold" }}>Balance</span>: 3.45 ckBTC
          </Typography>
          <Typography sx={{ width: "25%", flexShrink: 0 }}>
            <span style={{ fontWeight: "bold" }}>Address</span>:
            0x03923d2210929109aq92232s223
          </Typography>
          <Typography
            sx={{ color: "text.secondary", width: "25%", flexShrink: 0 }}
          >
            <span style={{ fontWeight: "bold" }}>Created</span>:{" "}
            2021-10-06T18:52:58.000Z
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
                  <span style={{ fontWeight: "bold" }}>Memory size:</span> {""}3
                  GB
                </Typography>
                <Typography
                  sx={{
                    width: "50%",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>Status</span>{" "}
                  {/* {("Stopped" in status.status && "Stopped") ||""}
        {("Running" in status.status && "Running") ||""}
        {("Stopping" in status.status && "Stopping") ||""} */}
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
                  {/* {Number(status.settings.memory_allocation)} GB */}3 GB
                </Typography>
                <Typography
                  sx={{ width: "50%", flexShrink: 0, fontWeight: "bold" }}
                >
                  Freezing threshold:{" "}
                  {/* {Number(status.settings.freezing_threshold) / 86400} Days */}
                  3 Days
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
                  {/* {status.settings.controllers.map((controller, index) => (
            <Typography key={index}>
                {controller.toString()}
            </Typography>
        ))} */}
                  0x03923d2210929109aq92232s223
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
                  onClick={() => setOpenControllerModal(true)}
                >
                  Add Controller
                </Button>
                <AddControllersModal
                  isOpen={openControllerModal}
                  onClose={() => setOpenControllerModal(false)}
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
                <ReceiveModal
                  isOpen={openReceiveModal}
                  onClose={() => setOpenReceiveModal(false)}  
                />
                <Button
                  onClick={createAccountAddress}
                  variant="outlined"
                  size="small"
                  style={{
                    backgroundColor: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  Create Address
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  style={{
                    backgroundColor: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  View Transactions
                </Button>
              </CardActions>
            </Container>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default AccountAccordion;
