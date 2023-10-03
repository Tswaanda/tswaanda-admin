import React, { useContext, useState, useCallback } from "react";
import { UserContext } from "../../UserContext";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Divider from '@mui/material/Divider';

import {
    Alert,
    Box,
    Button,
    Link,
    Stack,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";

import { useAuth } from "../../hooks";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const { session, setSession } = useContext(UserContext);
    const { login, logout } = useAuth(session, setSession);
    const [method, setMethod] = useState('auth');


    const handleMethodChange = useCallback(
        (event, value) => {
        setMethod(value);
        },
        []
    );

    return (
        <div>
        <Box
            sx={{
            backgroundColor: "",
            flex: "1 1 auto",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            }}
        >
            <Box
            sx={{
                maxWidth: 550,
                px: 3,
                py: "100px",
                width: "100%",
            }}
            >
            <div>
            <Stack 
                direction="row" 
                spacing={2} justifyContent="center" 
                alignItems="center"
                divider={<Divider orientation="vertical" flexItem />}
                sx={{ marginBottom: '50px' }}
            > 
                <AdminPanelSettingsIcon sx={{ fontSize: 60, color: '#dda15f' }} />
                <Typography
                    variant="h1"
                    style={{ fontSize: 50, fontWeight: 'bold', 
                    textDecoration: 'underline', textDecorationColor: '#dda15f'
                }}
                >
                    Tswaanda
                </Typography>
            </Stack>
                <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontSize: 30, fontWeight: "bold"}}>Login</Typography>
                <Typography color="text.primary" variant="body2">
                    Admin access only. Not admin? {' '}
                    <Link
                    href="/"
                    underline="hover"
                    variant="subtitle2"
                    >
                    Marketplace
                    </Link>
                </Typography>
                </Stack>
                <Tabs 
                    onChange={handleMethodChange} 
                    sx={{ mb: 3 }} 
                    value={method}
                    textColor="secondary"
                    indicatorColor="secondary"
                >
                <Tab label="Tswaanda Auth" value="auth" />
                <Tab label="Email" value="email" />
                </Tabs>
                {method === "auth" && (
                <form noValidate>
                    <Button
                    fullWidth
                    size="large"
                    sx={{ mt: 3 }}
                    onClick={() => login(
                        () => navigate("/dashboard"),
                        () => console.log('Error')
                    )}
                    variant="contained"
                    >
                    Sign in
                    </Button>
                    
                    <Alert color="primary" severity="info" sx={{ mt: 3 }}>
                    <div>
                        Tswaanda uses <b>dfinity auth</b> for authentication{" "}
                    </div>
                    </Alert>
                </form>
                )}
                {method === "email" && (
                <div>
                    <Typography sx={{ mb: 1 }} variant="h6">
                    Not available at the moment
                    </Typography>
                    <Typography color="text.secondary">
                    Just backup, just incase Tswaanda Auth is not working.
                    </Typography>
                </div>
                )}
            </div>
            </Box>
        </Box>
        </div>
    );
};

export default Login;
