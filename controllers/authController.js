import User from "./../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { promisify } from "util";

// ************ MIDDLEWARES ************

export const protect = catchAsync(async (req, res, next) => {
  // 1) check if header authorization
  if (!req.headers.authorization)
    return next(new AppError("please login first", 401));

  // 2) get token from request and validate it
  const token = req.headers.authorization.split(" ")[1];
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 2) check if user is exist db
  const currentUser = await User.findOne({ _id: decoded.id });

  if (!currentUser)
    return next(
      new AppError(
        "Invalid Token, Token not belong to any users, Please try to Login",
        401
      )
    );

  //3) token time older than changin password time
  if (currentUser.changedPasswordAfter(decoded.iat))
    return next(new AppError("Token are expired, Please try to Login", 401));

  req.user = currentUser;
  next();
});

// ************ EOF MIDDLEWARES ************

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const signup = catchAsync(async (req, res, next) => {
  //   const user = await User.create({
  //     name: req.body.name,
  //     email: req.body.email,
  //     password: req.body.password,
  //     passwordConfirm: req.body.passwordConfirm,
  //   });

  //TESTING
  const user = await User.create(req.body);

  const token = signToken(user._id);

  res.status(200).json({ status: "success", token, data: { user } });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("email and password are required", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.isCorrectPassword(password)))
    return next(new AppError("Invalid credentials", 401));

  //generate token
  const token = signToken(user._id);

  res.status(202).json({ status: "success", token });
});
