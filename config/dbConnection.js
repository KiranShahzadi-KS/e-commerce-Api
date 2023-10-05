const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(
    // "mongodb+srv://kiran11:1234@ecommerce-web-app.kpgzlya.mongodb.net",
    process.env.MONGO_URL_LOCAL,
    {
      useNewUrlParser: true,
      //   useCreateIndex: true,
      //   useFindAndModify: false,
      useUnifiedTopology: true,
    }
  );
  console.log("MongoDB connected");
};

module.exports = connectDB;
