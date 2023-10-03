import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
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
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AccordionDetails from "@mui/material/AccordionDetails";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const UpdateCustomerStatusForm = ({
  customer,
   openStatusModal, setStatusModal, 
  setCustomerStatus,
  updateCustomerStatus,
  updating,
  theme,
  setUpdated,
  updated,
}) => {

  const handleStatusModalClose = () => {
    setStatusModal(false);
  }

  useEffect(() => {
    if (updated) {
      setStatusModal(false)
      setUpdated(false)
    }
  }, [updated])

  return (
    <div>
      <BootstrapDialog
        onClose={handleStatusModalClose}
        aria-labelledby="customized-dialog-title"
        open={openStatusModal}
      >
        <DialogTitle sx={{ m: 0, p: 2, backgroundColor: theme.palette.background.alt }} id="customized-dialog-title">
          Update Customer Status
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleStatusModalClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: "white",
            backgroundColor: theme.palette.background.alt
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers sx={{ backgroundColor: theme.palette.background.alt, minWidth: '600px' }}>
          <div className="" style={{ minWidth: '500px' }}>
            <AccordionDetails>
              <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="status-label">
                    Customer status
                  </InputLabel>
                  <Select
                    labelId="status-label"
                    onChange={(e) => setCustomerStatus(e.target.value)}
                  >
                    <MenuItem value="pending">
                      Pending Approval
                    </MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  disabled={updating}
                  color="primary"
                  onClick={() => updateCustomerStatus(customer.id)}
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
  )
}

export default UpdateCustomerStatusForm