import React, { FC, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccordionDetails from "@mui/material/AccordionDetails";
import {
  AdminKYCUpdate,
  AdminMessage,
  AppMessage,
} from "../../../declarations/tswaanda_backend/tswaanda_backend.did";
import { useAuth } from "../../../hooks/auth";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

type UpdateCustomerStatusFormProps = {
  customer: any;
  openStatusModal: boolean;
  setStatusModal: (show: boolean) => void;
  setCustomerStatus: (status: string) => void;
  updateCustomerStatus: (id: string) => void;
  updating: boolean;
  theme: any;
  setUpdated: (updated: boolean) => void;
  updated: boolean;
};

const UpdateCustomerStatusForm: FC<UpdateCustomerStatusFormProps> = ({
  customer,
  openStatusModal,
  setStatusModal,
  setCustomerStatus,
  updateCustomerStatus,
  updating,
  theme,
  setUpdated,
  updated,
}) => {
  const [localStatus, setLocalStatus] = useState(customer.status || "pending");
  const { ws } = useAuth();

  useEffect(() => {
    setLocalStatus(customer.status || "pending");
  }, [customer.status]);

  const handleStatusChange = (event: SelectChangeEvent) => {
    const newStatus = event.target.value as string;
    setLocalStatus(newStatus);
    setCustomerStatus(newStatus);
  };

  const handleStatusModalClose = () => {
    setStatusModal(false);
  };

  useEffect(() => {
    if (updated) {
      setStatusModal(false);
      setUpdated(false);
    }
  }, [updated]);

  const updateStatus = async () => {
    try {
      sendKYCUpdateWSMessage(localStatus);
      updateCustomerStatus(customer.id);
    } catch (err) {
      console.log("Error updating customer status", err);
    }
  };

  const getStatus = (status: string) => {
    if (status === "approved") {
      let message: string = "Your KYC has been approved";
      let res = {
        status: "Approved",
        message: message,
      };
      return res;
    } else {
      let message: string = "Your KYC has been rejected";
      let res = {
        status: "Rejected",
        message: message,
      };
      return res;
    }
  };

  const sendKYCUpdateWSMessage = async (status: string) => {
    let data = getStatus(status);
    if (customer) {
      let kycmsg: AdminKYCUpdate = {
        marketPlUserclientId: customer.principal,
        status: data.status,
        message: data.message,
        timestamp: BigInt(Date.now()),
      };
      let adminMessage: AdminMessage = {
        KYCUpdate: kycmsg,
      };
      const msg: AppMessage = {
        FromAdmin: adminMessage,
      };
      ws.send(msg);
    }
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleStatusModalClose}
        aria-labelledby="customized-dialog-title"
        open={openStatusModal}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, backgroundColor: theme.palette.background.alt }}
          id="customized-dialog-title"
        >
          Update Customer Status
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleStatusModalClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
            backgroundColor: theme.palette.background.alt,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers
          sx={{
            backgroundColor: theme.palette.background.alt,
            minWidth: "600px",
          }}
        >
          <div className="" style={{ minWidth: "500px" }}>
            <AccordionDetails>
              <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="status-label">Customer status</InputLabel>
                  <Select
                    labelId="status-label"
                    value={localStatus}
                    onChange={handleStatusChange}
                  >
                    <MenuItem value="pending">Pending Approval</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  disabled={updating}
                  color="primary"
                  onClick={updateStatus}
                  sx={{
                    backgroundColor: theme.palette.secondary.light,
                    color: theme.palette.background.alt,
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                  }}
                >
                  {updating ? "Updating..." : "Update customer"}
                </Button>
              </Container>
            </AccordionDetails>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
};

export default UpdateCustomerStatusForm;
