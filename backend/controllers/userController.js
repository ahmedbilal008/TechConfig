const db = require("../database/database");
const crypto = require("crypto");
const { hashPassword, comparePassword, sendToken, generateJWTToken, sendEmail } = require("./functionController");
const cloudinary = require("cloudinary");

exports.registerUser = async (req, res) => {

  const { name, email, password } = req.body;//have to remove id in future

  try {
    const checkEmailQuery = 'SELECT * FROM Users WHERE Email = $1';
    const checkEmailResult = await db.query(checkEmailQuery, [email]);

    if (checkEmailResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    let avatarUrl = 'https://res.cloudinary.com/dwfv2ooij/image/upload/v1703748281/avatars/vsc5ouz9rp5jm3uvc4yd.png';
    let publicId = null;

    if (req.body.avatar) {
      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      avatarUrl = myCloud.secure_url;
      publicId = myCloud.public_id;
    }


    // Insert the new user into the Customers table
    const insertUserQuery = 'INSERT INTO Users ( Username, Email, Password, Avatar , PublicID) VALUES ($1, $2, $3, $4,$5) RETURNING *';
    const hashedPassword = await hashPassword(password); // Implement your password hashing function
    const insertUserValues = [name, email, hashedPassword, avatarUrl, publicId];//remove id

    const result = await db.query(insertUserQuery, insertUserValues);
    
    const newUser = result.rows[0];
    sendToken(newUser, 201, res);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please Enter Email and Password'
      });
    }
    const findUserQuery = 'SELECT * FROM Users WHERE Email = $1';
    const findUserResult = await db.query(findUserQuery, [email]);

    if (findUserResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Email or Password'
      });
    }

    const user = findUserResult.rows[0];
    // Compare the entered password with the stored hashed password
    const isPasswordMatched = await comparePassword(password, user.password);
    console.log(isPasswordMatched);
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Email or Password'
      });
    }
    // Generate JWT token
    sendToken(user, 200, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};


exports.logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logged Out"
  })
};

exports.getUserDetails = async (req, res) => {
  try {
    const getUserQuery = 'SELECT * FROM Users WHERE UserID = $1';
    const getUserResult = await db.query(getUserQuery, [req.user.id]);

    const user = getUserResult.rows[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
exports.updatePassword = async (req, res) => {
  try {
    const id = req.user.id
    const getUserQuery = 'SELECT * FROM Users WHERE UserID = $1';
    const getUserResult = await db.query(getUserQuery, [id]);

    const user = getUserResult.rows[0];
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare the entered old password with the stored hashed password
    const isPasswordMatched = await comparePassword(req.body.oldPassword, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    console.log('Old password is correct');
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password does not match confirmation",
      });
    }

    console.log('Password matches confirmation');

    console.log(req.body.newPassword);
    const hashedPassword = await hashPassword(req.body.newPassword);
    console.log(user.UserID);
    console.log(hashedPassword);
    const updatePasswordValues = [hashedPassword, id];
    const updatePasswordQuery = 'UPDATE Users SET Password = $1 WHERE UserID = $2 RETURNING *';
    const updateResult = await db.query(updatePasswordQuery, updatePasswordValues);
    console.log('Update result:', updateResult.rows[0]);

    sendToken(user, 200, res);

  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };
   
    const userID = req.user.id;

    const getUserQuery = 'SELECT * FROM Users WHERE UserID = $1';
    const getUserResult = await db.query(getUserQuery, [userID]);
    const user = getUserResult.rows[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    updateUserDataQuery = 'UPDATE Users SET Username = $1 , Email = $2, Phone= $3 WHERE UserID = $4 RETURNING *';
    updateUserDataValues = [newUserData.name, newUserData.email, newUserData.phone, userID];
    
    if (req.body.avatar !== "") {
      const imageid = user.publicid;
      if(imageid){
        await cloudinary.v2.uploader.destroy(imageid);
      }

      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });
      updateUserDataQuery = 'UPDATE Users SET Username = $1 , Email = $2, Phone= $3 ,Avatar=$4 , PublicID=$5WHERE UserID = $6 RETURNING *';
      updateUserDataValues = [newUserData.name, newUserData.email, newUserData.phone, myCloud.secure_url, myCloud.public_id, userID];
    }
    
    const updatedUserResult = await db.query(updateUserDataQuery, updateUserDataValues);

    res.status(200).json({
      success: true,
      user: updatedUserResult.rows[0],
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all users
exports.getAllUser = async (req, res) => {
  try {
    const getAllUsersQuery = 'SELECT * FROM Users';
    const getAllUsersResult = await db.query(getAllUsersQuery);

    if (!getAllUsersResult.rows || getAllUsersResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found',
      });
    }

    res.status(200).json({
      success: true,
      users: getAllUsersResult.rows,
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


// Get single user by ID
exports.getSingleUser = async (req, res) => {
  try {
    const userID = req.params.id;

    const getSingleUserQuery = 'SELECT * FROM Users WHERE UserID = $1';
    const getSingleUserResult = await db.query(getSingleUserQuery, [userID]);

    const user = getSingleUserResult.rows[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User does not exist with ID: ${userID}`,
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error getting single user:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



exports.updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const newUserData = {
      role: req.body.role,
    };

    const updateUserRoleQuery = 'UPDATE Users SET Role = $1 WHERE UserID = $2 RETURNING *';
    const updateUserRoleValues = [newUserData.role, userId];

    const updatedUser = await db.query(updateUserRoleQuery, updateUserRoleValues);

    if (!updatedUser.rows || updatedUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `User not found with ID: ${userId}`,
      });
    }

    res.status(200).json({
      success: true,
      //user: updatedUser.rows[0],
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

