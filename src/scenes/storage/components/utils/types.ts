import { Principal } from "@dfinity/principal";

export interface definite_canister_settings {
    freezing_threshold: bigint;
    controllers: Array<Principal>;
    memory_allocation: bigint;
    compute_allocation: bigint;
  }

export interface CustomStatus {
    status: string|undefined;
    memory_size: number;
    cycles: number;
    settings: definite_canister_settings;
    module_hash: [] | [Uint8Array | number[]];
    memory_allocation: number;
  }