import React, { useMemo, useState, useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import { themeSettings } from "./theme";
import {
  BrowserRouter,
  Navigate,
  Route,
  Router,
  Outlet,
  Routes,
} from "react-router-dom";
import Layout from "./scenes/layout";
import Dashboard from "./scenes/dashboard";
import Products from "./scenes/products";
import Customers from "./scenes/customers";
import Transactions from "./scenes/transactions";
import Geography from "./scenes/geography";
import Overview from "./scenes/overview";
import Daily from "./scenes/daily";
import Monthly from "./scenes/monthly";
import Breakdown from "./scenes/breakdown";
import Admin from "./scenes/admin";
import Performance from "./scenes/performance";
import Login from "./scenes/login";
import { AuthClient } from "@dfinity/auth-client";
import { UserContext } from "./UserContext";
import { useAuth } from "./hooks";
import Wallet from "./scenes/wallet/index";
import Orders from "./scenes/orders/index";
import { initActors } from "./storage-config/functions";
import { useSelector, useDispatch } from 'react-redux'
import { setInit } from "./state/globalSlice";
import { backendActor } from "./config";
import Farmers from "./scenes/farmers/index";
import Storage from "./scenes/storage/index";
import { initializeRepositoryCanister } from "./hanse/interface";
import icblast from "@infu/icblast";
import Documents from "./scenes/documents/index";

function App() {
  const dispatch = useDispatch()
  const { storageInitiated } = useSelector((state) => state.global)

  const [session, setSession] = useState(null);
  const { login, isLoggedIn, identity } = useAuth(session, setSession);
  const [authorized, setAuthorized] = useState(null);

  const getRole = async () => {
    const authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      const identity = await authClient.getIdentity()
      console.log("Your principal id:", identity.getPrincipal().toString())
      try {
        const role = await backendActor.my_role(identity.getPrincipal());
        if (role === "unauthorized") {
          setAuthorized(false);
        } else {
          setAuthorized(true);
        }
        console.log("User role: ", role);
      } catch (error) {
        setAuthorized(false);
        console.log("Error on checking authorization", error);
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (await isLoggedIn()) {
        setSession(true);
      } else {
        setSession(false);
      }
    };
    checkAuth();
  }, [isLoggedIn]);

  useEffect(() => {
    if (session) {
      getRole();
      initializeRepositoryCanister()
    }
  }, [session]);

  const init = async () => {
    const res = await initActors();
    if (res) {
      dispatch(setInit());
    }
  };

  useEffect(() => {
    init();
  }, [])
  const ProtectedRoutes = () => {
    if (session && authorized) {
      return <Outlet />;
    } else if (session === false) {
      return <Navigate to="/login" />;
    } else if (session && authorized === false) {
      return <h3>You are unauthorized</h3>;
    } else if (session === null) {
      return <h3>Loading...</h3>;
    } else if (authorized === null) {
      return <h3>Checking...</h3>;
    }
  };

  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <UserContext.Provider value={{ session, setSession, identity }}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoutes />}>
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/farmers" element={<Farmers />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/geography" element={<Geography />} />
                  <Route path="/overview" element={<Overview />} />
                  <Route path="/daily" element={<Daily />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/monthly" element={<Monthly />} />
                  <Route path="/breakdown" element={<Breakdown />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/performance" element={<Performance />} />
                  <Route path="/storage" element={<Storage />} />
                </Route>
              </Route>
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
