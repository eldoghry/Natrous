import AppError from "../utils/AppError.js";
import path from "path";

const sendErrorResHandler = (err, req, res) => {
  if (!req.originalUrl.startsWith("/api")) {
    // handle client side unkown routes
    // render template
    return res
      .status(err.statusCode)
      .render(path.join(process.cwd(), "views", "error.pug"), {
        title: "Natrous",
        message: err.message,
      });
  } else if (process.env.NODE_ENV === "development")
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  else if (process.env.NODE_ENV === "production") {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};

const handleDuplicatedInptsDB = (err) => {
  const msg = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  return new AppError(`Duplicated value (${msg}). PLease use anther one`, 400);
};

const handleValidationErrDB = (err) => {
  const errors = Object.values(err.errors);
  return new AppError(
    `Validation Error: ${errors.map((el) => el.message).join(", ")}`,
    400
  );
};

const handleCastErrDB = (err) =>
  new AppError(`Invalid ${err.path}:${err.value}`, 400);

const handleJWTErr = () =>
  new AppError(`Token have been Invalid, Please login again`, 401);

const handleJWTExpireErr = () =>
  new AppError(`Token have been expired, Please login again`, 401);

// GLOBAL ERROR HANDLER
export default (err, req, res, next) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    sendErrorResHandler(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    if (error.code === 11000) error = handleDuplicatedInptsDB(error);
    if (error.name === "CastError") error = handleCastErrDB(error);
    if (error.name === "ValidationError") error = handleValidationErrDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTErr();
    if (error.name === "TokenExpiredError") error = handleJWTExpireErr();

    sendErrorResHandler(error, req, res);
  }
};
