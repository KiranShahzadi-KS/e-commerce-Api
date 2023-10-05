const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { generateToken } = require("../config/jwtToken");
const { validateMongoDbId } = require("../utils/validateMongodbid");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("./emailController");
const crypto = require("crypto");

//CREATE USER
exports.createUser = asyncHandler(async (req, res) => {
  try {
    const email = req.body.email;

    // Check if a user with the given email already exists
    const findUser = await User.findOne({ email: email });

    if (!findUser) {
      // If the user doesn't exist, create a new user
      const newUser = await User.create(req.body);
      return res.status(201).json(newUser);
    } else {
      throw new Error("User Already Exist");
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

// LOGIN USER
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Check user exist or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateduser = await User.findByIdAndUpdate(
      findUser.id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

//HANDLE REFRESH TOKEN
exports.handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in cookies");
  const refreshToken = cookie.refreshToken;
  console.log(refreshToken);
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh token in DB or not matched");
  jwt.verify(refreshToken, process.env.MY_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token!");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

//LOGOUT FUNCTIONALITY
exports.logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = awaitUser.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return res.sendStatus(204); //Forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  return res.sendStatus(204); //Forbidden
});

//UPDATE USER
exports.updatedUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// //GET ALL USERS
// exports.getalluser = asyncHandler(async (req, res) => {
//   try {
//     const getUsers = await User.find();
//     res.json(getUsers);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// GET ALL USERS
exports.getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    // Instead of re-throwing the error, send an error response with a status code
    res.status(500).json({ error: "Unable to fetch users." });
  }
});

//GET A SINGLE USER
exports.getauser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaUser = await User.findById(id);
    res.json({
      getaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//DELETE A USER
exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({
      deleteUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//BLOCKE USER
exports.blockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    res.json(block);
  } catch (error) {
    throw new Error(error);
  }
});

//UNBLOCK USER
exports.unblockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );
    res.json({
      message: "User Unblocked!",
    });
  } catch (error) {
    throw new Error(error);
  }
});

//UPDATE PASSWORD
exports.updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

//FORGOT PASSWORD
exports.forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset the password.
    This link will valid till  10 monutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

//RESET PASSWORD
exports.resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest(hex);
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    password: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expired, Please try again later ");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});