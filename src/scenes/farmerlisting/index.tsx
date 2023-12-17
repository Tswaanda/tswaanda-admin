import React, { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField,
} from "@mui/material";
import { categories } from "../constants/index";
import { v4 as uuidv4 } from "uuid";
// import { backendActor } from "../../config";
import { toast } from "react-toastify";
import { uploadFile } from "../../storage-config/functions";
import { useAuth } from "../../hooks/auth";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../state/Store";

type FarmerListingProps = {
  isOpen: boolean;
  onClose: any;
  getPendingFarmers: any;
};

const FarmerListing: FC<FarmerListingProps> = ({
  isOpen,
  onClose,
  getPendingFarmers,
}) => {
  const { storageInitiated } = useSelector((state: RootState) => state.global);
  const { backendActor } = useAuth();

  const [farmerName, setFarmerName] = useState("");
  const [farmerEmail, setFarmerEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmDescription, setFarmDescription] = useState("");
  const [produceCategory, setProduceCategory] = useState("");
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const [idCopy, setIdCopy] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    try {
      setSaving(true);
      let proofOfAddressUrl = null;
      let idCopyUrl = null;
      if (proofOfAddress) {
        proofOfAddressUrl = await uploadAssets(proofOfAddress);
      }
      if (idCopy) {
        idCopyUrl = await uploadAssets(idCopy);
      }
      const farmer = {
        id: uuidv4(),
        fullName: farmerName,
        email: farmerEmail,
        phone: phoneNumber,
        farmName,
        location: farmLocation,
        description: farmDescription,
        produceCategories: produceCategory,
        listedProducts: [],
        soldProducts: [],
        proofOfAddress: proofOfAddressUrl ? [proofOfAddressUrl] : [],
        idCopy: idCopyUrl ? [idCopyUrl] : [],
        isSuspended: false,
        isVerified: false,
        created: BigInt(Date.now()),
      };
      await backendActor.createFarmer(farmer);
      toast.success("Farmer added successfully", {
        autoClose: 5000,
        position: "top-center",
        hideProgressBar: true,
      });
      getPendingFarmers();
      setSaving(false);
    } catch (error) {
      console.log(error);
      toast.error(`Error adding farmer, please try again`, {
        autoClose: 5000,
        position: "top-center",
        hideProgressBar: true,
      });
      setSaving(false);
    }
  };

  const uploadAssets = async (image: any) => {
    if (storageInitiated) {
      try {
        const file_path = location.pathname;
        const assetUrl = await uploadFile(image, file_path);
        console.log("This file was successfully uploaded:", image.name);
        return assetUrl;
      } catch (error) {
        console.error("Error uploading file:", image.name, error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <form onSubmit={handleFormSubmit}>
        <DialogTitle
          sx={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "green",
          }}
        >
          List a new Farmer
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            value={farmerName}
            onChange={(e) => setFarmerName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="text"
            fullWidth
            value={farmerEmail}
            onChange={(e) => setFarmerEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Phone"
            type="text"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Farm Name"
            type="text"
            fullWidth
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Location"
            type="text"
            fullWidth
            value={farmLocation}
            onChange={(e) => setFarmLocation(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={farmDescription}
            onChange={(e) => setFarmDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Proof of address (Optional)"
            type="file"
            fullWidth
            onChange={(e) => {
              const input = e.target as HTMLInputElement;
              if (input.files && input.files.length > 0) {
                setProofOfAddress(input.files[0]);
              } else {
                setProofOfAddress(null);
              }
            }}
          />
          <TextField
            margin="dense"
            label="Id Copy (Optional)"
            type="file"
            fullWidth
            onChange={(e) => {
              const input = e.target as HTMLInputElement;
              if (input.files && input.files.length > 0) {
                setIdCopy(input.files[0]);
              } else {
                setIdCopy(null);
              }
            }}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">Produce Category</InputLabel>
            <Select
              labelId="category-label"
              value={produceCategory}
              onChange={(e) => setProduceCategory(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="error">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            sx={{
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            {saving && "Saving info..."}
            {!saving && "Add Farmer"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FarmerListing;
