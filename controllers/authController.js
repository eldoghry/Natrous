import User from "./../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ status: "success", user });
});

export const login = catchAsync(async (req, res, next) => {
  const loginByVal = req.body.username || req.body.email || undefined;
  const loginByKey = req.body.username ? "username" : "email";

  const password = req.body.password;

  if (!loginByVal || !password)
    return next(
      new AppError("(username or email) and paassword are required", 400)
    );

  const user = await User.findOne({ [loginByKey]: loginByVal }).select(
    "+password"
  );

  if (!user || !(await user.isCorrectPassword(password)))
    return next(new AppError("Invalid credentials", 401));

  //generate token
  const token = signToken(user._id);

  res.status(202).json({ status: "success", token });
});
