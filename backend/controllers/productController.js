const db = require("../database/database");
const ApiFeatures = require('../apifeatures');
const cloudinary = require("cloudinary");

exports.getAllProducts = async (req, res) => {
  const resultPerPage = 12;
  try {
    let query = ["SELECT * FROM Products"];
    const apiFeatures = new ApiFeatures(query, req.query);
    apiFeatures.filter().search().pagination(resultPerPage);
    query = apiFeatures.query.join(' ');
    const products = await db.query(query);

    let query_count = "SELECT COUNT(ProductID) AS count FROM Products";
    const productsCount = await db.query(query_count);
    const filteredProductsCount = products.rowCount;
    res.json({
      status: "success",
      products: products.rows,
      productsCount: productsCount.rows[0].count,
      resultPerPage,
      filteredProductsCount,

    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAdminProducts = async (req, res) => {
  try {
    let query = "SELECT * FROM Products";
    const products = await db.query(query);
    res.json({
      status: "success",
      products: products.rows,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment, productId, userid } = req.body;

    const review = {
      userId: userid,
      rating: Number(rating),
      reviewText: comment,
    };

    const findProductQuery = 'SELECT * FROM Products WHERE ProductID = $1';
    const findProductResult = await db.query(findProductQuery, [productId]);

    if (findProductResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const findReviewQuery = 'SELECT * FROM ReviewsAndRatings WHERE ProductID = $1 AND UserID = $2';
    const findReviewResult = await db.query(findReviewQuery, [productId, review.userId]);

    if (findReviewResult.rows.length > 0) {
      const updateReviewQuery = 'UPDATE ReviewsAndRatings SET Rating = $1, ReviewText = $2 WHERE ProductID = $3 AND UserID = $4';
      const updateReviewValues = [review.rating, review.reviewText, productId, review.userId];
      await db.query(updateReviewQuery, updateReviewValues);
    } else {
      const insertReviewQuery = 'INSERT INTO ReviewsAndRatings (ProductID, UserID, Rating, ReviewText, ReviewDate) VALUES ($1, $2, $3, $4, CURRENT_DATE)';
      const insertReviewValues = [productId, review.userId, review.rating, review.reviewText];
      await db.query(insertReviewQuery, insertReviewValues);
    }

    const calculateAvgRatingQuery = 'SELECT AVG(Rating) as averagerating FROM ReviewsAndRatings WHERE ProductID = $1';
    const calculateAvgRatingValues = [productId];
    const avgRatingResult = await db.query(calculateAvgRatingQuery, calculateAvgRatingValues);

    const newAvgRating = avgRatingResult.rows[0].averagerating;
    const updateProductQuery = 'UPDATE Products SET Ratings = $1 WHERE ProductID = $2';
    const updateProductValues = [newAvgRating, productId];
    await db.query(updateProductQuery, updateProductValues);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error('Error creating/updating product review:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};


exports.getProductReviews = async (req, res) => {
  try {
    const productId = req.query.id;
    const getProductReviewsQuery =
      ` SELECT ReviewsAndRatings.*, Users.Username AS name
        FROM ReviewsAndRatings
        JOIN Users ON ReviewsAndRatings.UserID = Users.UserID
        WHERE ReviewsAndRatings.ProductID = $1`;
    const getProductReviewsResult = await db.query(getProductReviewsQuery, [productId]);

    if (!getProductReviewsResult.rows || getProductReviewsResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No reviews found for the product',
      });
    }
    return res.status(200).json({
      success: true,
      reviews: getProductReviewsResult.rows,
    });
  } catch (error) {
    console.error('Error getting product reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.query.id;
    console.log(userId);
    const getUserReviewsQuery =
      ` SELECT ReviewsAndRatings.*, Products.ProductName AS name
        FROM ReviewsAndRatings
        JOIN Products ON ReviewsAndRatings.ProductID = Products.ProductID
        WHERE ReviewsAndRatings.UserID = $1`;
    const getUserReviewsResult = await db.query(getUserReviewsQuery, [userId]);
    if (!getUserReviewsResult.rows || getUserReviewsResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No reviews found by the user',
      });
    }
    return res.status(200).json({
      success: true,
      reviews: getUserReviewsResult.rows,
    });
  } catch (error) {
    console.error('Error getting product reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.query.id;
    const checkProductQuery = 'SELECT * FROM ReviewsAndRatings WHERE ReviewID = $1';
    const checkProductResult = await db.query(checkProductQuery, [reviewId]);

    if (!checkProductResult.rows || checkProductResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const productId = checkProductResult.productid;

    const deleteReviewQuery = 'DELETE FROM ReviewsAndRatings WHERE ReviewID = $1';
    await db.query(deleteReviewQuery, [reviewId]);
    const calculateAvgRatingQuery = 'SELECT AVG(Rating) as averagerating FROM ReviewsAndRatings WHERE ProductID = $1';
    const calculateAvgRatingValues = [productId];
    const avgRatingResult = await db.query(calculateAvgRatingQuery, calculateAvgRatingValues);

    const newAvgRating = avgRatingResult.rows[0].averagerating || 0;
    const updateProductQuery = 'UPDATE Products SET Ratings = $1 WHERE ProductID = $2';
    const updateProductValues = [newAvgRating, productId];
    await db.query(updateProductQuery, updateProductValues);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting product review:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};




exports.createProduct = async (req, res) => {
  const { productname, description, category, price, stockquantity, manufacturer, socketType, slotType, ramSlots, interfaceType } = req.body;

  try {
  
    const insertProductQuery = 'INSERT INTO Products (ProductName, Description, Category, Price, StockQuantity, Manufacturer) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const insertProductValues = [productname, description, category, price, stockquantity, manufacturer];
    const result = await db.query(insertProductQuery, insertProductValues);
    const createdProduct = result.rows[0];
    const productId = createdProduct.productid;
    console.log(req.body.images);

    let images_arr = [];
    if (typeof req.body.images === "string") {
      images_arr.push(req.body.images);
    }
    else {
      //images_arr = images;
      images_arr = Array.isArray(req.body.images[0]) ? req.body.images.flat() : req.body.images;
    }
    const imagesLink = [];
    for (let i = 0; i < images_arr.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images_arr[i], {
        folder: "products",
      });
      imagesLink.push({
        public_id: result.public_id,
        url: result.secure_url,
      })
    }
    if (imagesLink && images_arr.length > 0) {
      const insertImageQuery = 'UPDATE Products SET ImageURL = $2 WHERE ProductID = $1 RETURNING *';
      const firstImage = imagesLink[0];
      const insertImageValues = [productId, firstImage.url];
      await db.query(insertImageQuery, insertImageValues);
      const insertImagesQuery = 'INSERT INTO ProductImages (ProductID, URL, PublicId) VALUES ($1, $2,$3) RETURNING *';

      for (const image of imagesLink) {
        const insertImagesValues = [productId, image.url, image.public_id];
        await db.query(insertImagesQuery, insertImagesValues);
      }
    }


    // Insert category-specific attributes into corresponding tables
    switch (category) {
      case 'Processor':
        await insertProcessorAttributes(productId, socketType);
        await checkAndInsertProcessorCompatibility(productId);
        break;
      case 'GraphicCard':
        await insertGraphicCardAttributes(productId, slotType);
        await checkAndInsertGraphicCardCompatibility(productId);
        break;
      case 'Motherboard':
        await insertMotherboardAttributes(productId, socketType, slotType, ramSlots, interfaceType);
        await checkAndInsertMotherboardCompatibility(productId);
        break;
      case 'RAM':
        await insertRAMAttributes(productId, ramSlots);
        await checkAndInsertRAMCompatibility(productId);
        break;
      case 'Storage':
        await insertStorageAttributes(productId, interfaceType);
        await checkAndInsertStorageCompatibility(productId);
        break;
      default:
        break;
    }

    res.json({
      success: true,
      product: createdProduct,
      images: imagesLink,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Function to insert Processor attributes
async function insertProcessorAttributes(productId, socketType) {
  const insertProcessorQuery = 'INSERT INTO Processors (ProductID, SocketType) VALUES ($1, $2) RETURNING *';
  const insertProcessorValues = [productId, socketType];
  await db.query(insertProcessorQuery, insertProcessorValues);
}

// Function to insert GraphicCard attributes
async function insertGraphicCardAttributes(productId, slotType) {
  const insertGraphicCardQuery = 'INSERT INTO GraphicCards (ProductID, SlotType) VALUES ($1, $2) RETURNING *';
  const insertGraphicCardValues = [productId, slotType];
  await db.query(insertGraphicCardQuery, insertGraphicCardValues);
}

// Function to insert Motherboard attributes
async function insertMotherboardAttributes(productId, socketType, slotType, ramSlots, interfaceType) {
  const insertMotherboardQuery = 'INSERT INTO Motherboards (ProductID, SocketType, SlotType, RAMSlots, InterfaceType) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const insertMotherboardValues = [productId, socketType, slotType, ramSlots, interfaceType];
  const data = await db.query(insertMotherboardQuery, insertMotherboardValues);
  console.log(data.rows);
}

// Function to insert RAM attributes
async function insertRAMAttributes(productId, ramSlots) {
  const insertRAMQuery = 'INSERT INTO RAM (ProductID, RAMSlots) VALUES ($1, $2) RETURNING *';
  const insertRAMValues = [productId, ramSlots];
  await db.query(insertRAMQuery, insertRAMValues);
}

// Function to insert Storage attributes
async function insertStorageAttributes(productId, interfaceType) {
  const insertStorageQuery = 'INSERT INTO Storage (ProductID, InterfaceType) VALUES ($1, $2) RETURNING *';
  const insertStorageValues = [productId, interfaceType];
  await db.query(insertStorageQuery, insertStorageValues);
}



async function checkAndInsertProcessorCompatibility(productId) {
  // Retrieve the socket type of the processor
  const processorQuery = 'SELECT SocketType FROM Processors WHERE ProductID = $1';
  const processorValues = [productId];
  const processorResult = await db.query(processorQuery, processorValues);

  if (processorResult.rows.length === 0) {
    console.error('Processor not found with ID:', productId);
    return;
  }

  const processorSocketType = processorResult.rows[0].sockettype;

  // Retrieve all motherboards from the database
  const motherboardsQuery = 'SELECT ProductID, SocketType FROM Motherboards';
  const motherboardsResult = await db.query(motherboardsQuery);

  for (const motherboard of motherboardsResult.rows) {
    // Check compatibility between the processor and the motherboard
    const isCompatible = processorSocketType === motherboard.sockettype;

    if (isCompatible) {
      // Insert compatibility entry into the Compatibility table
      await insertCompatibilityEntry(productId, motherboard.productid);
    }
  }
}

async function checkAndInsertGraphicCardCompatibility(productId) {
  // Retrieve the slot type of the graphic card
  const graphicCardQuery = 'SELECT SlotType FROM GraphicCards WHERE ProductID = $1';
  const graphicCardValues = [productId];
  const graphicCardResult = await db.query(graphicCardQuery, graphicCardValues);

  if (graphicCardResult.rows.length === 0) {
    console.error('Graphic Card not found with ID:', productId);
    return;
  }

  const graphicCardSlotType = graphicCardResult.rows[0].slottype;

  // Retrieve all motherboards from the database
  const motherboardsQuery = 'SELECT ProductID, SlotType FROM Motherboards';
  const motherboardsResult = await db.query(motherboardsQuery);

  for (const motherboard of motherboardsResult.rows) {
    // Check compatibility between the graphic card and the motherboard
    const isCompatible = graphicCardSlotType === motherboard.slottype;

    if (isCompatible) {
      // Insert compatibility entry into the Compatibility table
      await insertCompatibilityEntry(productId, motherboard.productid);
    }
  }
}

async function checkAndInsertMotherboardCompatibility(productId) {
  // Retrieve the attributes of the motherboard
  const motherboardQuery = 'SELECT SocketType, SlotType, RAMSlots, InterfaceType FROM Motherboards WHERE ProductID = $1';
  const motherboardValues = [productId];
  const motherboardResult = await db.query(motherboardQuery, motherboardValues);

  if (motherboardResult.rows.length === 0) {
    console.error('Motherboard not found with ID:', productId);
    return;
  }

  const { sockettype, slottype, ramslots, interfacetype } = motherboardResult.rows[0];

  // Retrieve all processors from the database
  const processorsQuery = 'SELECT ProductID, SocketType FROM Processors';
  const processorsResult = await db.query(processorsQuery);

  for (const processor of processorsResult.rows) {
    // Check compatibility between the processor and the motherboard
    const isCompatible = sockettype === processor.sockettype;

    if (isCompatible) {
      // Insert compatibility entry into the Compatibility table
      await insertCompatibilityEntry(processor.productid, productId);
    }
  }

  // Retrieve all graphic cards from the database
  const graphicCardsQuery = 'SELECT ProductID, SlotType FROM GraphicCards';
  const graphicCardsResult = await db.query(graphicCardsQuery);

  for (const graphicCard of graphicCardsResult.rows) {
    // Check compatibility between the graphic card and the motherboard
    const isCompatible = slottype === graphicCard.slottype;

    if (isCompatible) {
      // Insert compatibility entry into the Compatibility table
      await insertCompatibilityEntry(graphicCard.productid, productId);
    }
  }

  // Retrieve all RAM modules from the database
  const ramQuery = 'SELECT ProductID, RAMSlots FROM RAM';
  const ramResult = await db.query(ramQuery);

  for (const ram of ramResult.rows) {
    // Check compatibility between the RAM and the motherboard
    const isCompatible = ramslots >= ram.ramslots;

    if (isCompatible) {
      // Insert compatibility entry into the Compatibility table
      await insertCompatibilityEntry(ram.productid, productId);
    }
  }

  // Retrieve all storage devices from the database
  const storageQuery = 'SELECT ProductID, InterfaceType FROM Storage';
  const storageResult = await db.query(storageQuery);

  for (const storage of storageResult.rows) {
    // Check compatibility between the storage device and the motherboard
    const isCompatible = interfacetype === storage.interfacetype;

    if (isCompatible) {
      // Insert compatibility entry into the Compatibility table
      await insertCompatibilityEntry(storage.productid, productId);
    }
  }
}

async function checkAndInsertRAMCompatibility(productId) {
  // Retrieve the RAM slots of the RAM module
  const ramQuery = 'SELECT RAMSlots FROM RAM WHERE ProductID = $1';
  const ramValues = [productId];
  const ramResult = await db.query(ramQuery, ramValues);

  if (ramResult.rows.length === 0) {
    console.error('RAM module not found with ID:', productId);
    return;
  }

  const ramSlots = ramResult.rows[0].ramslots;

  // Retrieve all motherboards from the database
  const motherboardsQuery = 'SELECT ProductID, RAMSlots FROM Motherboards';
  const motherboardsResult = await db.query(motherboardsQuery);

  for (const motherboard of motherboardsResult.rows) {
    // Check compatibility between the RAM module and the motherboard
    const isCompatible = ramSlots <= motherboard.ramslots;

    if (isCompatible) {
      // Insert compatibility entry into the Compatibility table
      await insertCompatibilityEntry(productId, motherboard.productid);
    }
  }
}

async function checkAndInsertStorageCompatibility(productId) {
  // Retrieve the interface type of the storage device
  const storageQuery = 'SELECT InterfaceType FROM Storage WHERE ProductID = $1';
  const storageValues = [productId];
  const storageResult = await db.query(storageQuery, storageValues);

  if (storageResult.rows.length === 0) {
    console.error('Storage device not found with ID:', productId);
    return;
  }

  const interfaceType = storageResult.rows[0].interfacetype;

  // Retrieve all motherboards from the database
  const motherboardsQuery = 'SELECT ProductID, InterfaceType FROM Motherboards';
  const motherboardsResult = await db.query(motherboardsQuery);

  for (const motherboard of motherboardsResult.rows) {
    // Check compatibility between the storage device and the motherboard
    const isCompatible = interfaceType === motherboard.interfacetype;

    if (isCompatible) {
      // Insert compatibility entry into the Compatibility table
      await insertCompatibilityEntry(productId, motherboard.productid);
    }
  }
}

async function insertCompatibilityEntry(productID1, productID2) {
  // Check if the entry already exists (either direction)
  const checkCompatibilityQuery = 'SELECT * FROM Compatibility WHERE (ProductID1 = $1 AND ProductID2 = $2) OR (ProductID1 = $2 AND ProductID2 = $1)';
  const checkCompatibilityValues = [productID1, productID2];
  const compatibilityCheckResult = await db.query(checkCompatibilityQuery, checkCompatibilityValues);

  // If the entry doesn't exist, insert it
  if (compatibilityCheckResult.rows.length === 0) {
    const insertCompatibilityQuery = 'INSERT INTO Compatibility (ProductID1, ProductID2) VALUES ($1, $2) RETURNING *';
    const insertCompatibilityValues = [productID1, productID2];
    await db.query(insertCompatibilityQuery, insertCompatibilityValues);
  }
}

exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { productname, description, category, price, stockquantity, manufacturer } = req.body;

  try {
    const updateProductQuery = `
      UPDATE Products
      SET
        ProductName = $2,
        Description = $3,
        Category = $4,
        Price = $5,
        StockQuantity = $6,
        Manufacturer = $7
      WHERE ProductID = $1
      RETURNING *;
    `;
    const updateProductValues = [productId, productname, description, category, price, stockquantity, manufacturer];
    const updatedProductResult = await db.query(updateProductQuery, updateProductValues);
    const updatedProduct = updatedProductResult.rows[0];
    if (req.body.images) {
      let images_arr = [];
      if (typeof req.body.images === "string") {
        images_arr.push(req.body.images);
      }
      else {
        //images_arr = images;
        images_arr = Array.isArray(req.body.images[0]) ? req.body.images.flat() : req.body.images;
      }

      if (images_arr !== undefined) {
        const getPublicIdsQuery = 'SELECT PublicId FROM ProductImages WHERE ProductID = $1';
        const publicIdsResult = await db.query(getPublicIdsQuery, [productId]);
        let publicIds = [];

        if (publicIdsResult.rows.length > 0) {
          publicIds = publicIdsResult.rows.map(row => row.publicid);
        } else {
          console.log('No public IDs found for the specified product.');
        }
        const deleteImagesFromCloudinary = async () => {
          for (const publicId of publicIds) {
            await cloudinary.v2.uploader.destroy(publicId);
          }
        };
        await deleteImagesFromCloudinary();

        const deleteImagesQuery = 'DELETE FROM ProductImages WHERE ProductID = $1';
        await db.query(deleteImagesQuery, [productId]);
      }

      const imagesLink = [];
      for (let i = 0; i < images_arr.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images_arr[i], {
          folder: "products",
        });
        imagesLink.push({
          public_id: result.public_id,
          url: result.secure_url,
        })
      }

      if (imagesLink && images_arr.length > 0) {
        const insertImageQuery = 'UPDATE Products SET ImageURL = $2 WHERE ProductID = $1 RETURNING *';
        const firstImage = imagesLink[0];
        const insertImageValues = [productId, firstImage.url];
        await db.query(insertImageQuery, insertImageValues);
        const insertImagesQuery = 'INSERT INTO ProductImages (ProductID, URL, PublicId) VALUES ($1, $2,$3) RETURNING *';

        for (const image of imagesLink) {
          const insertImagesValues = [productId, image.url, image.public_id];
          await db.query(insertImagesQuery, insertImagesValues);
        }
      }
    }
    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {

    const stockquantity = 0;
    const deleteProductQuery = `
    UPDATE Products
    SET StockQuantity = $2 WHERE ProductID = $1 RETURNING *;`;
    const deleteProductValues = [productId, stockquantity];
    const deleteProductResult = await db.query(deleteProductQuery, deleteProductValues);

    if (deleteProductResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Product deleted',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.getProductDetails = async (req, res) => {
  const productId = req.params.id;

  try {
    const getProductQuery = 'SELECT * FROM Products WHERE ProductID = $1';
    const getProductResult = await db.query(getProductQuery, [productId]);

    if (getProductResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const product = getProductResult.rows[0];
    const getImagesQuery = 'SELECT * FROM ProductImages WHERE ProductID = $1';
    const getImagesResult = await db.query(getImagesQuery, [productId]);
    const images = getImagesResult.rows;

    const getProductReviewsQuery = 'SELECT * FROM ReviewsAndRatings WHERE ProductID = $1';
    const getProductReviewsResult = await db.query(getProductReviewsQuery, [productId]);
    const reviews = getProductReviewsResult.rows;

    res.status(200).json({
      success: true,
      product: {
        ...product,
        images,
        reviews,
      },
    });
  } catch (error) {
    console.error('Error getting product details:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


// Function to retrieve all processors
exports.getAllProcessors = async (req, res) => {
  try {
    const query = "SELECT * FROM Products WHERE Category = 'Processor'";
    const processors = await db.query(query);
    res.json({
      status: 'success',
      processors: processors.rows,
    });
  } catch (error) {
    console.error('Error fetching processors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to retrieve all graphic cards
exports.getAllGraphicCards = async (req, res) => {
  try {
    const query = "SELECT * FROM Products WHERE Category = 'GraphicCard'";
    const graphicCards = await db.query(query);
    res.json({
      status: 'success',
      graphicCards: graphicCards.rows,
    });
  } catch (error) {
    console.error('Error fetching graphic cards:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to retrieve all motherboards compatible with the selected processor and graphic card
exports.getCompatibleMotherboards = async (req, res) => {
  const { processorId, graphicCardId } = req.query;

  try {
    const motherboardQuery = `
    SELECT Products.*
    FROM Products
    WHERE Category = 'Motherboard'
      AND ProductID IN (
        SELECT Compatibility.ProductID2
        FROM Compatibility
        WHERE Compatibility.ProductID1 = $1 
      )
      AND ProductID IN (
        SELECT Compatibility.ProductID2
        FROM Compatibility
        WHERE Compatibility.ProductID1 = $2 
      );   
    `;
    const motherboardValues = [processorId, graphicCardId];
    const motherboards = await db.query(motherboardQuery, motherboardValues);
    res.json({
      status: 'success',
      motherboards: motherboards.rows,
    });
  } catch (error) {
    console.error('Error fetching compatible motherboards:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to retrieve all RAM modules compatible with the selected motherboard
exports.getCompatibleRAMs = async (req, res) => {
  const { motherboardId } = req.query;

  try {
    const ramQuery = `
      SELECT Products.*
      FROM Products
      JOIN Compatibility ON Products.ProductID = Compatibility.ProductID1
      WHERE Compatibility.ProductID2 = $1 AND Products.Category = 'RAM'
    `;
    const ramValues = [motherboardId];
    const rams = await db.query(ramQuery, ramValues);
    res.json({
      status: 'success',
      rams: rams.rows,
    });
  } catch (error) {
    console.error('Error fetching compatible RAM modules:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to retrieve all storage devices compatible with the selected motherboard
exports.getCompatibleStorage = async (req, res) => {
  const { motherboardId } = req.query;

  try {
    const storageQuery = `
      SELECT Products.*
      FROM Products
      JOIN Compatibility ON Products.ProductID = Compatibility.ProductID1
      WHERE Compatibility.ProductID2 = $1 AND Products.Category = 'Storage'
    `;
    const storageValues = [motherboardId];
    const storageDevices = await db.query(storageQuery, storageValues);
    res.json({
      status: 'success',
      storageDevices: storageDevices.rows,
    });
  } catch (error) {
    console.error('Error fetching compatible storage devices:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
