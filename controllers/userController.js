import APIFeatures from "../utils/apiFeatures.js";
import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    status: "success",
    results: users.length,
    requestTime: req.requestTime,
    users,
  });
});

export const createUser = catchAsync(async (req, res, next) => {
  const user = await await User.create(req.body);
  user.password = undefined;
  res.status(201).json({ status: "success", user });
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not exist", 400));
  }

  res.status(200).json({ status: "success", user });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("User not exist", 400));
  }
  res.status(204).send("deleted");
});

export const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("User not exist", 400));
  }

  res.status(200).json({ status: "success", user });
});
