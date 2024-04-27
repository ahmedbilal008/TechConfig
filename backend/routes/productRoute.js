const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview, getAdminProducts, getAllProcessors, getAllGraphicCards, getCompatibleMotherboards, getCompatibleRAMs, getCompatibleStorage, getUserReviews } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../controllers/functionController");

const router = express.Router();
router
    .route("/admin/products").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts)
router
    .route("/products").get(getAllProducts);
router
    .route("/product/processors").get(getAllProcessors);
router
    .route("/product/graphiccard").get(getAllGraphicCards);
router
    .route("/product/motherboard").get(getCompatibleMotherboards);
router
    .route("/product/ram").get(getCompatibleRAMs);
router
    .route("/product/storage").get(getCompatibleStorage);
router
    .route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router
    .route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
router
    .route("/product/:id").get(getProductDetails);
router
    .route("/review").put(isAuthenticatedUser, createProductReview);
router
    .route("/review/user").get(getUserReviews);
router
    .route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview);

module.exports = router