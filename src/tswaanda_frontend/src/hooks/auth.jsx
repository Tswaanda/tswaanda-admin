import React, { useContext, useState, useEffect, createContext } from "react";
import { Actor, HttpAgent } from "@dfinity/agent"
import { idlFactory as marketIdlFactory } from "../../../declarations/marketplace_backend";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId, idlFactory } from "../../../declarations/tswaanda_backend/index";

const authClient = await AuthClient.create({
  idleOptions: {
    idleTimeout: 1000 * 60 * 30, // set to 30 minutes
    disableDefaultIdleCallback: true, // disable the default reload behavior
  },
})


// Context
const ContextWrapper = createContext();

export const useAuth = () => {
  return useContext(ContextWrapper);
};

export const ContextProvider = ({ children }) => {
  const [principleId, setPrincipleId] = useState("");
  const [identity, setIdentity] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [storageInitiated, setStorageInitiated] = useState(false)

  useEffect(() => {
    setPrincipleId(localStorage.getItem("principleId") || "");
  }, []);

  const setContextPrincipleID = (_value) => {
    localStorage.setItem("principleId", _value);
    setPrincipleId(_value);
  };

  const setContextIdentity = (_value) => {
    setIdentity(_value);
  };

  const login = async () => {
    const days = BigInt(1);
    const hours = BigInt(24);
    const nanoseconds = BigInt(3600000000000);
    await authClient.login({
      // identityProvider: "https://identity.ic0.app/#authorize",
      identityProvider: "http://localhost:4943?canisterId=be2us-64aaa-aaaaa-qaabq-cai",
      maxTimeToLive: days * hours * nanoseconds,
      onSuccess: () => {
        setIsAuthenticated(true)
        // window.location.reload()
        checkAuth()
      }
    })
  }

  const checkAuth = async () => {
    if (await authClient.isAuthenticated()) {
      setIsAuthenticated(true)
      const identity = authClient.getIdentity()
      setContextIdentity(identity)
      setContextPrincipleID(identity.getPrincipal().toText())
    }
  }

  const handleLogout = async () => {
    await authClient.logout()
    setIsAuthenticated(false)
    setContextIdentity(null)
    setContextPrincipleID("")
  }

  const logout = async () => {
    await handleLogout()
    setContextPrincipleID("")
    setContextIdentity(null)
  }

  const host = "http://localhost:8080";
  // const host = "https://icp0.io";

  let agent = new HttpAgent({
    host: host,
    identity: identity
  })
  agent.fetchRootKey()

const marketCanisterId = "55ger-liaaa-aaaal-qb33q-cai";

const backendActor = Actor.createActor(idlFactory, {
  agent,
  canisterId: canisterId,
});

let marketAgent = new HttpAgent({
  host: host,
})

const marketActor = Actor.createActor(marketIdlFactory, {
  marketAgent,
  canisterId: marketCanisterId,
});

  return (
    <ContextWrapper.Provider value={{ principleId, marketActor, storageInitiated, setStorageInitiated, setContextPrincipleID, identity, setContextIdentity, backendActor, isAuthenticated, login, logout, checkAuth }}>
      {children}
    </ContextWrapper.Provider>
  );
};
