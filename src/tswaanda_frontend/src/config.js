import { Actor, HttpAgent } from "@dfinity/agent";
import {
  canisterId,
  idlFactory,
} from "../../declarations/tswaanda_backend/index";
import icblast from "@infu/icblast";
import { idlFactory as marketIdlFactory } from "../../declarations/marketplace_backend";

let ic = icblast({ local: false });

export const canister = await ic("55ger-liaaa-aaaal-qb33q-cai");

const host = "https://icp0.io";
const agent = new HttpAgent({ host: host });

const marketCanisterId = "55ger-liaaa-aaaal-qb33q-cai";

export const backendActor = Actor.createActor(idlFactory, {
  agent,
  canisterId: canisterId,
});

export const marketActor = Actor.createActor(marketIdlFactory, {
  agent,
  canisterId: marketCanisterId,
});
