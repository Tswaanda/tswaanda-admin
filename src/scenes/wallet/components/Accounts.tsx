import { Box, Button, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AccountAccordion from "./AccountAccordion";
import { useAuth } from "../../../hooks/auth";
import {
  Environment,
} from "../../../walletIDL/wallet.did";

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
      <AccountAccordion  />
    </Box>
  );
};

export default Accounts;
