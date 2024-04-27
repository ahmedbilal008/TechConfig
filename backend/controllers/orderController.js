const db = require("../database/database");

exports.newOrder = async (req, res) => {
    try {
        const {
            orderItems,
            paymentStatus,
            address,
            city,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            phone,
        } = req.body;

        const insertOrderQuery =
            'INSERT INTO Orders (UserID, ItemsPrice, TaxPrice, ShippingPrice, TotalPrice, OrderStatus, DeliveredAt, Address,City, PaymentStatus,Phone) VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9,$10,$11) RETURNING *';
        const insertOrderValues = [
            req.user.id, 
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            'Processing', 
            null, 
            address,
            city,
            paymentStatus,
            phone
        ];
        const orderResult = await db.query(insertOrderQuery, insertOrderValues);

        const orderId = orderResult.rows[0].orderid; 

        for (const orderItem of orderItems) {
            const insertOrderItemQuery =
                'INSERT INTO OrderItems (OrderID, ProductID, Quantity, Subtotal) VALUES ($1, $2, $3, $4) RETURNING *';
            const insertOrderItemValues = [
                orderId,
                orderItem.product, 
                orderItem.quantity,
                orderItem.price,
            ];
            await db.query(insertOrderItemQuery, insertOrderItemValues);
        }

        res.status(201).json({
            success: true,
            order: orderResult.rows[0],
        });
    } catch (error) {
        console.error('Error creating new order:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Get Single Order
exports.getSingleOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const getOrderQuery =
            `SELECT 
                o.*, 
                u.Username,
                u.Email,
                oi.Subtotal
            FROM Orders o 
            JOIN Users u ON o.UserID = u.UserID 
            JOIN OrderItems oi ON o.OrderID = oi.OrderID
            WHERE o.OrderID = $1`;

        const getOrderValues = [orderId];
        const orderResult = await db.query(getOrderQuery, getOrderValues);

        if (orderResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Order not found with this ID: ${orderId}`,
            });
        }

        const orderDetails = orderResult.rows[0];

        const getOrderItemsQuery =
            'SELECT  oi.Quantity,p.ProductID, p.ProductName, p.Price FROM OrderItems oi JOIN Products p ON oi.ProductID = p.ProductID WHERE OrderID = $1';
        const getOrderItemsValues = [orderId];
        const orderItemsResult = await db.query(getOrderItemsQuery, getOrderItemsValues);
        const orderItems = orderItemsResult.rows.map(item => ({
            productQuantity:item.quantity,
            productName: item.productname,
            productId: item.productid,
            productPrice: item.price,
        }));
        console.log('Order Items Result:', orderItems);

        const order = {
            ...orderDetails,
            orderItems,
        };

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Error getting single order:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


// Get logged in user orders
exports.myOrders = async (req, res) => {
    try {
        const userId = req.user.id; 
        const getOrdersQuery = 'SELECT * FROM Orders WHERE UserID = $1';
        const getOrdersValues = [userId];
        const ordersResult = await db.query(getOrdersQuery, getOrdersValues);

        res.status(200).json({
            success: true,
            orders: ordersResult.rows,
        });
    } catch (error) {
        console.error('Error getting user orders:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const getAllOrdersQuery = 'SELECT * FROM Orders';
        const getAllOrdersResult = await db.query(getAllOrdersQuery);

        const calculateTotalAmountQuery = 'SELECT SUM(TotalPrice) as totalamount FROM Orders';
        const calculateTotalAmountResult = await db.query(calculateTotalAmountQuery);

        const totalAmount = calculateTotalAmountResult.rows[0].totalamount || 0;

        res.status(200).json({
            success: true,
            totalAmount,
            orders: getAllOrdersResult.rows,
        });
    } catch (error) {
        console.error('Error getting all orders:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const getOrderQuery = 'SELECT * FROM Orders WHERE OrderID = $1';
        const getOrderValues = [orderId];
        const orderResult = await db.query(getOrderQuery, getOrderValues);

        if (orderResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Order not found with this ID: ${orderId}`,
            });
        }

        const order = orderResult.rows[0];

        if (order.orderstatus === 'Delivered') {
            return res.status(400).json({
                success: false,
                message: 'You have already delivered this order',
            });
        }

        if (req.body.status === 'Shipped') {
            const getOrderItemsQuery = 'SELECT * FROM OrderItems WHERE OrderID = $1';
            const getOrderItemsValues = [orderId];
            const orderItemsResult = await db.query(getOrderItemsQuery, getOrderItemsValues);

            for (const orderItem of orderItemsResult.rows) {
                await updateStock(orderItem.productid, orderItem.quantity);
            }
        }

        const updateOrderQuery = 'UPDATE Orders SET OrderStatus = $1, DeliveredAt = $2 WHERE OrderID = $3';
        const updateOrderValues = [req.body.status, req.body.status === 'Delivered' ? new Date() : null, orderId];
        await db.query(updateOrderQuery, updateOrderValues);

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

async function updateStock(productId, quantity) {
    const getProductQuery = 'SELECT * FROM Products WHERE ProductID = $1';
    const getProductValues = [productId];
    const productResult = await db.query(getProductQuery, getProductValues);

    if (productResult.rows.length > 0) {
        const product = productResult.rows[0];
        const updateStockQuery = 'UPDATE Products SET StockQuantity = StockQuantity - $1 WHERE ProductID = $2';
        const updateStockValues = [quantity, productId];
        await db.query(updateStockQuery, updateStockValues);
    }
}
