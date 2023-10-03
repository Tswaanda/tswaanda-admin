import icblast from "@infu/icblast";
// import fs from "fs";
import CRC32 from "crc-32";
import { Principal } from "@dfinity/principal";
import { AuthClient } from "@dfinity/auth-client";
import { useState } from "react";

let repository_canister;
let wallet;

export async function initializeRepositoryCanister() {
  try {
    const authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      const identity = await authClient.getIdentity();
      let exporter_ic = icblast({ identity });
      repository_canister = await exporter_ic("chs73-3aaaa-aaaar-qabaa-cai");
      callerWallet(identity);
    } else {
      console.log("User is not authenticated");
    }
  } catch (error) {
    console.log("Error instantiating the repository_canister canister", error);
  }
}

// user copys and deploys his/her wallet
export const createWallet = async () => {
  try {
    let wallet_response = await repository_canister.copy_wallet_code();
    console.log(wallet_response.toString());
    return wallet_response.toString();
  } catch (error) {
    console.log(error);
  }
};

// check wallet address of user
export const checkUserWallet = async (userPrincipal) => {
  let user_wallet_address = await repository_canister.get_wallet_principal_of(
    userPrincipal
  );
  console.log("Your wallet", user_wallet_address.toString());
  return user_wallet_address;
};

// check the wallet address of the call
export const callerWallet = async (identity) => {
  try {
    let exporter_ic = icblast({ identity });
    let wallet_address = await repository_canister.get_wallet_principal_of(
      identity.getPrincipal().toString()
    );
    console.log(wallet_address.toString())
    wallet = await exporter_ic(wallet_address.toString());
    createContractCanister();
  } catch (error) {
    console.log("Error instaitiating the wallet", error);
  }
};

// check contract address of the call
export const createContractCanister = async () => {
  try {
    let contract_address = await wallet.copy_contract_code();
  console.log("Contract canister id:", contract_address.toString());
  let contract = await icblast(contract_address.toString());
  console.log(contract);
  return contract;
  } catch (error) {
    console.log(error)
  }
};

// // chunking file upload
// function updateChecksum(chunk, checksum) {
//   const moduloValue = 400000000; // Range: 0 to 400_000_000
//   // Calculate the signed checksum for the given chunk
//   const signedChecksum = CRC32.buf(Buffer.from(chunk, "binary"), 0);
//   // Convert the signed checksum to an unsigned value
//   const unsignedChecksum = signedChecksum >>> 0;
//   // Update the checksum and apply modulo operation
//   const updatedChecksum = (checksum + unsignedChecksum) % moduloValue;
//   // Return the updated checksum
//   return updatedChecksum;
// }

// var batch_id = "cargo_file";
// var checksum = 0;
// const file_path = "./file.pdf";
// const asset_buffer = fs.readFileSync(file_path);
// const asset_unit8Array = new Uint8Array(asset_buffer);
// const chunkSize = 2000000;

// for (
//   let start = 0, index = 0;
//   start < asset_unit8Array.length;
//   start += chunkSize, index++
// ) {
//   const chunk = asset_unit8Array.slice(start, start + chunkSize);

//   checksum = updateChecksum(chunk, checksum);
//   var response = await contract.chunk_upload(batch_id, chunk, index);
//   console.log(response);
// }

// add ethereum main account
export const updateEthWallet = async (body) => {
  const res = await wallet.update_eth_address(body.address);
  return res;
};

// get ethereum main account
export const getEthAddress = async () => {
  const wallet = await wallet.get_eth_address();
  return wallet;
};

export const startOffer = async (body) => {
  const offer = await contract.start_offer({
    chunk_ids: [1, 2, 3, 4],
    checksum: 1234,
    file_type: "application/pdf",
    Cargo: {
      country_of_origin: "GER",
      address_of_origin: {
        city: ["city"],
        dept: [],
        strt_nm: [],
        pst_cd: [],
        adr_line: ["12", "Germany"],
        twn_nm: [],
        adr_tp: [],
        ctry_subdvsn: [],
        bldg_nb: [],
        sub_dept: [],
      },
      address_of_destination: [
        {
          city: ["city"],
          dept: [],
          strt_nm: [],
          pst_cd: [],
          adr_line: ["12", "Germany"],
          twn_nm: [],
          adr_tp: [],
          ctry_subdvsn: [],
          bldg_nb: [],
          sub_dept: [],
        },
      ],
      seller_detail: {
        nm: ["city"],
        phn_nb: [],
        nm_prfx: [],
        other: [],
        fax_nb: [],
        mob_nb: [],
        email_adr: [],
      },
      payment_method: {
        Direct: null,
      },
      counter_offer_allowed: false,
      total_amount: 1000,
      product_id: 123,
      commerce: true,
      commerce_url: ["www.google.com"],
      weight: 123,
      min_order: 12,
      currency: "0xabcd",
      court: Principal.fromText("abcd"),
      maturity_date: 1234567,
      min_amount_of_completed_contracts: 12,
      max_amount_of_refused_contracts: 12,
      short_description: "short description",
      long_decription: "long description",
      allowed_countries_of_destination: [],
      allowed_buyers: [],
    },
  });
  return offer;
};

export const uploadOfferPDF = async () => {
  const upload_pdf = await upload_commercial_invoice({
    product_logo: {
      chunk_ids: [1],
      checksum: 1234,
      file_type: "png",
    },
    commercial_invoice: {
      chunk_ids: [1, 2, 3, 4],
      checksum: 1234,
      file_type: "application/pdf",
    },
    buyer_detail: {
      nm: ["city"],
      phn_nb: [],
      nm_prfx: [],
      other: [],
      fax_nb: [],
      mob_nb: [],
      email_adr: [],
    },
    address_of_destination: {
      city: ["city"],
      dept: [],
      strt_nm: [],
      pst_cd: [],
      adr_line: ["12", "Germany"],
      twn_nm: [],
      adr_tp: [],
      ctry_subdvsn: [],
      bldg_nb: [],
      sub_dept: [],
    },
    logistic: {
      modes_of_transport: ["city", ""],
      incoterm: "",
      logistics_companies: [Principal, Principal],
      hazard: true,
      size: "",
      weight: [12],
    },
    data: {
      Cargo: {
        country_of_origin: ["GER"],
        address_of_origin: [
          {
            city: ["city"],
            dept: [],
            strt_nm: [],
            pst_cd: [],
            adr_line: ["12", "Germany"],
            twn_nm: [],
            adr_tp: [],
            ctry_subdvsn: [],
            bldg_nb: [],
            sub_dept: [],
          },
        ],
        seller_detail: [
          {
            nm: ["city"],
            phn_nb: [],
            nm_prfx: [],
            other: [],
            fax_nb: [],
            mob_nb: [],
            email_adr: [],
          },
        ],
        payment_method: [],
        total_amount: [],
        product_id: [],
        commerce: bool,
        commerce_url: [],
        allowed_countries_of_destination: [],
        allowed_buyers: [],
        min_order: [],
        currency: [],
        court: [],
        min_amount_of_completed_contracts: [],
        max_amount_of_refused_contracts: [],
        short_description: [],
        long_decription: [],
      },
    },
  });
  return upload_pdf;
};
