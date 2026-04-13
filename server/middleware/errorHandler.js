const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "CastError") { statusCode = 400; message = "Invalid ID"; }
  if (err.code === 11000) {
    statusCode = 409;
    message = `${Object.keys(err.keyValue)[0]} already exists`;
  }
  if (err.name === "ValidationError") {
    statusCode = 422;
    message = Object.values(err.errors).map(e => e.message).join(", ");
  }
  if (err.isAxiosError) {
    statusCode = err.response?.status === 400 ? 404 : 502;
    message = statusCode === 404 ? "User not found on platform" : "Platform API error";
  }

  console.error(`[${statusCode}] ${req.method} ${req.path} → ${message}`);
  res.status(statusCode).json({ success: false, error: message });
};

module.exports = errorHandler;
