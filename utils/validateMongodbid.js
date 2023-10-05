// const mongoose = require("mongoose");
// exports.validateMongoDbId = (id) => {
//   const isValid = mongoose.Types.ObjectId.isValid(id);
//   if (!isValid) throw new Error("This Id is not valid or not Found");
// };

// const mongoose = require("mongoose");

// exports.validateMongoDbId = (id) => {
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new Error("Invalid MongoDB ObjectId or not found.");
//   }
// };

const mongoose = require("mongoose");

exports.validateMongoDbId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid MongoDB ObjectId: " + id);
  }
};
