import React, { Fragment, useEffect, useState } from "react";
import "./ProductSelection.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, fetchCompatibleStorage } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { useAlert } from "react-alert";
import { addItemsToCart } from "../../actions/cartAction";
import MetaData from "../layout/MetaData";

const ProductSelection = ({ history }) => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const [selectedStorage, setSelectedStorage] = useState(null);

    const {
        items,
        loading,
        error,
    } = useSelector((state) => state.items);

    const selectedProcessorId = localStorage.getItem('selectedProcessorId');
    const selectedGraphicCardId = localStorage.getItem('selectedGraphicCardId');
    const selectedMotherboardId = localStorage.getItem('selectedMotherboardId');
    const selectedRAMId = localStorage.getItem('selectedRAMId');

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(fetchCompatibleStorage(selectedMotherboardId));
    }, [dispatch, alert, error, selectedMotherboardId]);

    const handleStorageSelect = (storage) => {
        setSelectedStorage(storage);
        localStorage.setItem('selectedStorageId', storage.productid);
    };

    const addToCartHandler = () => {
        dispatch(addItemsToCart(selectedProcessorId, 1));
        dispatch(addItemsToCart(selectedGraphicCardId, 1));
        dispatch(addItemsToCart(selectedMotherboardId, 1));
        dispatch(addItemsToCart(selectedRAMId, 1));
        dispatch(addItemsToCart(selectedStorage.productid, 1));
        alert.success("PC components Added To Cart");
        history.push("/cart");
    };

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title="Build Your PC --TECHCONFIG" />
                    <h2 className="productSelectionHeading">Storage Selection</h2>

                    <div className="productSelection">
                        <div className="categorySection">
                            <div className="productItems">
                                {renderStorages()}
                            </div>
                        </div>
                        <button
                            disabled={selectedStorage === null}
                            onClick={addToCartHandler}
                        >
                            Add Components to Cart
                        </button>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );

    function renderStorages() {
        return items.map((product) => (
            <div key={product.productid} className="productItem">
                <ProductCard product={product} />
                <button onClick={() => handleStorageSelect(product)}>Select</button>
            </div>
        ));
    }
};

export default ProductSelection;
