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
import { useSelector, useDispatch } from 'react-redux'
import { uploadFile } from "../../storage-config/functions";
import { useAuth } from "../../hooks/auth";
import { HSCodes } from "../../hscodes/hscodes";
import { sendOrderListedEmail } from "../../emails/orderListedMail";

function UpLoadProduct({ isOpen, onClose, setProductsUpdated }) {

  const { storageInitiated } = useSelector((state) => state.global)
  const { backendActor } = useAuth()

  const [farmer, setFarmer] = useState("");
  const [minOrder, setMinOrder] = useState(null);
  const [product, setProduct] = useState({});
  const [shortDescription, setShortDescription] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [availability, setAvailability] = useState("");
  const [loadingImages, setloadingImages] = useState(false);
  const [saving, setSaving] = useState(false);

  const [uploads, setUploads] = useState([]);
  const [imgCount, setImgCount] = useState(null)
  const [uploading, setUpLoading] = useState(false);

  const handleImageInputChange = (e) => {
    setloadingImages(true);
    const files = Array.from(e.target.files);
    const selected = files.slice(0, 4);
    setImgCount(selected.length)
    setUploads(selected);
  };

  useEffect(() => {
    if (uploads.length >= 4) {
      setloadingImages(false);
    }
  }, [uploads]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (uploading || saving) {
      console.log("Currently busy")
    } else {
      try {
        const urls = await uploadAssets();
        setSaving(true);
        if (urls) {
          const newProduct = {
            id: uuidv4(),
            name: product.name,
            hscode: product.code,
            farmer: farmer,
            price: parseInt(price),
            minOrder: parseInt(minOrder),
            shortDescription: shortDescription,
            fullDescription: fullDesc,
            category: category,
            weight: parseInt(weight),
            availability: availability,
            images: urls,
          };

          await backendActor.createProduct(newProduct);
          await sendOrderListedEmail(farmer, update= "listed")
          setProductsUpdated(true);
          setSaving(false)
          onClose();
        }

      } catch (error) {
        console.log(error);
      }
    }

  };

  const uploadAssets = async () => {
    if (storageInitiated && uploads) {
      setUpLoading(true);
      const file_path = location.pathname;
      const assetsUrls = [];

      for (const image of uploads) {
        try {
          const assetUrl = await uploadFile(image, file_path);
          assetsUrls.push(assetUrl);
          console.log("This file was successfully uploaded:", image.name);
          setImgCount(prevCount => prevCount - 1);
        } catch (error) {
          console.error("Error uploading file:", image.name, error);
        }
      }
      setUpLoading(false);
      console.log("Assets urls here", assetsUrls);
      return assetsUrls;
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
          Upload a new product
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">Product Name</InputLabel>
            <Select
              labelId="category-label"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            >
              {HSCodes.map((codeItem, index) => (
                <MenuItem key={index} value={codeItem}>
                  {codeItem.name} - {codeItem.code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label="Farmer"
            type="email"
            value={farmer}
            fullWidth
            onChange={(e) => setFarmer(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Minimum order"
            type="number"
            fullWidth
            value={minOrder}
            onChange={(e) => setMinOrder(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Full Description"
            multiline
            rows={3}
            type="text"
            fullWidth
            value={fullDesc}
            onChange={(e) => setFullDesc(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Weight"
            rows={3}
            type="number"
            fullWidth
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="availability-label">Availability</InputLabel>
            <Select
              labelId="availability-label"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Out of stock">Out of stock</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Image files"
            type="file"
            inputProps={{
              multiple: true,
            }}
            fullWidth
            onChange={handleImageInputChange}
          />
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
            {uploading && `Uploading images... ${imgCount}`}
            {saving && "Saving product..."}
            {!uploading && !saving && "Add product"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default UpLoadProduct;
