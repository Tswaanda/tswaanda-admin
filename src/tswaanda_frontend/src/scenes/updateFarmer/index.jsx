import React, { useEffect, useState } from "react";
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
import { backendActor } from "../../config";
import { toast } from "react-toastify";

function UpdateFarmer({ isOpen, onClose, farmer }) {


    const [farmerName, setFarmerName] = useState(farmer.fullName);
    const [farmerEmail, setFarmerEmail] = useState(farmer.email);
    const [phoneNumber, setPhoneNumber] = useState(farmer.phone);
    const [farmName, setFarmName] = useState(farmer.farmName);
    const [farmLocation, setFarmLocation] = useState(farmer.location);
    const [farmDescription, setFarmDescription] = useState(farmer.description);
    const [produceCategory, setProduceCategory] = useState(farmer.produceCategories);

    const [saving, setSaving] = useState(false);


    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            setSaving(true);
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
                isSuspended: false,
                isVerified: false,
                created: BigInt(Date.now()),
            };
            console.log(farmer)
            await backendActor.createFarmer(farmer);
            toast.success("Farmer added successfully", {
                autoClose: 5000,
                position: "top-center",
                hideProgressBar: true,
            });
            setSaving(false);

        } catch (error) {
            console.log(error);
            setSaving(false);
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
}

export default UpdateFarmer
