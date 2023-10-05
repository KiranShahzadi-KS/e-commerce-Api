// const jwt = require("jsonwebtoken");
// exports.generateRefreshToken = (id) => {
//   return jwt.sign({ id }, process.env.MY_SECRET, { expiresIn: "3d" });
// };

const jwt = require("jsonwebtoken");

exports.generateRefreshToken = (id) => {
  try {
    if (!process.env.MY_SECRET) {
      throw new Error("Environment variable MY_SECRET is not defined.");
    }

    const refreshToken = jwt.sign({ id }, process.env.MY_SECRET, {
      expiresIn: "3d",
    });
    return refreshToken;
  } catch (error) {
    // Handle the error, log it, or throw a custom error if necessary.
    throw new Error("Error generating refresh token: " + error.message);
  }
};
