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
import { deleteAsset, uploadFile } from "../../storage-config/functions";
import { useSelector, useDispatch } from 'react-redux'
import { backendActor } from "../../config";

const UpdateProduct = ({
  productInfo,
  setProductsUpdated,
  isOpen,
  onClose,
}) => {

  const { storageInitiated } = useSelector((state) => state.global)

  const [id, setId] = useState(productInfo.id);
  const [minOrder, setMinOrder] = useState(productInfo.minOrder);
  const [productName, setProductName] = useState(productInfo.name);
  const [shortDescription, setShortDescription] = useState(
    productInfo.shortDescription
  );
  const [fullDesc, setFullDesc] = useState(productInfo.fullDescription);
  const [price, setPrice] = useState(productInfo.price);
  const [category, setCategory] = useState(productInfo.category);
  const [weight, setWeight] = useState(
    productInfo.weight
  );
  const [availability, setAvailability] = useState(
    productInfo.availability
  );
  const [newImages, setNewImages] = useState(null);
  const [deletingAssets, setDeleting] = useState(false)


  const [images, setImages] = useState(productInfo.images);
  const [updating, setUpdating] = useState(false);
  const [loadingImages, setloading] = useState(false);
  const [imgCount, setImgCount] = useState(null)
  const [uploading, setUpLoading] = useState(false);

  const handleImageChange = async (e) => {
    setloading(true);
    const files = Array.from(e.target.files);
    const selected = files.slice(0, 4);
    setNewImages(selected);
    setloading(false)
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (deletingAssets || uploading || updating) {
      console.log("Currently busy")
    } else {
      if (newImages) {
        try {
          console.log("Deleting old images")
          await deleteAssetsUrls(images)
          const urls = await uploadAssets()
          setUpdating(true);
          saveUpdatedProduct(urls)
        } catch (error) {
          console.log(error)
        }
      } else {
        setUpdating(true);
        saveUpdatedProduct(images)
      }
    }
  };

  const saveUpdatedProduct = async (filesUrls) => {
    const updatedProduct = {
      id: id,
      name: productName,
      price: parseInt(price),
      minOrder: parseInt(minOrder),
      shortDescription: shortDescription,
      fullDescription: fullDesc,
      category: category,
      weight: parseInt(weight),
      availability: availability,
      images: filesUrls
    };
    await backendActor.updateProduct(id, updatedProduct);
    setProductsUpdated(true);
    setUpdating(false);
    onClose();
  }

  const uploadAssets = async () => {
    if (storageInitiated && newImages) {
      setImgCount(newImages.length)
      setUpLoading(true);
      const file_path = location.pathname;
      const assetsUrls = [];

      for (const image of newImages) {
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

  const deleteAssetsUrls = async (urls) => {
    setDeleting(true)
    setImgCount(urls.length)
    for (const url of urls) {
      console.log("Deleting this url", url)
      await deleteAsset(url);
      setImgCount(prevCount => prevCount - 1);
    }
    setDeleting(false)
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
          Update product {productInfo.id}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Product name"
            type="text"
            fullWidth
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
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
            onChange={handleImageChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="error">
            Cancel
          </Button>
          <Button
            disabled={loadingImages}
            type="submit"
            variant="contained"
            color="success"
            sx={{
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            {deletingAssets && `Deleting old images... ${imgCount}`}
            {uploading && `Uploading new images...${imgCount}`}
            {updating && "Saving updated product..."}
            {!uploading && !deletingAssets && !updating && "Update product"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateProduct;
