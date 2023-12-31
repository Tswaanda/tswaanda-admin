import {
  Actor,
  ActorSubclass,
  HttpAgent,
  Identity,
  SignIdentity,
} from "@dfinity/agent";
import { idlFactory as marketIdlFactory } from "../declarations/marketplace_backend";
import {
  canisterId,
  tswaanda_backend,
  idlFactory as tswaandaIdl,
} from "../declarations/tswaanda_backend/index";
import IcWebSocket from "ic-websocket-js";
import {
  AppMessage,
  _SERVICE,
} from "../declarations/tswaanda_backend/tswaanda_backend.did";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  FC,
} from "react";
import {
  AuthClient,
  AuthClientCreateOptions,
  AuthClientLoginOptions,
} from "@dfinity/auth-client";
import { canisterId as iiCanId } from "../declarations/internet_identity";
// @ts-ignore
import icblast from "@infu/icblast";

const marketCanisterId = "55ger-liaaa-aaaal-qb33q-cai";
const localMarketCanId = "a3shf-5eaaa-aaaaa-qaafa-cai";

const gatewayUrl = "wss://gateway.icws.io";
const icUrl = "https://icp0.io";
const localGatewayUrl = "ws://127.0.0.1:8080";
const localICUrl = "http://127.0.0.1:4943";
const localhost = "http://localhost:3000";
const host = "https://icp0.io";
const network = process.env.DFX_NETWORK || "local";

interface ContextType {
  accessLevel: string;
  marketActor: any;
  storageInitiated: boolean;
  identity: any;
  backendActor: any;
  isAuthenticated: boolean;
  ws: any;
  setStorageInitiated(args: boolean): void;
  setAccessLevel(args: string): void;
  login(): void;
  logout(): void;
}

const initialContext: ContextType = {
  identity: null,
  backendActor: null,
  isAuthenticated: false,
  storageInitiated: false,
  accessLevel: "",
  marketActor: null,
  ws: null,
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
};

const AuthContext = createContext<ContextType>(initialContext);

interface DefaultOptions {
  createOptions: AuthClientCreateOptions;
  loginOptions: AuthClientLoginOptions;
}

const defaultOptions: DefaultOptions = {
  createOptions: {
    idleOptions: {
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider:
      process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app/#authorize"
        : `http://localhost:4943?canisterId=${iiCanId}`,
  },
};

export const useAuthClient = (options = defaultOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [backendActor, setBackendActor] = useState<ActorSubclass | null>(null);
  const [marketActor, setMarketActor] = useState<ActorSubclass | null>(null);
  const [ws, setWs] = useState<IcWebSocket<_SERVICE, AppMessage> | null>(null);
  const [storageInitiated, setStorageInitiated] = useState(false);
  const [accessLevel, setAccessLevel] = useState("");

  useEffect(() => {
    AuthClient.create(options.createOptions).then(async (client) => {
      updateClient(client);
    });
  }, []);

  const login = () => {
    authClient?.login({
      ...options.loginOptions,
      onSuccess: () => {
        updateClient(authClient);
      },
    });
  };

  async function updateClient(client: AuthClient) {
    setAuthClient(client);
    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);

    const identity = client.getIdentity();
    setIdentity(identity);

    let agent = new HttpAgent({
      host: network === "local" ? localhost : host,
      identity: identity,
    });

    let ic = icblast({
      local: network === "local" ? true : false,
      identity: identity,
    });

    if (network === "local") {
      agent.fetchRootKey();
    }

    const _backendActor = Actor.createActor(tswaandaIdl, {
      agent,
      canisterId: canisterId,
    });
    setBackendActor(_backendActor);

    let _marketActor = await ic(network === "local" ? localMarketCanId : marketCanisterId);

    setMarketActor(_marketActor);

    const _ws = new IcWebSocket(
      network === "local" ? localGatewayUrl : gatewayUrl,
      undefined,
      {
        canisterId: canisterId,
        canisterActor: tswaanda_backend,
        identity: identity as SignIdentity,
        networkUrl: network === "local" ? localICUrl : icUrl,
      }
    );
    setWs(_ws);
  }

  // Websocket connection
  useEffect(() => {
    if (!ws) {
      return;
    }
    ws.onopen = () => {
      console.log("Connected to the canister");
    };
    ws.onclose = () => {
      console.log("Disconnected from the canister");
    };
    ws.onerror = (error: any) => {
      console.log("Error:", error);
    };
  }, [ws]);

  async function logout() {
    await authClient?.logout();
    if (authClient) {
      updateClient(authClient);
    }
  }

  return {
    identity,
    backendActor,
    isAuthenticated,
    marketActor,
    storageInitiated,
    accessLevel,
    ws,
    setStorageInitiated,
    setAccessLevel,
    login,
    logout,
  };
};

interface LayoutProps {
  children: React.ReactNode;
}

export const AuthProvider: FC<LayoutProps> = ({ children }) => {
  const auth = useAuthClient();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
