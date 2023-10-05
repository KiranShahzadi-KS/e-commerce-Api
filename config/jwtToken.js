// const jwt = require("jsonwebtoken");
// exports.generateToken = (id) => {
//   return jwt.sign({ id }, process.env.MY_SECRET, { expiresIn: "1d" });
// };

const jwt = require("jsonwebtoken");

exports.generateToken = (id) => {
  try {
    if (!process.env.MY_SECRET) {
      throw new Error("Environment variable MY_SECRET is not defined.");
    }

    const token = jwt.sign({ id }, process.env.MY_SECRET, { expiresIn: "1d" });
    return token;
  } catch (error) {
    // Handle the error, log it, or throw a custom error if necessary.
    throw new Error("Error generating token: " + error.message);
  }
};
