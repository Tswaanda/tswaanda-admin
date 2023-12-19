import { Actor, HttpAgent } from "@dfinity/agent";
import {
  canisterId,
  idlFactory,
} from "./declarations/tswaanda_backend";
// @ts-ignore
import icblast from "@infu/icblast";
import { idlFactory as marketIdlFactory } from "./declarations/marketplace_backend";
import { AuthClient } from "@dfinity/auth-client";

const authClient = await AuthClient.create();

const network = process.env.DFX_NETWORK || "local";


const marketCanisterId = "55ger-liaaa-aaaal-qb33q-cai";

const identity = authClient.getIdentity()
let ic = icblast({
  local: false
  , identity: identity
});

export const canister = await ic("55ger-liaaa-aaaal-qb33q-cai");

const localhost = "http://localhost:4943";
const localagent = new HttpAgent({ host: localhost });
localagent.fetchRootKey();


const host = "https://icp0.io";
const agent = new HttpAgent({ host: host });

export const backendActor = Actor.createActor(idlFactory, {
  agent: network === "local" ? localagent : agent,
  canisterId: canisterId,
});

export const marketActor = Actor.createActor(marketIdlFactory, {
  agent,
  canisterId: marketCanisterId,
});
