const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const db = require("../database/database");
const nodeMailer = require("nodemailer");


require('dotenv').config();

exports.hashPassword = async (password) => {
  try {
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Error hashing password');
  }
};

exports.generateJWTToken = (userId) => {
  console.log(userId);
  try {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    return token;
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw new Error('Error generating JWT token');
  }
};

exports.comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

exports.sendToken = (user, statusCode, res) => {
  const token = exports.generateJWTToken(user.userid);

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user,
    token,
  })
}

exports.isAuthenticatedUser = async (req, res, next) => {
  const { token } = req.cookies;
  console.log(token);
  if (!token) {
    // return res.status(401).json({
    //   success: false,
    //   message: 'Please login to access this resource',
    // });
    return;

  }
  try {

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedData);
    
    const findUserQuery = 'SELECT * FROM Users WHERE UserID = $1';
    const findUserResult = await db.query(findUserQuery, [decodedData.id]);

    if (findUserResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found',

      });
    }

   
    req.user = mapDbResultToUser(findUserResult.rows[0]);

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message,
    });
  }
};


function mapDbResultToUser(dbResult) {
  return {
    id: dbResult.userid,
    firstName: dbResult.firstname,
    lastName: dbResult.lastname,
    email: dbResult.email,
    password: dbResult.password,
    address: dbResult.address,
    phone: dbResult.phone,
    role: dbResult.role,
  };
}

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role:${req.user.role} is not allowed to access this resource`
      })
    }
    next();
  }
}

exports.sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    secure: false,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
