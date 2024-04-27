import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "../Admin/ProductReviews.css";
import { useSelector, useDispatch } from "react-redux";
import {
    clearErrors,
    getUserReviews,
    deleteReviews,
} from "../../actions/productAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import DeleteIcon from "@material-ui/icons/Delete";
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";

const ProductReviews = ({ history }) => {
    const dispatch = useDispatch();

    const alert = useAlert();

    const { user } = useSelector(
        (state) => state.user
    );
    const { error: deleteError, isDeleted } = useSelector(
        (state) => state.review
    );

    const { error, reviews, loading } = useSelector(
        (state) => state.productReviews
    );

    const deleteReviewHandler = (reviewId) => {
        dispatch(deleteReviews(reviewId));
    };

    const productReviewsSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(getUserReviews(user.userid));
    };

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            alert.success("Review Deleted Successfully");
            history.push("/account");
            dispatch({ type: DELETE_REVIEW_RESET });
        }
    }, [dispatch, alert, error, deleteError, history, isDeleted]);

    const columns = [
        { field: "id", headerName: "Review ID", minWidth: 100, flex: 0.5 },

        {
            field: "product",
            headerName: "product",
            minWidth: 100,
            flex: 0.6,
        },

        {
            field: "comment",
            headerName: "Comment",
            minWidth: 150,
            flex: 1,
        },

        {
            field: "rating",
            headerName: "Rating",
            type: "number",
            minWidth: 100,
            flex: 0.4,

            cellClassName: (params) => {
                return params.getValue(params.id, "rating") >= 3
                    ? "greenColor"
                    : "redColor";
            },
        },

        {
            field: "actions",
            flex: 0.3,
            headerName: "Actions",
            minWidth: 100,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Button
                            onClick={() =>
                                deleteReviewHandler(params.getValue(params.id, "id"))
                            }
                        >
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                );
            },
        },
    ];

    const rows = [];

    reviews &&
        reviews.forEach((item) => {
            rows.push({
                id: item.reviewid,
                rating: item.rating,
                comment: item.reviewtext,
                product: item.name,
            });
        });

    return (
        <Fragment>
            <MetaData title={`ALL REVIEWS - User`} />

            <div className="dashboard">
                <div className="productReviewsContainer">
                    <form
                        className="productReviewsForm"
                        onSubmit={productReviewsSubmitHandler}
                    >
                        <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>
                        <Button
                            id="createProductBtn"
                            type="submit"
                        >
                            Show all reviews
                        </Button>
                    </form>

                    {reviews && reviews.length > 0 ? (
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            disableSelectionOnClick
                            className="productListTable"
                            autoHeight
                        />
                    ) : (
                        <h1 className="productReviewsFormHeading">No Reviews Found</h1>
                    )}
                </div>
            </div>
        </Fragment>
    );
};

export default ProductReviews;