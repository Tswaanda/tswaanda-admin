import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import {
  canisterId,
} from "../../../declarations/tswaanda_frontend/index";

const idlFactory = ({ IDL }) =>
  IDL.Service({
    whoami: IDL.Func([], [IDL.Principal], []),
  });

const authClient = await AuthClient.create({
  idleOptions: {
    idleTimeout: 1000 * 60 * 30, // set to 30 minutes
    disableDefaultIdleCallback: true, // disable the default reload behavior
  },
});

const useAuth = (session, setSession) => {
  const isLoggedIn = async () => await authClient.isAuthenticated();

  const identity = authClient.getIdentity();

  const login = async (successHandler, errorHandler) => {
    const days = BigInt(1);
    const hours = BigInt(24);
    const nanoseconds = BigInt(3600000000000);
    authClient.login({
      onSuccess: async () => {
        successHandler();
        setSession(true);
      },
      onError: async () => {
        errorHandler();
        setSession(false);
      },
      identityProvider: "https://identity.ic0.app/#authorize",
      // identityProvider: "http://localhost:4943?canisterId=b77ix-eeaaa-aaaaa-qaada-cai",
      // Maximum authorization expiration is 8 days
      maxTimeToLive: days * hours * nanoseconds,
    });
  };

  const logout = async () => {
    await authClient.logout();
    setSession(false);
  };

  return {
    isLoggedIn,
    identity,
    login,
    logout,
  };
};

export default useAuth;
