import React, { Fragment, useEffect, useState } from "react";
import "./ProductSelection.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, fetchAllProcessors, fetchAllGraphicCards, fetchCompatibleMotherboards, fetchCompatibleRAMs, fetchCompatibleStorage } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";

const ProductSelection = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const [selectedProcessor, setSelectedProcessor] = useState(null);
    const [selectedGraphicCard, setSelectedGraphicCard] = useState(null);
    const [selectedMotherboard, setSelectedMotherboard] = useState(null);
    const [selectedRAM, setSelectedRAM] = useState(null);
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [step,setStep]=useState(1);

    const {
        processors,
        graphicCards,
        compatibleMotherboards,
        compatibleRAMs,
        compatibleStorage,
        loading,
        error,
      } = useSelector((state) => ({
        processors: state.processors,
        graphicCards: state.graphicCards,
        compatibleMotherboards: state.compatibleMotherboards,
        compatibleRAMs: state.compatibleRAMs,
        compatibleStorage: state.compatibleStorage,
        loading: state.loading,
        error: state.error,
      }));

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(fetchAllProcessors());
        if(step === 2){
            dispatch(fetchAllGraphicCards());
        }
    }, [dispatch, alert, error]);

    const handleProcessorSelect = (processor) => {
        setSelectedProcessor(processor);
        setStep(2);
    };

    const handleGraphicCardSelect = (graphicCard) => {
        setSelectedGraphicCard(graphicCard);
        setStep(3);
    };
    const handleMotherboardSelect = (motherboard) => {
        setSelectedMotherboard(motherboard);
        setStep(4);
    };
    const handleRAMSelect = (ram) => {
        setSelectedRAM(ram);
        setStep(5);
    };
    const handleStorageSelect = (storage) => {
        setSelectedStorage(storage);
    };

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title="Build Your PC --TECHCONFIG" />
                    <h2 className="productSelectionHeading">Component Selection</h2>

                    <div className="productSelection">
                        <div className="categorySection">
                            {(() => {
                                switch (step) {
                                    case 1:
                                        return (
                                            <div className="productItems">
                                                {renderProcessors()}
                                            </div>
                                        );
                                    case 2:
                                        return (
                                            <div className="productItems">
                                                {renderGraphicCards()}
                                            </div>
                                        );
                                    case 3:
                                        return (
                                            <div className="productItems">
                                                {renderMotherboards()}
                                            </div>
                                        );
                                    case 4:
                                        return (
                                            <div className="productItems">
                                                {renderRAMs()}
                                            </div>
                                        );
                                    case 5:
                                        return (
                                            <div className="productItems">
                                                {renderStorages()}
                                            </div>
                                        );
                                    default:
                                        return null;
                                }
                            })()}
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );

    function renderProcessors() {
        return processors.map((product) => (
            <ProductCard
                key={product.productid}
                product={product}
                onSelect={() => handleProcessorSelect(product)}
            />
        ));
    }

        function renderGraphicCards() {
            return graphicCards.map((product) => (
                <ProductCard
                    key={product.productid}
                    product={product}
                    onSelect={() => handleGraphicCardSelect(product)}
                />
            ));
        }

        function renderMotherboards() {
            return compatibleMotherboards.map((product) => (
                <ProductCard
                    key={product.productid}
                    product={product}
                    onSelect={() => handleMotherboardSelect(product)}
                />
            ));
        }

        function renderRAMs() {
            return compatibleRAMs.map((product) => (
                <ProductCard
                    key={product.productid}
                    product={product}
                    onSelect={() => handleRAMSelect(product)} />
            ));
        }

        function renderStorages() {
            return compatibleStorage.map((product) => (
                <ProductCard
                    key={product.productid}
                    product={product}
                    onSelect={() => handleStorageSelect(product)} />
            ));
        }
};

export default ProductSelection;
