import { Box, Button, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AccountAccordion from "./AccountAccordion";
import { useAuth } from "../../../hooks/auth";
import {
  Environment,
} from "../../../walletIDL/wallet.did";

const accordionData = [
  {
    name: 'ckBTC',
    balance: '3.45 ckBTC',
    address: '0x03923d2210929109aq92232s223',
    created: '2021-10-06T18:52:58.000Z',
    memorySize: '3 GB',
    status: 'Running', 
    memoryAllocation: '3 GB',
    freezingThreshold: '3 Days',
    controllers: '0x03923d2210929109aq92232s223'
  },
  {
    name: 'ICP',
    balance: '10.2 ICP',
    address: '0x1234567890abcdef1122334455667788',
    created: '2022-01-15T10:30:45.000Z',
    memorySize: '4 GB',
    status: 'Stopped',
    memoryAllocation: '4 GB',
    freezingThreshold: '5 Days',
    controllers: '0x1234567890abcdef1122334455667788'
  },
  {
    name: 'ckETH',
    balance: '5.75 ckETH',
    address: '0xabcdef12345678900987654321fedcba',
    created: '2023-03-21T09:20:30.000Z',
    memorySize: '2 GB',
    status: 'Stopping',
    memoryAllocation: '2 GB',
    freezingThreshold: '2 Days',
    controllers: '0xabcdef12345678900987654321fedcba'
  }
];


const Accounts = () => {
  const theme = useTheme();
  const { walletActor } = useAuth();

  const handleCreateAccount = async () => {
   try {
    let env: Environment = {
      Development: null,
    };
    let res = await walletActor?.account_create([env], ["Tswaanda"]);
    console.log("Create Account response", res);
   } catch (error) {
    console.log("Create Account error", error)
   }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="end" alignItems="center">
        <Button
          variant="contained"
          onClick={handleCreateAccount}
          sx={{
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.background.default,
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          <AddIcon sx={{ mr: "10px" }} />
          Create Account
        </Button>
      </Box>
      {accordionData.map((data, index) => (
        <AccountAccordion key={index} {...{data}} />
      ))}
    </Box>
  );
};

export default Accounts;
