import React, { Fragment, useEffect } from "react";
//import { CgMouse } from "react-icons/cg";
import "./Home.css";
import { useHistory } from "react-router-dom";
import ProductCard from "./ProductCard.js";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
       alert.error(error);
       dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error,alert]);

  const handleBuildPCClick = () => {
    history.push("/processor/selection");
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
    <Fragment>
      <MetaData title="TECHCONFIG" />
      <div className="banner">
        <p>Welcome to <b>TechConfig</b></p>
        <h1>FIND AMAZING PRODUCTS BELOW</h1>
        <button onClick={handleBuildPCClick}>Build Your PC</button>
      </div>

      <h2 className="homeHeading">Featured Products</h2>

      <div className="container" id="container">
      {products && products ? (
          products.map((product) => (
            <ProductCard product={product} />
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
      </Fragment>
      )}
    </Fragment>
  );
};

export default Home;