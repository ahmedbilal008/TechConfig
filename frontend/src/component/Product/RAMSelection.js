import React, { Fragment, useEffect, useState } from "react";
import "./ProductSelection.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, fetchCompatibleRAMs} from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";

const ProductSelection = ({history}) => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const [selectedRAM, setSelectedRAM] = useState(null);

    const {
        items,
        loading,
        error,
    } = useSelector((state) => state.items);

    const selectedMotherboardId = localStorage.getItem('selectedMotherboardId');

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(fetchCompatibleRAMs(selectedMotherboardId));
    }, [dispatch, alert, error,selectedMotherboardId]);

    const handleRAMSelect = (ram) => {
        setSelectedRAM(ram);
        localStorage.setItem('selectedRAMId', ram.productid);
        history.push("/storage/selection");
    };


    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title="Build Your PC --TECHCONFIG" />
                    <h2 className="productSelectionHeading">RAM Selection</h2>

                    <div className="productSelection">
                        <div className="categorySection">
                            <div className="productItems">
                                {renderRAMs()}
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );

    function renderRAMs() {
        return items.map((product) => (
            <div key={product.productid} className="productItem">
            <ProductCard product={product} />
            <button onClick={() => handleRAMSelect(product)}>Select</button>
          </div>
        ));
    }

};

export default ProductSelection;
