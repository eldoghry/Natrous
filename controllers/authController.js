import User from "./../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import crypto from "crypto";
import sendMail from "../utils/mail.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const filterObj = (obj, ...excluded) => {
  const filteredObj = {};

  Object.keys(obj).forEach((key) => {
    if (!excluded.includes(key)) filteredObj[key] = obj[key];
  });

  return filteredObj;
};

/***************** MIDDLEWARES *****************/
//PROTECT MIDDLEWARE
export const protect = catchAsync(async (req, res, next) => {
  // 1) check if header authorization
  if (!req.headers.authorization)
    return next(new AppError("please login first", 401));

  // 2) Validate Token
  const token = req.headers.authorization.split(" ")[1];
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check user existance
  const currentUser = await User.findOne({ _id: decoded.id });

  if (!currentUser)
    return next(
      new AppError(
        "Invalid Token, Token not belong to any users, Please try to Login",
        401
      )
    );

  //4) check if token time older than changing password time
  if (currentUser.changedPasswordAfter(decoded.iat))
    return next(new AppError("Token are expired, Please try to Login", 401));

  req.user = currentUser;
  next();
});

//Authorize MIDDLEWARE
export const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("you are not authorized to do that", 403));
    }

    next();
  };
};

/***************** HANDLERS *****************/
export const signup = catchAsync(async (req, res, next) => {
  //   const user = await User.create({
  //     name: req.body.name,
  //     email: req.body.email,
  //     password: req.body.password,
  //     passwordConfirm: req.body.passwordConfirm,
  //   });

  //TESTING
  const user = await User.create(req.body);
  user.password = undefined; //hide password from response

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

export const forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // 1) get email from user
  // 2) generate resetToken
  // 3) hashing resetToken and save it on db
  // 4) send reset url to user

  if (!email)
    return next(new AppError("email are required to reset password", 400));

  const user = await User.findOne({ email });

  if (!user) return next(new AppError("email not belong to any user", 400));

  //generate token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send url by email
  try {
    const mailResponse = await sendMail({
      to: user.email,
      subject: "Reset Password - valid for 10 min",
      message: `http://127.0.0.1:3000/api/v1/users/resetPassword/${resetToken}`,
      type: "text",
    });
    // console.log(mailResponse);
  } catch (error) {
    // undo somethings
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    user.save({ validateBeforeSave: false });

    // console.log(error);
    return next(
      new AppError("Something went wrong, Please try again later", 500)
    );
  }

  res.status(200).json({
    status: "success",
    // resetToken,
    // message: `http://127.0.0.1:3000/api/v1/users/resetPassword/${resetToken}`,
    message: `please check your email to get reset url`,
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { resetToken } = req.params;
  const { password, passwordConfirm } = req.body;

  const hash = crypto.createHash("sha256").update(resetToken).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hash,
    passwordResetExpire: {
      $gte: Date.now(),
    },
  });

  if (!user) return next(new AppError("Invalid or expired token", 400));

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordChangedAt = Date.now();

  //remove unnessasry reset token fields
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;

  await user.save();

  const token = signToken(user._id);
  res.status(202).json({ status: "success", token });
});

// authorized user can update his account
export const updateMe = catchAsync(async (req, res, next) => {
  //1) filter body
  const filtered = filterObj(
    req.body,
    "role",
    "password",
    "passwordConfirm",
    "passwordResetToken",
    "passwordResetExpire",
    "passwordChangedAt"
  );

  //2) upate current user
  const user = await User.findByIdAndUpdate(req.user._id, filtered, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: "success", user });
});

// authorized user can delete his account (change isActive to false)
export const deleteMe = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  //2) check password
  if (!password || !(await user.isCorrectPassword(password)))
    return next(new AppError("you are not authorized to do that", 403));

  user.isActive = false;
  await user.save({ validateBeforeSave: false });

  res
    .status(204)
    .json({ status: "success", message: "User have been deleted" });
});
