------------------------------------------------------------------------
-- Create Products Table
CREATE TABLE Products (
    ProductID SERIAL PRIMARY KEY,
    ProductName VARCHAR(255),
    Description TEXT,
    Category VARCHAR(50),
    Price DECIMAL(10, 2),
    StockQuantity INT DEFAULT 1,
    Manufacturer VARCHAR(100),
    ImageURL VARCHAR(255)
    Ratings DECIMAL(3, 2) DEFAULT 0.00;
);

-- Create Users Table
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(50),
    Email VARCHAR(255),
    Password VARCHAR(255),
    Address VARCHAR(255),
    Phone VARCHAR(20),
    Role VARCHAR(5) CHECK (Role IN ('admin', 'user')) DEFAULT 'user',
    PublicID VARCHAR(100),
    Avatar VARCHAR(255)
);

-- Create Orders Table
CREATE TABLE Orders (
    OrderID SERIAL PRIMARY KEY,
    UserID INT,
    OrderDate DATE DEFAULT CURRENT_DATE,
    ItemsPrice DECIMAL(10, 2) DEFAULT 0.00,
    TaxPrice DECIMAL(10, 2) DEFAULT 0.00,
    ShippingPrice DECIMAL(10, 2) DEFAULT 0.00,
    TotalPrice DECIMAL(10, 2) DEFAULT 0.00,
    OrderStatus VARCHAR(20),
    DeliveredAt DATE,
    Phone VARCHAR(20),
    City VARCHAR(255),
    Address VARCHAR(255),
    PaymentStatus VARCHAR(20),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Create OrderItems Table
CREATE TABLE OrderItems (
    OrderItemID SERIAL PRIMARY KEY,
    OrderID INT,
    ProductID INT,
    Quantity INT,
    Subtotal DECIMAL(10, 2),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
);

-- Create ReviewsAndRatings Table
CREATE TABLE ReviewsAndRatings (
    ReviewID SERIAL PRIMARY KEY,
    ProductID INT,
    UserID INT,
    Rating INT,
    ReviewText TEXT,
    ReviewDate DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Add missing column to ProductImages Table
CREATE TABLE ProductImages (
    ImageID SERIAL PRIMARY KEY,
    ProductID INT,
    URL VARCHAR(255) NOT NULL,
    PublicId VARCHAR(255),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
);

-- Create Compatibility Table
CREATE TABLE Compatibility (
    ProductID1 INT,
    ProductID2 INT,
    FOREIGN KEY (ProductID1) REFERENCES Products(ProductID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID2) REFERENCES Products(ProductID) ON DELETE CASCADE,
    CHECK (ProductID1 <> ProductID2) 
);

CREATE TABLE Processors (
    ProductID INT UNIQUE,
    SocketType VARCHAR(50),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
);

CREATE TABLE GraphicCards (
    ProductID INT UNIQUE,
    SlotType VARCHAR(50),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
);

CREATE TABLE Motherboards (
    ProductID INT UNIQUE,
    SocketType VARCHAR(50),
    SlotType VARCHAR(50),
    RAMSlots INT,
    InterfaceType VARCHAR(50),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
);

CREATE TABLE RAM (
    ProductID INT UNIQUE,
    RAMSlots INT,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
);

CREATE TABLE Storage (
    ProductID INT UNIQUE,
    InterfaceType VARCHAR(50),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
);
