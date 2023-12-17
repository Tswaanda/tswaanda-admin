import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  FC,
} from "react";
import {
  Actor,
  ActorSubclass,
  HttpAgent,
  Identity,
  SignIdentity,
} from "@dfinity/agent";
import { idlFactory as marketIdlFactory } from "../declarations/marketplace_backend";
import { AuthClient } from "@dfinity/auth-client";
import { canisterId as identityCanId } from "../declarations/internet_identity/index";
import {
  canisterId,
  tswaanda_backend,
  idlFactory as tswaanda_backend_idl,
} from "../declarations/tswaanda_backend/index";
import {
  AppMessage,
  _SERVICE as BACKENDSERVICE,
} from "../declarations/tswaanda_backend/tswaanda_backend.did";
import IcWebSocket from "ic-websocket-js";

const marketCanisterId = "55ger-liaaa-aaaal-qb33q-cai";
const localMarketCanId = "by6od-j4aaa-aaaaa-qaadq-cai";

const gatewayUrl = "wss://gateway.icws.io";
const icUrl = "https://icp0.io";

const localhost = "http://localhost:8080";
const host = "https://icp0.io";

interface LayoutProps {
  children: React.ReactNode;
}

const network = process.env.DFX_NETWORK || "local";

const authClient = await AuthClient.create({
  idleOptions: {
    idleTimeout: 1000 * 60 * 30, // set to 30 minutes
    disableDefaultIdleCallback: true, // disable the default reload behavior
  },
});

type Context = {
  accessLevel: string;
  setAccessLevel(args: string): void;
  principleId: string;
  marketActor: any;
  storageInitiated: boolean;
  setStorageInitiated(args: boolean): void;
  identity: any;
  setContextIdentity(arg: any): void;
  backendActor: any;
  isAuthenticated: boolean;
  login(): void;
  logout(): void;
  checkAuth(): void;
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
  },
};

// Context
const ContextWrapper = createContext<Context>(initialContext);

export const useAuth = () => {
  return useContext(ContextWrapper);
};

export const ContextProvider: FC<LayoutProps> = ({ children }) => {
  const [principleId, setPrincipleId] = useState("");
  const [identity, setIdentity] = useState<any>(null);
  const [backendActor, setBackendActor] =
    useState<ActorSubclass | null>(null);
  const [marketActor, setMarketActor] = useState<ActorSubclass | null>(null);
  const [ws, setWs] = useState<IcWebSocket<BACKENDSERVICE, AppMessage> | null>(
    null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [storageInitiated, setStorageInitiated] = useState(false);
  const [accessLevel, setAccessLevel] = useState("");

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
      identityProvider:
        network === "ic"
          ? "https://identity.ic0.app/#authorize"
          : `http://localhost:4943?canisterId=${identityCanId}`,
      maxTimeToLive: days * hours * nanoseconds,
      onSuccess: () => {
        setIsAuthenticated(true);
        // window.location.reload()
        checkAuth();
      },
    });
  };

  const checkAuth = async () => {
    if (await authClient.isAuthenticated()) {
      setIsAuthenticated(true);
      const _identity = authClient.getIdentity();
      setIdentity(_identity);

      let agent = new HttpAgent({
        host: network === "local" ? localhost : host,
        identity: _identity,
      });
      // agent.fetchRootKey();

      // set backend actor
      const _backendActor = Actor.createActor(tswaanda_backend_idl, {
        agent,
        canisterId: canisterId,
      });
      setBackendActor(_backendActor);

      // set market actor
      const _marketActor = Actor.createActor(marketIdlFactory, {
        agent,
        canisterId: marketCanisterId,
      });
      setMarketActor(_marketActor);

      // set websocket client
      const _ws = new IcWebSocket(gatewayUrl, undefined, {
        canisterId: canisterId,
        canisterActor: tswaanda_backend,
        identity: _identity as SignIdentity,
        networkUrl: icUrl,
      });
      setWs(_ws);
    }
  };

  const handleLogout = async () => {
    await authClient.logout();
    setIsAuthenticated(false);
    setContextIdentity(null);
    setContextPrincipleID("");
  };

  const logout = async () => {
    await handleLogout();
    setContextPrincipleID("");
    setContextIdentity(null);
  };

  return (
    <ContextWrapper.Provider
      value={{
        accessLevel,
        setAccessLevel,
        principleId,
        marketActor,
        storageInitiated,
        setStorageInitiated,
        identity,
        setContextIdentity,
        backendActor,
        isAuthenticated,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </ContextWrapper.Provider>
  );
};
