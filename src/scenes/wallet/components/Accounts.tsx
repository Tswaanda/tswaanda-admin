import { Box, Button, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AccountAccordion from "./AccountAccordion";

const Accounts = () => {
  const theme = useTheme();

  const handleCreateAccount = () => {
    console.log("Create Account");
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
      <AccountAccordion />
      <AccountAccordion />
      <AccountAccordion />
    </Box>
  );
};

export default Accounts;
