import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
// import Slider from "@material-ui/core/Slider";
import { useAlert } from "react-alert";
import Typography from "@material-ui/core/Typography";
import MetaData from "../layout/MetaData";

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

const Products = ({ match }) => {
    const dispatch = useDispatch();

    const alert = useAlert();

    const [currentPage, setCurrentPage] = useState(1);
    const [category, setCategory] = useState("");

    const {
        products,
        loading,
        error,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    } = useSelector((state) => state.products);

    const keyword = match.params.keyword;
    console.log(keyword);

    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    };

    //let count = filteredProductsCount;

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        dispatch(getProduct(keyword, currentPage, category));
    }, [dispatch, keyword, currentPage,category, alert, error]);
    
    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title="PRODUCTS -- ECOMMERCE" />
                    <h2 className="productsHeading">Products</h2>

                    <div className="products">
                        {products &&  
                            products.map((product) => (
                                <ProductCard key={product.productid} product={product} />
                            ))
                        }

                    </div>
                    <div className="filterBox">
                        <Typography component="legend">Categories</Typography>
                        <ul className="categoryBox">
                            {categories.map((category) => (
                                <li
                                    className="category-link"
                                    key={category}
                                    onClick={() => setCategory(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {resultPerPage < productsCount && (
                        //remember it is not working at this stage since filtered product is including paginated products
                        //const countQuery = [...query]; how ever copying it in backend and using separate query might work 
                        <div className="paginationBox">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resultPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText="Next"
                                prevPageText="Prev"
                                firstPageText="1st"
                                lastPageText="Last"
                                itemClass="page-item"
                                linkClass="page-link"
                                activeClass="pageItemActive"
                                activeLinkClass="pageLinkActive"
                            />
                        </div>)}
                </Fragment>
            )
            }
        </Fragment >
    );
};

export default Products;