import { Principal } from "@dfinity/principal";
import { CustomerBody } from "../../../declarations/marketplace_backend/marketplace_backend.did";


export interface CustomerType {
    'id' : string,
    'created' : bigint,
    'principal' : Principal,
    'body' : undefined | CustomerBody,
  }
 
