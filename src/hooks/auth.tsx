import React, { useContext, useState, useEffect, createContext } from "react";
import { Actor, HttpAgent } from "@dfinity/agent"
import { idlFactory as marketIdlFactory } from "../declarations/marketplace_backend";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId as identityCanId } from "../declarations/internet_identity/index";
import { canisterId, idlFactory } from "../declarations/tswaanda_backend/index";

const marketCanisterId = "55ger-liaaa-aaaal-qb33q-cai";
const localMarketCanId = "by6od-j4aaa-aaaaa-qaadq-cai";

const network = process.env.DFX_NETWORK || "local";

const authClient = await AuthClient.create({
  idleOptions: {
    idleTimeout: 1000 * 60 * 30, // set to 30 minutes
    disableDefaultIdleCallback: true, // disable the default reload behavior
  },
})

type Context = {
  accessLevel: string,
  setAccessLevel (args: string): void,
  principleId : string,
  marketActor : any,
  storageInitiated : boolean,
  setStorageInitiated (args: boolean): void,
  setContextPrincipleID (arg: string): void,
  identity : any,
  setContextIdentity (arg: any): void,
  backendActor : any,
  isAuthenticated : boolean,
  login (): void,
  logout (): void,
  checkAuth (): void,
};

const initialContext: Context = {
  accessLevel: "",
  setAccessLevel: (string): void => {
    throw new Error("setContext function must be overridden");
  },
  principleId: "",
  marketActor: null,
  storageInitiated: false,
  setStorageInitiated: (boolean): void => {
    throw new Error("setContext function must be overridden");
  },
  setContextPrincipleID: (string): void => {
    throw new Error("setContext function must be overridden");
  },
  identity: null,
  setContextIdentity: (any): void => {
    throw new Error("setContext function must be overridden");
  },
  backendActor: null,
  isAuthenticated: false,
  login: (): void => {
    throw new Error("login function must be overridden");
  },
  logout: (): void => {
    throw new Error("logout function must be overridden");
  },
  checkAuth: (): void => {
    throw new Error("checkAuth function must be overridden");
  }
};


// Context
const ContextWrapper =  createContext<Context>(initialContext);

export const useAuth = () => {
  return useContext(ContextWrapper);
};

export const ContextProvider = ({ children }) => {
  const [principleId, setPrincipleId] = useState("");
  const [identity, setIdentity] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [storageInitiated, setStorageInitiated] = useState(false)
  const [accessLevel, setAccessLevel] = useState("")

  useEffect(() => {
    setPrincipleId(localStorage.getItem("principleId") || "");
  }, []);

  const setContextPrincipleID = (_value: any) => {
    setPrincipleId(_value);
  };

  const setContextIdentity = (_value: any) => {
    setIdentity(_value);
  };

  const login = async () => {
    const days = BigInt(1);
    const hours = BigInt(24);
    const nanoseconds = BigInt(3600000000000);
    await authClient.login({
      identityProvider: network === "ic" ? "https://identity.ic0.app/#authorize" : `http://localhost:4943?canisterId=${identityCanId}`,
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
      console.log("Authenticated")
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

  const localhost = "http://localhost:8080";
  const host = "https://icp0.io";

  let agent = new HttpAgent({
    host: network === "local" ? localhost : host,
    identity: identity
  })
  agent.fetchRootKey()


  const backendActor = Actor.createActor(idlFactory, {
    agent,
    canisterId: canisterId,
  });


  const marketActor = Actor.createActor(marketIdlFactory, {
    agent: agent,
    canisterId: network === "local" ? localMarketCanId : marketCanisterId,
  });

  return (
    <ContextWrapper.Provider value={{
      accessLevel,
      setAccessLevel,
      principleId,
      marketActor,
      storageInitiated,
      setStorageInitiated,
      setContextPrincipleID,
      identity,
      setContextIdentity,
      backendActor,
      isAuthenticated,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </ContextWrapper.Provider>
  );
};
