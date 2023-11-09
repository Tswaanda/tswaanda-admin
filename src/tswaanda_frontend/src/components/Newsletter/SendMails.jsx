import React, { useEffect, useState } from 'react';
import {
    Box,
    useTheme,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
} from "@mui/material";
import Header from "../../components/Header";
import { useAuth } from '../../hooks/auth';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { sendNewsLetterEmail } from '../../emails/Newsletter';
import { toast } from 'react-toastify';

export const Recipients = [
    {
        name: "Clients",
    },
    {
        name: "Farmers",
    },
    {
        name: "Employees",
    }
];

const SendEmails = ({ clients }) => {

    const { backendActor } = useAuth()
    const [farmers, setFarmers] = useState([])
    const [employees, setEmployees] = useState([])

    const theme = useTheme();
    const [recipient, setRecipient] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [confirmSend, setConfirmSend] = useState(false);
    const [count, setCount] = useState(0);

    useEffect(() => {
        getFarmers()
        getEmployees()
    }, [])

    const getFarmers = async () => {
        const res = await backendActor.getAllFarmers()
        setFarmers(res)
    }
    const getEmployees = async () => {
        const res = await backendActor.getAllStaffMembers()
        setEmployees(res)
    }


    const handleSend = () => {
        if (recipient === "" || subject === "" || message === "") {
            alert("Please fill all fields")
        }
        setSending(true)


        try {
            if (recipient === "Clients") {
                setCount(clients.length)
                for (let client of clients) {
                    sendNewsLetterEmail(subject, client.email, message)
                    setCount((prev) => prev - 1)
                }
                toast.success(`
                Email successfuly sent to all ${clients.length} clients
                `, {
                    autoClose: 5000,
                    position: "top-center",
                    hideProgressBar: true,
                });
            } else if (recipient === "Farmers") {
                setCount(farmers.length)
                for (let farmer of farmers) {
                    sendNewsLetterEmail(subject, farmer.email, message)
                    setCount((prev) => prev - 1)
                }
                toast.success(`
                Email successfuly sent to all ${farmers.length} farmers
                `, {
                    autoClose: 5000,
                    position: "top-center",
                    hideProgressBar: true,
                });
            } else if (recipient === "Employees") {
                setCount(employees.length)
                for (let employee of employees) {
                    sendNewsLetterEmail(subject, employee.email, message)
                    setCount((prev) => prev - 1)
                }
                toast.success(`
                Email successfuly sent to all ${employees.length} employees
                `, {
                    autoClose: 5000,
                    position: "top-center",
                    hideProgressBar: true,
                });
            }
            setSending(false)
            setConfirmSend(false)
        } catch (error) {
            console.log("Error sending emails", error)
        }

    }

    console.log(clients)

    return (
        <div>
            <Box m="">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Header title="" subtitle="Send Emails " />
                </Box>
                <Box
                    mt="40px"
                    height="75vh"
                    border={`1px solid ${theme.palette.secondary[200]}`}
                    borderRadius="4px"
                >
                    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "100%", gap: '20px', marginTop: "20px" }}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <FormControl sx={{ width: '50%' }} margin="dense">
                                <InputLabel id="recipient-type">Recipient</InputLabel>
                                <Select
                                    labelId="recipient-type"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                >
                                    {Recipients.map((type, index) => (
                                        <MenuItem key={index} value={type.name}>
                                            {type.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Subject"
                                type="text"
                                sx={{ width: '50%' }}
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Message"
                                sx={{ width: '50%' }}
                                multiline
                                rows={10}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <Button
                                onClick={() => setConfirmSend(true)}
                                variant="contained"
                                color="success"
                                sx={{
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    padding: "10px 20px",
                                    width: "20%"
                                }}
                            >
                                Send Email
                            </Button>
                        </div>
                        <Dialog
                            open={confirmSend}
                            onClose={() => setConfirmSend(false)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"

                        >
                            <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }} id="alert-dialog-title">
                                You are about to send this email to all the {recipient}! Are you sure?
                            </DialogTitle>
                            <DialogActions sx={{ backgroundColor: theme.palette.background.alt }}>
                                {!sending && <Button style={{ color: "white" }} onClick={() => setConfirmSend(false)}>Cancel</Button>}
                                <Button style={{ color: "white" }} onClick={handleSend} autoFocus>
                                    {sending && `Sending emails... ${count}`}
                                    {!sending && "Yes I'm sure"}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Box>
            </Box>
        </div>

    )
}

export default SendEmails