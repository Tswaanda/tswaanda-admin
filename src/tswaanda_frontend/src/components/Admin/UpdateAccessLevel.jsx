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
import { useAuth } from '../../hooks/auth';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const UpdateAccessLevel = ({
  openAccessModal, setAccessModal, setShowAccessForm, theme, member
}) => {

  const { backendActor } = useAuth()

  const [updated, setUpdated] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [accessLevel, setAccessLevel] = useState("")

  const handleAccessModalClose = () => {
    setAccessModal(false);
  }

  const handleUpdateAccessLevel = async () => {
    try {
      setUpdating(true)

      const getRole = () => {
        if (accessLevel === "admin") {
          return { 'admin': null };
        }
        if (accessLevel === "staff") {
          return { 'staff': null };
        }
        if (accessLevel === "authorized") {
          return { 'authorized': null };
        }
      }
      await backendActor.assign_role(member.principal, [getRole()])
      let updatedUser = {
        ...member,
        role: [getRole()],
        approved: true,
        created: BigInt(Date.parse(member.created))
      }
      await backendActor.updateStaffMember(updatedUser)
      setUpdating(false)
      setUpdated(true)
      setAccessModal(false)
      setShowAccessForm(false)

    } catch (error) {
      setUpdating(false)
      console.log(error)
    }
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
        onClose={handleAccessModalClose}
        aria-labelledby="customized-dialog-title"
        open={openAccessModal}
      >
        <DialogTitle sx={{ m: 0, p: 2, backgroundColor: theme.palette.background.alt }} id="customized-dialog-title">
          Update Customer Status
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleAccessModalClose}
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
                    User AccessLevel
                  </InputLabel>
                  <Select
                    labelId="status-label"
                    onChange={(e) => setAccessLevel(e.target.value)}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="staff">General Staff</MenuItem>
                    <MenuItem value="authorized">
                      Authorized
                    </MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  disabled={updating}
                  color="primary"
                  onClick={handleUpdateAccessLevel}
                  sx={{
                    backgroundColor: theme.palette.secondary.light,
                    color: theme.palette.background.alt,
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                  }}
                >
                  {updating ? "Updating..." : "Update Access Level"}
                </Button>
              </Container>
            </AccordionDetails>
          </div>

        </DialogContent>
      </BootstrapDialog>
    </div>
  )
}

export default UpdateAccessLevel