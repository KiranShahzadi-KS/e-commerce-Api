exports.notFound = (req, res) => {
  const error = new Error(`Not Found : ${req.orignalUrl}`);
  res.status(404);
  next(error);
};

// //Error Handler
// exports.errorHandler = (err, req, res, next) => {
//   const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
//   res.status(statuscode);
//   res.json({
//     message: err?.message,
//     stack: err?.stack,
//   });
// };

// Error Handler Middleware
exports.errorHandler = (err, req, res, next) => {
  // Determine the status code to use, default to 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Set the HTTP status code in the response
  res.status(statusCode);

  // Respond with a JSON object containing the error message and stack trace (if available)
  res.json({
    message: err?.message || "Internal Server Error",
    stack: err?.stack || undefined, // Omit the stack trace if not available
  });
};
