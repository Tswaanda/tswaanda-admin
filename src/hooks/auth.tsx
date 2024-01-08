import {
  Actor,
  ActorSubclass,
  HttpAgent,
  Identity,
  SignIdentity,
} from "@dfinity/agent";
import {
  canisterId as marketLocalId,
  idlFactory as marketIdlFactory,
} from "../declarations/marketplace_backend";
import {
  canisterId as backendCanId,
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
import { handleWebSocketMessage } from "../service/main.js";
import { processWsMessage } from "./utils";

const marketCanisterId = "55ger-liaaa-aaaal-qb33q-cai";
const localMarketCanId = "avqkn-guaaa-aaaaa-qaaea-cai";

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
  updateNotifications: boolean;
  ws: any;
  wsMessage: any;
  setUpdateNotifications: (args: boolean) => void;
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
  updateNotifications: false,
  accessLevel: "",
  marketActor: null,
  ws: null,
  wsMessage: null,
  setStorageInitiated: (): void => {},
  setAccessLevel: (): void => {},
  login: (): void => {},
  logout: (): void => {},
  setUpdateNotifications: (): void => {}
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
  const [wsMessage, setWsMessage] = useState(null);
  const [updateNotifications, setUpdateNotifications] = useState(false);

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
      canisterId: backendCanId,
    });
    setBackendActor(_backendActor);

    let _marketActor = await ic(
      network === "local" ? marketLocalId : marketCanisterId
    );

    setMarketActor(_marketActor);

    const _ws = new IcWebSocket(
      network === "local" ? localGatewayUrl : gatewayUrl,
      undefined,
      {
        canisterId: backendCanId,
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
      const msg: AppMessage = {
        AdminConnected: null,
      };
      ws.send(msg);
    };
    ws.onclose = () => {
      console.log("Disconnected from the canister");
    };
    ws.onerror = (error: any) => {
      console.log("Error:", error);
    };
    ws.onmessage = async (event: any) => {
      let res = processWsMessage(event.data);
      await handleWebSocketMessage(res);
      const recievedMessage = event.data;
      console.log("Message recieved:", recievedMessage);
      setWsMessage(recievedMessage);
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
    updateNotifications,
    setUpdateNotifications,
    setStorageInitiated,
    setAccessLevel,
    login,
    logout,
    wsMessage,
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
