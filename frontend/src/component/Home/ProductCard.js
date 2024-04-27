import React from "react";
import { Link } from "react-router-dom";
import { Rating } from "@material-ui/lab";

const ProductCard = ({ product }) => {
  const options = {
      value: product.ratings,
      readOnly: true,
      precision: 0.5,
  };
  return (
    <Link className="productCard" to={`/product/${product.productid}`}>
      <img src={product.imageurl} alt={product.productname} />
      <p>{product.productname}</p>
      <div>
        <Rating {...options} />
        <span className="productCardSpan">
        {product.stockquantity > 0 ? "Available" : "Sold"}
        </span>
      </div>
      <span>{`Rs.${product.price}`}</span>
    </Link>
  );
}; 

export default ProductCard;