import React, { Fragment, useEffect, useState } from "react";
import "./ProductSelection.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, fetchCompatibleMotherboards } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";

const ProductSelection = ({ history }) => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const [selectedMotherboard, setSelectedMotherboard] = useState(null);

    const {
        items,
        loading,
        error,
    } = useSelector((state) => state.items);


    const selectedProcessorId = localStorage.getItem('selectedProcessorId');
    const selectedGraphicCardId = localStorage.getItem('selectedGraphicCardId');
    
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(fetchCompatibleMotherboards(selectedProcessorId, selectedGraphicCardId));
    }, [dispatch, alert, error, selectedGraphicCardId, selectedProcessorId]);


    const handleMotherboardSelect = (motherboard) => {
        setSelectedMotherboard(motherboard);
        localStorage.setItem('selectedMotherboardId', motherboard.productid);
        history.push("/ram/selection");
    };

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title="Build Your PC --TECHCONFIG" />
                    <h2 className="productSelectionHeading">Motherboard Selection</h2>

                    <div className="productSelection">
                        <div className="categorySection">
                            <div className="productItems">
                                {renderMotherboards()}
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );



    function renderMotherboards() {
        return items.map((product) => (
            <div key={product.productid} className="productItem">
                <ProductCard product={product} />
                <button onClick={() => handleMotherboardSelect(product)}>Select</button>
            </div>
        ));
    }
};

export default ProductSelection;
