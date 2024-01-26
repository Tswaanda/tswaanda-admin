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
import { categories } from "../../constants/index";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { uploadFile } from "../../storage-config/functions";
import { useAuth } from "../../hooks/auth";
import { HSCodes } from "../../hscodes/hscodes";
import { sendOrderListedEmail } from "../../emails/orderListedMail";
import { toast } from "react-toastify";
import Autocomplete from "@mui/lab/Autocomplete";
import { RootState } from "../../state/Store";
import {
  AppMessage,
  Product,
  UserNotification,
} from "../../declarations/tswaanda_backend/tswaanda_backend.did";

function UpLoadProduct({ isOpen, onClose, setProductsUpdated }) {
  const { storageInitiated } = useSelector((state: RootState) => state.global);
  const { backendActor, marketActor, ws } = useAuth();

  const [farmer, setFarmer] = useState("");
  const [minOrder, setMinOrder] = useState<any | null>(null);
  const [product, setProduct] = useState<any | null>(null);
  const [shortDescription, setShortDescription] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [weight, setWeight] = useState("");
  const [availability, setAvailability] = useState("");
  const [loadingImages, setloadingImages] = useState(false);
  const [saving, setSaving] = useState(false);

  const [uploads, setUploads] = useState<any[]>([]);
  const [imgCount, setImgCount] = useState<any | null>(null);
  const [uploading, setUpLoading] = useState(false);

  const handleImageInputChange = (e) => {
    setloadingImages(true);
    const files = Array.from(e.target.files);
    const selected = files.slice(0, 4);
    setImgCount(selected.length);
    setUploads(selected);
  };

  useEffect(() => {
    if (uploads?.length >= 4) {
      setloadingImages(false);
    }
  }, [uploads]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (uploading || saving) {
      console.log("Currently busy");
    } else {
      try {
        // Get farmer by email and return if not found and toast error
        const farmerRes = await backendActor?.getFarmerByEmail(farmer);
        if (!farmerRes) {
          console.log(
            "Farmer not found, please check email address or register farmer first"
          );
          toast.error(
            `Farmer not found, please check email address or register farmer first`,
            {
              autoClose: 5000,
              position: "top-center",
              hideProgressBar: true,
            }
          );
          return;
        }
        if (farmerRes && "ok" in farmerRes) {
          const urls = await uploadAssets();
          setSaving(true);
          if (urls) {
            const newProduct: Product = {
              id: uuidv4(),
              name: product.name,
              hscode: product.code,
              farmer: farmer,
              price: parseInt(price),
              minOrder: parseInt(minOrder),
              shortDescription: shortDescription,
              fullDescription: fullDesc,
              ordersPlaced: 0,
              category: category,
              weight: parseInt(weight),
              availability: availability,
              images: urls,
              created: BigInt(Date.now()),
            };

            // Create product and update farmer
            let updatedFarmer = {
              ...farmerRes.ok,
              listedProducts: [...farmerRes.ok.listedProducts, newProduct.id],
            };
            await backendActor?.updateFarmer(updatedFarmer);
            await backendActor?.createProduct(newProduct);
            await sendNewProductDropWSMessage(newProduct);
            // Send email to farmer to notify them of new product
            const res = await sendOrderListedEmail(farmerRes.ok, newProduct);
            if (res) {
              console.log("Email sent");
            }
            toast.success(
              `Product saved! Notification email sent to the farmer.`,
              {
                autoClose: 5000,
                position: "top-center",
                hideProgressBar: true,
              }
            );
            setProductsUpdated(true);
            setSaving(false);
            onClose();
          }
        } else {
          console.log("Error getting farmer", farmerRes);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const sendNewProductDropWSMessage = async (_prod: Product) => {
    const msg: AppMessage = {
      FromAdmin: {
        NewProductDrop: {
          productName: _prod.name,
        },
      },
    };
    let notification: UserNotification = {
      id: uuidv4(),
      notification: {
        NewProductDrop: {
          productId: _prod.id,
          link: `https://tswaanda.com/product/${_prod.id}`,
          productName: _prod.name,
          price: _prod.price,
          image: _prod.images[0],
        },
      },
      read: false,
      created: BigInt(Date.now()),
    };

    let all_users = await marketActor?.getAllCustomersPrincipals();
    if (all_users) {
      for (const user of all_users) {
        await backendActor?.createUserNotification(user, notification);
      }
    }
    ws.send(msg);
  };

  const uploadAssets = async () => {
    if (storageInitiated && uploads) {
      setUpLoading(true);
      const file_path = location.pathname;
      const assetsUrls: string[] = [];

      for (const image of uploads) {
        try {
          const assetUrl = await uploadFile(image, file_path);
          assetsUrls.push(assetUrl);
          console.log("This file was successfully uploaded:", image.name);
          setImgCount((prevCount) => prevCount - 1);
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
            <Autocomplete
              value={product}
              onChange={(event, newValue) => {
                setProduct(newValue);
              }}
              options={HSCodes}
              // getOptionLabel={(option) => `${option.name} - ${option.code}`}
              getOptionLabel={(option) => {
                if (!option) return "Select a product";
                return `${option.name ? option.name : "Product Name"} - ${
                  option.code ? option.code : "HSCode"
                }`;
              }}
              renderInput={(params) => (
                <TextField {...params} label="Product Name" margin="dense" />
              )}
            />
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
