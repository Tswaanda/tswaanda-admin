import React, { useState } from 'react';
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



export const Recipients = [
    {
        name: "Clients",
        email: "buyers@tswaanda.com",
    },
    {
        name: "Farmers",
        email: "farmers@tswaanda.com",
    },
    {
        name: "Employees",
        email: "employees@tswaanda.com"
    }
];


const Newsletter = () => {

    const theme = useTheme();
    const [recipient,setRecipient] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    return (
        <div>
            <Box m="1.5rem 2.5rem">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Header title="Newsletter" subtitle="Newsletter Sections" />
                </Box>
                <Box 
                    mt="40px"
                    height="75vh"
                    border={`1px solid ${theme.palette.secondary[200]}`}
                    borderRadius="4px"
                >
                    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "100%", gap: '20px', marginTop: "20px"}}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <FormControl  sx={{ width: '50%' }}  margin="dense">
                                <InputLabel id="recipient-type">Recipient</InputLabel>
                                <Select
                                    labelId="recipient-type"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                >
                                    {Recipients.map((type, index) => (
                                        <MenuItem key={index} value={type.email}>
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
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <Button
                                type="submit"
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
                    </div>
                </Box>
            </Box>
        </div>
        
    )
}

export default Newsletter