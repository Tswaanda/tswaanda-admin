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
import Wallet from "./scenes/wallet/index";
import Orders from "./scenes/orders/index";
import { initActors } from "./storage-config/functions";
import { useSelector, useDispatch } from 'react-redux'
import { setInit } from "./state/globalSlice";
import Farmers from "./scenes/farmers/index";
import Storage from "./scenes/storage/index";
import { initializeRepositoryCanister } from "./hanse/interface";
import Documents from "./scenes/documents/index";
import Support from "./scenes/support/index";
import { useAuth } from "./hooks/auth";

function App() {
  const dispatch = useDispatch()

  const { isAuthenticated, identity, checkAuth, backendActor } = useAuth()
  const [authorized, setAuthorized] = useState(false);

  const getRole = async () => {
    console.log("Your principal id:", identity.getPrincipal().toString())
    try {
      const role = await backendActor.my_role();
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

  useEffect(() => {
    if (isAuthenticated) {
      getRole();
      initializeRepositoryCanister()
    }
  }, [isAuthenticated]);

  const init = async () => {
    const res = await initActors();
    if (res) {
      dispatch(setInit());
    }
  };

  useEffect(() => {
    init();
    checkAuth()
  }, [])
  const ProtectedRoutes = () => {
    if (isAuthenticated && authorized) {
      return <Outlet />;
    } else if (!isAuthenticated) {
      return <Navigate to="/login" />;
    } else if (isAuthenticated && authorized === false) {
      return <h3>You are unauthorized</h3>;
    }
  };

  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
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
                <Route path="/support" element={<Support />} />
                <Route path="/performance" element={<Performance />} />
                <Route path="/storage" element={<Storage />} />
              </Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
