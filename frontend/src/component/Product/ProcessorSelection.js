import React, { Fragment, useEffect, useState } from "react";
import "./ProductSelection.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, fetchAllProcessors,fetchAllGraphicCards } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";

const ProcessorSelection = ({history}) => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const [selectedProcessor, setSelectedProcessor] = useState(null);
    const {user}= useSelector(
        (state)=> state.user
      );
    const {
        items,
        loading,
        error,
    } = useSelector((state) => state.items);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(fetchAllProcessors());
    }, [dispatch, alert, error]);

    const handleProcessorSelect = (processor) => {
        setSelectedProcessor(processor);
        localStorage.setItem('selectedProcessorId', processor.productid);
        history.push("/graphiccard/selection");
    };

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title="Build Your PC --TECHCONFIG" />
                    <h2 className="productSelectionHeading">Processor Selection</h2>

                    <div className="productSelection">
                        <div className="categorySection">
                            <div className="productItems">
                                {renderProcessors()}
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );

    function renderProcessors() {
        return items.map((product) => (
          <div key={product.productid} className="productItem">
            <ProductCard product={product} />
            <button 
            disabled={!user}
            onClick={() => handleProcessorSelect(product)}>Select</button>
          </div>
        ));
      }
};

export default ProcessorSelection;
