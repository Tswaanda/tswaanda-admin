import React, { useEffect, useState } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  TextField,
  useTheme,
  Button,
} from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useAuth } from '../hooks/auth';

const Unauthorized = ({ user }) => {
  const { backendActor, identity, logout } = useAuth()

  const theme = useTheme()
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [emailError, setEmailError] = useState("")

  const schema = z.object({
    fullName: z
      .string()
      .min(3, { message: "Full name must be 3 or more characters long" })
      .max(100, { message: "Full must be less than 40 characters long" }),
    phone: z
      .string()
      .min(10, { message: "Phone number must be 10 or more characters long" })
      .max(13, { message: "Phone number must be 13 or more characters long" }),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const handleSave = async (data) => {
    if (email === "") {
      setEmailError("Please enter your email address")
    } else if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Please enter a valid email address")
    } else if (!email.endsWith("tswaanda.com")) {
      setEmailError("Not a valid Tswaanda email address")
    } else {
      setSubmitting(true)
      const member = {
        fullName: data.fullName,
        email: email,
        phone: data.phone,
        role: [],
        approved: false,
        principal: identity.getPrincipal(),
        suspended: false,
        created: BigInt(Date.now()),
      }
      await backendActor.addStaffMember(member)
      toast.success(
        `Thank you! We will notify you shortly when your have been granted access`,
        {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        }
      );
      setSubmitting(false)
      setTimeout(() => {
        logout()
        window.location.reload()
      }, 10000)
    }

  }

  return (
    <DialogContent dividers sx={{ backgroundColor: theme.palette.background.alt, minWidth: '600px' }}>
      <div className="" style={{ minWidth: '500px' }}>
        {user ? <div style={{ height: '100vh' }}>
          <h2 style={{ marginTop: '150px' }}>
            Welcome {user.ok.fullName}! Your account is currently being reviewed. You will be notified when you have been granted access.
          </h2>
        </div>
          : <form onSubmit={handleSubmit(handleSave)}>
            <AccordionDetails>
              <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
                <DialogTitle
                  sx={{
                    fontSize: "20px",
                    color: "white",
                  }}
                >
                  For Tswaanda Staff. Please fill the form below.
                </DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Full Name"
                    type="text"
                    fullWidth
                    {...register("fullName")}
                  />
                  {errors.fullName && (
                    <span style={{ color: "#EF9A9A" }}>
                      {errors.fullName.message}
                    </span>
                  )}
                  <TextField
                    margin="dense"
                    label="Email Address"
                    type="text"
                    fullWidth
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setEmailError("")
                    }}

                  />
                  {emailError !== "" && (
                    <span style={{ color: "#EF9A9A" }}>{emailError}</span>
                  )}
                  <TextField
                    margin="dense"
                    label="Phone number"
                    type="number"
                    fullWidth
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <span style={{ color: "#EF9A9A" }}>{errors.phone.message}</span>
                  )}
                </DialogContent>
                <DialogActions>

                  <Button
                    variant="contained"
                    disabled={submitting}
                    type="submit"
                    color="primary"
                    sx={{
                      backgroundColor: theme.palette.secondary.light,
                      color: theme.palette.background.alt,
                      fontSize: "14px",
                      fontWeight: "bold",
                      padding: "10px 20px",
                    }}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </Button>
                </DialogActions>
              </Container>
            </AccordionDetails>
          </form>}

      </div>

    </DialogContent>
  )
}

export default Unauthorized