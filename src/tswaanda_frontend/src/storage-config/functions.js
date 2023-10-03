import { Ed25519KeyIdentity } from "@dfinity/identity";
import { getActor } from "./actor";
import { updateChecksum } from "./utils";

import { idlFactory as fileStorageIdlFactory } from "../../../declarations/file_storage/index";
import { idlFactory as fileScalingManagerIdlFactory } from "../../../declarations/file_scaling_manager/index";
// import { canisterId as scalingCanId } from "../../declarations/file_scaling_manager/index";
// import { canisterId as storageCanid } from "../../declarations/file_storage/index";

const scalingCanId = "7t3jl-kyaaa-aaaal-qcamq-cai";
const storageCanId = "72ycx-4qaaa-aaaal-qcana-cai";


let motoko_identity = Ed25519KeyIdentity.generate();
let fileScalingManagerActor;
let fileStorageActor;
let mediaFiles = [];
let packery;
let actorsInitialized = false;

export async function initActors() {
  if (!actorsInitialized) {
    fileScalingManagerActor = await getActor(
      scalingCanId,
      fileScalingManagerIdlFactory,
      motoko_identity
    );

    fileScalingManagerActor.init();

    fileStorageActor = await getActor(
      storageCanId,
      fileStorageIdlFactory,
      motoko_identity
    );
    actorsInitialized = true;
  }

  return true;
}

//Return the version of the storage canister
export async function getVersion() {
  const response = await fileStorageActor.version();
  console.log("Response here", response);
  return response;
}

export function getFileNameWithoutExtension(filename) {
  const index = filename.lastIndexOf(".");
  return index !== -1 ? filename.substring(0, index) : filename;
}

export async function getAllAssets() {
  try {
    const result = await fileStorageActor.assets_list();
    return result;
  } catch (error) {
    console.log("Error when fetching all assets", error);
  }
}

export function uploadFile(file, path) {
  return new Promise((resolve, reject) => {
    // const blob = new Blob([file], { type: file.type });
    const batch_id = Math.random().toString(36).substring(2, 7);
    const uploadChunk = async ({ chunk, order }) => {
      return fileStorageActor.create_chunk(batch_id, chunk, order);
    };

    const asset_reader = new FileReader();
    asset_reader.onload = async () => {
      const asset_unit8Array = new Uint8Array(asset_reader.result);
      const promises = [];
      const chunkSize = 2000000;
      let checksum = 0;

      for (
        let start = 0, index = 0;
        start < asset_unit8Array.length;
        start += chunkSize, index++
      ) {
        const chunk = asset_unit8Array.slice(start, start + chunkSize);
        checksum = updateChecksum(chunk, checksum);
        promises.push(uploadChunk({ chunk, order: index }));
      }

      const chunk_ids = await Promise.all(promises);
      const asset_filename = file.name;
      const asset_content_type = file.type;

      const { ok: asset_url } = await fileStorageActor.commit_batch(
        batch_id,
        chunk_ids,
        {
          filename: asset_filename,
          checksum: checksum,
          content_encoding: { Identity: null },
          content_type: asset_content_type,
        },
        path
      );

      resolve(asset_url);
    };

    asset_reader.onerror = (error) => {
      reject(error);
    };

    asset_reader.readAsArrayBuffer(file);
  });
}

export async function deleteAsset(url) {
  try {
    console.log("Removing asset with URL:", url);
    const assetId = getAssetId(url);

    console.log("Removing asset with Asset ID:", assetId);

    const delete_result = await fileStorageActor.delete_asset(assetId);
    console.log("Removing asset with delete_result:", delete_result);

    if (delete_result.ok) {
      console.log("Deleted asset item:", delete_result.ok);
    } else {
      console.error("Error deleting grid item:", delete_result.err);
    }

    const asset_list = await fileStorageActor.assets_list();
    let deleted_asset = null;
    for (let i = 0; i < asset_list.length; i++) {
      if (asset_list[i].url === url) {
        deleted_asset = asset_list[i];
        break;
      }
    }
    console.log("Check if deleted_asset is still here:", deleted_asset);
  } catch (error) {
    console.error("Error removing grid item:", error);
  }
}

export const getAsset = async (url) => {
  const assetId = getAssetId(url);
  const asset = await fileStorageActor.get(assetId);
  return asset;
}

function getAssetId(url) {
  const parts = url.split("/");
  const assetId = parts[parts.length - 1];
  return assetId;
}


export { actorsInitialized, fileStorageActor };