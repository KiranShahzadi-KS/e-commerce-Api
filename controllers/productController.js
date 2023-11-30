const Product = require("../models/Product");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbid");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");

exports.createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const id = req.params;
  console.log(id);
  console.log(req.body);
  // validateMongoDbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findOneAndUpdate(
      { _id: id.id },
      req.body,
      {
        new: true,
      }
    );
    console.log(updateProduct);
    res.status(200).json(updateProduct);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params;
  try {
    console.log(id.id);
    const deleteProduct = await Product.findOneAndDelete(id.id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
});

exports.getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findPrroduct = await Product.findById(id);
    res.json(findPrroduct);
  } catch (error) {
    throw new Error(error);
  }
});

exports.getAllProduct = asyncHandler(async (req, res) => {
  try {
    //Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    console.log(queryObj);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    //Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //Pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) {
        throw new Error("This page does not exits");
      }
    }
    console.log(page, limit, skip);

    const products = await query;
    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});

//WISHLIST FUNCTIONALITY
exports.addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        { new: true }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        { new: true }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// //RATING FUNCTION
// exports.rating = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const { star, prodId } = req.body;
//   try {
//     const product = await Product.findById(prodId);
//     let alreadyRated = product.ratings.find(
//       (userId) => userId.postedby.toString() === _id.toString()
//     );
//     if (alreadyRated) {
//       const updateRating = await Product.updateOne(
//         {
//           ratings: { $eleMatch: alreadyRated },
//         },
//         {
//           $set: { "ratings.$.star": star },
//         },
//         { new: true }
//       );
//       res.json(updateRating);
//     } else {
//       const rateProduct = await Product.findByIdAndUpdate(
//         prodId,
//         {
//           $push: {
//             ratings: {
//               star: star,
//               postedby: _id,
//             },
//           },
//         },
//         { new: true }
//       );
//       res.json(rateProduct);
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// RATING FUNCTION
exports.rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (rating) => rating.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updatedRating = await Product.findOneAndUpdate(
        {
          _id: prodId,
          "ratings.postedby": _id,
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        { new: true }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        { new: true }
      );
    }
    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      { totalrating: actualRating },
      { new: true }
    );
    res.json(finalproduct);
  } catch (error) {
    throw new Error(error);
  }
});

// exports.uploadImages = asyncHandler(async (req, res) => {
//   // console.log(req.files);
//   const { id } = req.params;
//   // validateMongoDbId(id);

//   try {
//     const uploader = (path) => cloudinaryUploadImg(path, "images");
//     const urls = [];
//     const files = req.files;
//     for (const file of files) {
//       const { path } = file;
//       const newPath = await uploader(path);
//       urls.push(newPath);
//     }
//     const findProduct = await Product.findByIdAndUpdate(
//       id,
//       {
//         images: urls.map((file) => {
//           return file;
//         }),
//       },
//       { new: true }
//     );
//     res.json(findProduct);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

exports.uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // validateMongoDbId(id);
  // console.log(req.files);

  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file; // Use file.path instead of files.path
      const newPath = await uploader(path);
      console.log(newPath);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      { new: true }
    );
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});
