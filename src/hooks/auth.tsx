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
import {idlFactory as walletIdl} from "../walletIDL/index"
import IcWebSocket from "ic-websocket-js";
import {
  AppMessage,
  _SERVICE as _BACKENDSERVICE,
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
import { _SERVICE as _MKTSERVICE } from "../declarations/marketplace_backend/marketplace_backend.did";
import { _SERVICE as _WALLETSERVICE } from "../walletIDL/wallet.did";

const marketLiveCanisterId = "55ger-liaaa-aaaal-qb33q-cai";
const walletCanisterId = "qg5ne-wqaaa-aaaam-ab47a-cai";

const gatewayUrl = "wss://gateway.icws.io";
const icUrl = "https://icp0.io";
const localGatewayUrl = "ws://127.0.0.1:8080";
const localICUrl = "http://127.0.0.1:4943";
const localhost = "http://localhost:3000";
const host = "https://icp0.io";
const network = process.env.DFX_NETWORK || "local";

interface ContextType {
  accessLevel: string;
  marketActor: ActorSubclass<_MKTSERVICE> | null;
  walletActor: ActorSubclass<_WALLETSERVICE> | null;
  storageInitiated: boolean;
  identity: any;
  backendActor: ActorSubclass<_BACKENDSERVICE> | null
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
  walletActor: null,
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
  const [backendActor, setBackendActor] = useState<ActorSubclass<_BACKENDSERVICE> | null>(null);
  const [marketActor, setMarketActor] = useState<ActorSubclass<_MKTSERVICE> | null>(null);
  const [walletActor, setWalletActor] = useState<ActorSubclass<_WALLETSERVICE> | null>(null);

  const [ws, setWs] = useState<IcWebSocket<_BACKENDSERVICE, AppMessage> | null>(null);
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

    if (network === "local") {
      agent.fetchRootKey();
    }

    const _backendActor: ActorSubclass<_BACKENDSERVICE> = Actor.createActor(tswaandaIdl, {
      agent,
      canisterId: backendCanId,
    });
    setBackendActor(_backendActor);

    const _walletActor: ActorSubclass<_WALLETSERVICE> = Actor.createActor(walletIdl, {
      agent,
      canisterId: walletCanisterId,
    });

    setWalletActor(_walletActor);

    let _marketActor: ActorSubclass<_MKTSERVICE> = Actor.createActor(marketIdlFactory, {
      agent: agent,
      canisterId: network === "local" ? marketLocalId : marketLiveCanisterId,
    });

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
      setUpdateNotifications(true);
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
    walletActor,
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
