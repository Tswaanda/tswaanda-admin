
import React, {
  useContext,
  useState,
  createContext,
  FC,
} from "react";
import {
  Actor,
  ActorSubclass,
  HttpAgent,
  Identity,
} from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId as identityCanId } from "../declarations/internet_identity/index";
import { idlFactory as marketIdlFactory } from "../declarations/marketplace_backend";
import {
  canisterId,
  tswaanda_backend,
  idlFactory as tswaandaIdl,
} from "../declarations/tswaanda_backend/index";
import IcWebSocket from "ic-websocket-js";

const marketCanisterId = "55ger-liaaa-aaaal-qb33q-cai";
const localMarketCanId = "by6od-j4aaa-aaaaa-qaadq-cai";

const gatewayUrl = "wss://gateway.icws.io";
const icUrl = "https://icp0.io";

const localhost = "http://localhost:3000";
const host = "https://icp0.io";
const network = process.env.DFX_NETWORK || "local";

interface LayoutProps {
  children: React.ReactNode;
}

const authClient = await AuthClient.create({
  idleOptions: {
    idleTimeout: 1000 * 60 * 30, // set to 30 minutes
    disableDefaultIdleCallback: true, // disable the default reload behavior
  },
});

type Context = {
  accessLevel: string;
  marketActor: any;
  storageInitiated: boolean;
  identity: any;
  backendActor: any;
  isAuthenticated: boolean;
  setStorageInitiated(args: boolean): void;
  setAccessLevel(args: string): void;
  login(): void;
  logout(): void;
  checkAuth(): void;
};

const initialContext: Context = {
  identity: null,
  backendActor: null,
  isAuthenticated: false,
  storageInitiated: false,
  accessLevel: "",
  marketActor: null,
  setStorageInitiated: (): void => {
    throw new Error("setStorageInitiated function must be overridden");
  },
  setAccessLevel: (): void => {
    throw new Error("setAccessLevel function must be overridden");
  },
  login: (): void => {
    throw new Error("login function must be overridden");
  },
  logout: (): void => {
    throw new Error("logout function must be overridden");
  },
  checkAuth: (): void => {
    throw new Error("checkAuth function must be overridden");
  },
};

const ContextWrapper = createContext<Context>(initialContext);

export const useAuth = () => {
  return useContext(ContextWrapper);
};

export const ContextProvider: FC<LayoutProps> = ({ children }) => {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [backendActor, setBackendActor] = useState<ActorSubclass | null>(null);
  const [marketActor, setMarketActor] = useState<ActorSubclass | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [storageInitiated, setStorageInitiated] = useState(false);
  const [accessLevel, setAccessLevel] = useState("");

  const login = async () => {
    const days = BigInt(1);
    const hours = BigInt(24);
    const nanoseconds = BigInt(3600000000000);
    await authClient.login({
      identityProvider:
        network === "ic"
          ? "https://identity.ic0.app/#authorize"
          : `http://localhost:4943?canisterId=${identityCanId}`,
      maxTimeToLive: days * hours * nanoseconds,
      onSuccess: () => {
        setIsAuthenticated(true);
        checkAuth();
      },
      onError: (err) => alert(err),
    });
  };

  const checkAuth = async () => {
    if (await authClient.isAuthenticated()) {
      setIsAuthenticated(true);
      const _identity = authClient.getIdentity();
      console.log("identity", _identity);
      setIdentity(_identity);

      let agent = new HttpAgent({
        host: network === "local" ? localhost : host,
        identity: _identity,
      });

      if (network === "local") {
        agent.fetchRootKey();
      }

      const _backendActor = Actor.createActor(tswaandaIdl, {
        agent,
        canisterId: canisterId,
      });
      setBackendActor(_backendActor);

      const _marketActor = Actor.createActor(marketIdlFactory, {
        agent,
        canisterId: network === "local" ? localMarketCanId : marketCanisterId,
      });
      setMarketActor(_marketActor);
    }
  };

  const logout = async () => {
    await authClient.logout();
    setIsAuthenticated(false);
  };


  return (
    <ContextWrapper.Provider
      value={{
        identity,
        backendActor,
        isAuthenticated,
        marketActor,
        storageInitiated,
        accessLevel,
        setStorageInitiated,
        setAccessLevel,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </ContextWrapper.Provider>
  );
};
