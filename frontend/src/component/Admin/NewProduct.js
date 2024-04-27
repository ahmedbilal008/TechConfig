import React, { Fragment, useEffect, useState } from "react";
import "./NewProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createProduct } from "../../actions/productAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import BuildIcon from '@material-ui/icons/Build';
import SideBar from "./Sidebar";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";

const NewProduct = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, success } = useSelector((state) => state.newProduct);

  const [productname, setProductname] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [stockquantity, setStockquantity] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const [socketType, setSocketType] = useState("");
  const [slotType, setSlotType] = useState("");
  const [ramSlots, setRamSlots] = useState("");
  const [interfaceType, setInterfaceType] = useState("");

  // const [selectedCategoryError, setSelectedCategoryError] = useState("");
  // const [selectedImageError, setSelectedImageError] = useState("");
  const categories = [
    "Laptop",
    "Processor",
    "GraphicCard",
    "Motherboard",
    "RAM",
    "Storage",
    "Keyboard",
    "Mouse"
  ];

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Product Created Successfully");
      history.push("/admin/dashboard");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, history, success]);

  const createProductSubmitHandler = async(e) => {
    e.preventDefault();
    if (category && images.length > 0) {
      const myForm = new FormData();

      myForm.set("productname", productname);
      myForm.set("price", price);
      myForm.set("description", description);
      myForm.set("category", category);
      myForm.set("stockquantity", stockquantity);
      myForm.set("manufacturer", manufacturer);

      images.forEach((image) => {
        myForm.append("images", image);
      });
      
      if (category === "Processor") {
        myForm.set("socketType", socketType);
      } else if (category === "GraphicCard") {
        myForm.set("slotType", slotType);
      } else if (category === "RAM") {
        myForm.set("ramSlots", ramSlots);
      } else if (category === "Storage") {
        myForm.set("interfaceType", interfaceType);
      } else if (category === "Motherboard") {
        myForm.set("socketType", socketType);
        myForm.set("slotType", slotType);
        myForm.set("ramSlots", ramSlots);
        myForm.set("interfaceType", interfaceType);
      }
      dispatch(createProduct(myForm));
    }
    else {
      alert.error("Please fill in all the required fields.");
    }
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <MetaData title="Create Product" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={createProductSubmitHandler}
          >
            <h1>Create Product</h1>
            <div>
              <BuildIcon />
              <input
                type="text"
                placeholder="Manufacturer"
                required
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
              />
            </div>
            <div>
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Product Name"
                required
                value={productname}
                onChange={(e) => setProductname(e.target.value)}
              />
            </div>
            <div>
              <AttachMoneyIcon />
              <input
                type="number"
                placeholder="Price"
                required
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <DescriptionIcon />

              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="1"
              ></textarea>
            </div>

            <div>
              <AccountTreeIcon />
              <select onChange={(e) => setCategory(e.target.value)}>
                <option value="">Choose Category</option>
                {categories.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <StorageIcon />
              <input
                type="number"
                placeholder="Stock"
                required
                onChange={(e) => setStockquantity(e.target.value)}
              />
            </div>
            {(category === "Processor" || category === "Motherboard") && (
              <div>
                <BuildIcon />
                <input
                  type="text"
                  placeholder="Socket Type"
                  required
                  value={socketType}
                  onChange={(e) => setSocketType(e.target.value)}
                />
              </div>
            )}

            {(category === "GraphicCard" || category === "Motherboard") && (
              <div>
                <BuildIcon />
                <input
                  type="text"
                  placeholder="Slot Type"
                  required
                  value={slotType}
                  onChange={(e) => setSlotType(e.target.value)}
                />
              </div>
            )}

            {(category === "RAM" || category === "Motherboard") && (
              <div>
                <BuildIcon />
                <input
                  type="number"
                  placeholder="RAM Slots"
                  required
                  value={ramSlots}
                  onChange={(e) => setRamSlots(e.target.value)}
                />
              </div>
            )}

            {(category === "Storage" || category === "Motherboard") && (
              <div>
                <BuildIcon />
                <input
                  type="text"
                  placeholder="Interface Type"
                  required
                  value={interfaceType}
                  onChange={(e) => setInterfaceType(e.target.value)}
                />
              </div>
            )}

            <div id="createProductFormFile">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={createProductImagesChange}
                multiple
              />
            </div>

            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={loading ? true : false}
            >
              Create
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default NewProduct;
