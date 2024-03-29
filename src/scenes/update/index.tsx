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
import { categories } from "../../constants/index";
import { deleteAsset, uploadFile } from "../../storage-config/functions";
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from "../../hooks/auth";
import { HSCodes } from "../../hscodes/hscodes";
import { toast } from "react-toastify";
import { RootState } from "../../state/Store";

type UpdateProductProps = {
  productInfo: any;
  setProductsUpdated: any;
  isOpen: boolean;
  onClose: any;
};

const UpdateProduct: FC<UpdateProductProps> = ({
  productInfo,
  setProductsUpdated,
  isOpen,
  onClose,
}) => {

  const { backendActor } = useAuth()

  const { storageInitiated } = useSelector((state: RootState) => state.global)

  type Pitem = {
    name: string;
    code: string;
  };
  const [productItem, setProductItem] = useState<Pitem| String>({
    name: productInfo.name,
    code: productInfo.hscode,
  });

  const [id, setId] = useState(productInfo.id);
  const [minOrder, setMinOrder] = useState(productInfo.minOrder);
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
  const [farmer, setFarmer] = useState(productInfo.farmer);
  const [newImages, setNewImages] = useState<any[]|null>(null);
  const [deletingAssets, setDeleting] = useState(false)


  const [images, setImages] = useState(productInfo.images);
  const [updating, setUpdating] = useState(false);
  const [loadingImages, setloading] = useState(false);
  const [imgCount, setImgCount] = useState<any|null>(null)
  const [uploading, setUpLoading] = useState(false);

  const handleImageChange = async (e: any) => {
    setloading(true);
    const files = Array.from(e.target.files);
    const selected = files.slice(0, 4);
    setNewImages(selected);
    setloading(false)
  };

  const handleFormSubmit = async (event:any) => {
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

  const saveUpdatedProduct = async (filesUrls:any) => {
    const farmerRes = await backendActor?.getFarmerByEmail(farmer)
    if (!farmerRes) {
      console.log("Farmer not found, please check email address or register farmer first")
      toast.error(
        `Farmer not found, please check email address or register farmer first`,
        {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        }
      );
      setUpdating(false);
      return
    }
    const updatedProduct = {
      id: id,
      name: (productItem as Pitem).name,
      farmer: farmer,
      hscode: (productItem as Pitem).code,
      price: parseInt(price),
      minOrder: parseInt(minOrder),
      shortDescription: shortDescription,
      fullDescription: fullDesc,
      category: category,
      weight: parseInt(weight),
      availability: availability,
      images: filesUrls,
      ordersPlaced: productInfo.ordersPlaced,
      created: productInfo.created,
    };
    console.log("Updated product", updatedProduct)
    await backendActor?.updateProduct(id, updatedProduct);
    setProductsUpdated(true);
    setUpdating(false);
    onClose();
  }

  const uploadAssets = async () => {
    if (storageInitiated && newImages) {
      setImgCount(newImages.length)
      setUpLoading(true);
      const file_path = location.pathname;
      const assetsUrls: string[] = [];

      for (const image of newImages) {
        try {
          const assetUrl = await uploadFile(image, file_path);
          assetsUrls.push(assetUrl);
          console.log("This file was successfully uploaded:", image.name);
          setImgCount((prevCount: any) => prevCount - 1);
        } catch (error) {
          console.error("Error uploading file:", image.name, error);
        }
      }
      setUpLoading(false);
      console.log("Assets urls here", assetsUrls);
      return assetsUrls;
    }
  };

  const deleteAssetsUrls = async (urls:any) => {
    setDeleting(true)
    setImgCount(urls.length)
    for (const url of urls) {
      console.log("Deleting this url", url)
      await deleteAsset(url);
      setImgCount((prevCount:any) => prevCount - 1);
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
          <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">Product Name</InputLabel>
            <Select
              labelId="category-label"
              value={productItem}
              onChange={(e) => setProductItem(e.target.value)}
            >
              {HSCodes.map((codeItem, index) => (
                <MenuItem key={index} >
                  {codeItem.name} - {codeItem.code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            label="Farmer email"
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
            required
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
            required
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
