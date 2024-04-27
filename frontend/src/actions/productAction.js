import axios from "axios";

import {
    ALL_PRODUCT_FAIL,
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ADMIN_PRODUCT_REQUEST,
    ADMIN_PRODUCT_SUCCESS,
    ADMIN_PRODUCT_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_SUCCESS,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    ALL_REVIEW_REQUEST,
    ALL_REVIEW_SUCCESS,
    ALL_REVIEW_FAIL,
    USER_REVIEW_REQUEST,
    USER_REVIEW_SUCCESS,
    USER_REVIEW_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
    ALL_PROCESSORS_REQUEST,
    ALL_PROCESSORS_SUCCESS,
    ALL_PROCESSORS_FAILURE,
    ALL_GRAPHIC_CARDS_REQUEST,
    ALL_GRAPHIC_CARDS_SUCCESS,
    ALL_GRAPHIC_CARDS_FAILURE,
    COMPATIBLE_MOTHERBOARDS_REQUEST,
    COMPATIBLE_MOTHERBOARDS_SUCCESS,
    COMPATIBLE_MOTHERBOARDS_FAILURE,
    COMPATIBLE_RAM_REQUEST,
    COMPATIBLE_RAM_SUCCESS,
    COMPATIBLE_RAM_FAILURE,
    COMPATIBLE_STORAGE_REQUEST,
    COMPATIBLE_STORAGE_SUCCESS,
    COMPATIBLE_STORAGE_FAILURE,
    CLEAR_ERRORS,
} from "../constants/productConstants";

// Get All Products
export const getProduct = (keyword = "", currentPage = 1, category) =>
    async (dispatch) => {
        try {
            dispatch({ type: ALL_PRODUCT_REQUEST });

            let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}`;

            if (category) {
                link = `/api/v1/products?keyword=${keyword}&category=${category}&page=${currentPage}`;
            }
            console.log(link);

            const { data } = await axios.get(link);

            dispatch({
                type: ALL_PRODUCT_SUCCESS,
                payload: data,
            });
        } catch (error) {
            dispatch({
                type: ALL_PRODUCT_FAIL,
                payload: error.response.data.message,
            });
        }
    };

//Get All Products For Admin
export const getAdminProduct = () => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_PRODUCT_REQUEST });

        const { data } = await axios.get("/api/v1/admin/products");

        dispatch({
            type: ADMIN_PRODUCT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ADMIN_PRODUCT_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Create Product
export const createProduct = (productData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_PRODUCT_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
        };

        const { data } = await axios.post(
            `/api/v1/admin/product/new`,
            productData,
            config
        );

        dispatch({
            type: NEW_PRODUCT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: NEW_PRODUCT_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Update Product
export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PRODUCT_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
        };

        const { data } = await axios.put(
            `/api/v1/admin/product/${id}`,
            productData,
            config
        );

        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Delete Product
export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_PRODUCT_REQUEST });

        const { data } = await axios.delete(`/api/v1/admin/product/${id}`);

        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Get Products Details
export const getProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        const { data } = await axios.get(`/api/v1/product/${id}`);

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product,
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// NEW REVIEW
export const newReview = (reviewData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_REVIEW_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
        };

        const { data } = await axios.put(`/api/v1/review`, reviewData, config);

        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Get All Reviews of a Product
export const getAllReviews = (id) => async (dispatch) => {
    try {
        dispatch({ type: ALL_REVIEW_REQUEST });

        const { data } = await axios.get(`/api/v1/reviews?id=${id}`);

        dispatch({
            type: ALL_REVIEW_SUCCESS,
            payload: data.reviews,
        });
    } catch (error) {
        dispatch({
            type: ALL_REVIEW_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Get All Reviews of a User
export const getUserReviews = (id) => async (dispatch) => {
    try {
        dispatch({ type: USER_REVIEW_REQUEST });

        const { data } = await axios.get(`/api/v1/review/user?id=${id}`);

        dispatch({
            type: USER_REVIEW_SUCCESS,
            payload: data.reviews,
        });
    } catch (error) {
        dispatch({
            type: USER_REVIEW_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Delete Review of a Product
export const deleteReviews = (reviewId) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_REVIEW_REQUEST });

        const { data } = await axios.delete(
            `/api/v1/reviews?id=${reviewId}`
        );

        dispatch({
            type: DELETE_REVIEW_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: DELETE_REVIEW_FAIL,
            payload: error.response.data.message,
        });
    }
};


// Fetch All Processors
export const fetchAllProcessors = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_PROCESSORS_REQUEST });

        const { data } = await axios.get('/api/v1/product/processors');

        dispatch({
            type: ALL_PROCESSORS_SUCCESS,
            payload: data.processors,
        });
    } catch (error) {
        dispatch({
            type: ALL_PROCESSORS_FAILURE,
            payload: error.response.data.message,
        });
    }
};

// Fetch All Graphic Cards
export const fetchAllGraphicCards = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_GRAPHIC_CARDS_REQUEST });

        const { data } = await axios.get('/api/v1/product/graphiccard');

        dispatch({
            type: ALL_GRAPHIC_CARDS_SUCCESS,
            payload: data.graphicCards,
        });
    } catch (error) {
        dispatch({
            type: ALL_GRAPHIC_CARDS_FAILURE,
            payload: error.response.data.message,
        });
    }
};

// Fetch Motherboards Compatible with Processor and Graphic Card
export const fetchCompatibleMotherboards = (processorId, graphicCardId) => async (dispatch) => {
    try {
        dispatch({ type: COMPATIBLE_MOTHERBOARDS_REQUEST });
        const config = {
            headers: { "Content-Type": "application/json" },
        };
        const url = `/api/v1/product/motherboard?processorId=${processorId}&graphicCardId=${graphicCardId}`;
        const { data } = await axios.get(url, config);

        dispatch({
            type: COMPATIBLE_MOTHERBOARDS_SUCCESS,
            payload: data.motherboards,
        });
    } catch (error) {
        dispatch({
            type: COMPATIBLE_MOTHERBOARDS_FAILURE,
            payload: error.response.data.message,
        });
    }
};

// Fetch RAM Modules Compatible with Motherboard
export const fetchCompatibleRAMs = (motherboardId) => async (dispatch) => {
    try {
        dispatch({ type: COMPATIBLE_RAM_REQUEST });
        const config = {
            headers: { "Content-Type": "application/json" },
        };
        const { data } = await axios.get(`/api/v1/product/ram?motherboardId=${motherboardId}`, config);

        dispatch({
            type: COMPATIBLE_RAM_SUCCESS,
            payload: data.rams,
        });
    } catch (error) {
        dispatch({
            type: COMPATIBLE_RAM_FAILURE,
            payload: error.response.data.message,
        });
    }
};

// Fetch Storage Devices Compatible with Motherboard
export const fetchCompatibleStorage = (motherboardId) => async (dispatch) => {
    try {
        dispatch({ type: COMPATIBLE_STORAGE_REQUEST });
        const config = {
            headers: { "Content-Type": "application/json" },
        };
        const { data } = await axios.get(`/api/v1/product/storage?motherboardId=${motherboardId}`, config);

        dispatch({
            type: COMPATIBLE_STORAGE_SUCCESS,
            payload: data.storageDevices,
        });
    } catch (error) {
        dispatch({
            type: COMPATIBLE_STORAGE_FAILURE,
            payload: error.response.data.message,
        });
    }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};