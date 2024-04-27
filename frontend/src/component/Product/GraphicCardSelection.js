import React, { Fragment, useEffect, useState } from "react";
import "./ProductSelection.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors,fetchAllGraphicCards} from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";

const GraphicCardSelection = ({history}) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const [selectedGraphicCard, setSelectedGraphicCard] = useState(null);
    
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
        dispatch(fetchAllGraphicCards());
    }, [dispatch, alert, error]);


    const handleGraphicCardSelect = (graphicCard) => {
        setSelectedGraphicCard(graphicCard);
        localStorage.setItem('selectedGraphicCardId', graphicCard.productid);
        history.push("/motherboard/selection");
    };

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title="Build Your PC --TECHCONFIG" />
                    <h2 className="productSelectionHeading">Graphic Card Selection</h2>

                    <div className="productSelection">
                        <div className="categorySection">
                            <div className="productItems">
                                {renderGraphicCards()}
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );


    function renderGraphicCards() {
        return items.map((product) => (
            <div key={product.productid} className="productItem">
            <ProductCard product={product} />
            <button onClick={() => handleGraphicCardSelect(product)}>Select</button>
          </div>
        ));
    }

};

export default GraphicCardSelection;
