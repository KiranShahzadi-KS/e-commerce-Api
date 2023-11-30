// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const asyncHandler = require("express-async-handler");
// const expressAsyncHandler = require("express-async-handler");

// exports.authMiddleware = asyncHandler(async (req, res, next) => {
//   let token;
//   if (req?.headers?.authorization?.startsWith("Bearer")) {
//     token = req.headers.authorization.split(" ")[1];
//     try {
//       if (token) {
//         const decoded = jwt.verify(token, process.env.MY_SECRET);
//         const user = await User.findById(decoded?.id);
//         req.user = user;
//         next();
//       }
//     } catch (error) {
//       throw new Error("Not Authorized token expired, Please Login again");
//     }
//   } else {
//     throw new Error("There is no token attached to header");
//   }
// });

// exports.isAdmin = asyncHandler(async (req, res, next) => {
//   const { email } = req.user;
//   const adminUser = await User.findOne({ email });
//   if (adminUser.role !== "admin") {
//     throw new Error("You are not an admin");
//   } else {
//     next();
//   }
// });

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

exports.authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.MY_SECRET);
        const user = await User.findById(decoded.id);

        if (user) {
          req.user = user;
          next();
        } else {
          throw new Error("User not found");
        }
      }
    } catch (error) {
      throw new Error(
        "Not Authorized: Token expired or invalid. Please Login again"
      );
    }
  } else {
    throw new Error("No token attached to header");
  }
});

exports.isAdmin = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  if (role !== "admin") {
    throw new Error("You are not an admin");
  } else {
    next();
  }
});
