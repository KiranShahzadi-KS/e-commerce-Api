const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/dbConnection");
const app = express();
// Load env Variables
dotenv.config();
// const cors = require("cors");
// app.use(cors());

//Cors
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

//Router
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/prodcategoryRoute");
const blogcategoryRouter = require("./routes/blogcategoryRoute");
const brandRouter = require("./routes/brandRoute");
const couponRouter = require("./routes/couponRoute");

const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
const morgan = require("morgan");
app.use(morgan("dev"));

// Connect to DATABASE
connectDB();

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);

//Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

// SERVER START
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
