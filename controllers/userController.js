import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import * as factory from "./handlerFactory.js";
// import catchAsync from "../utils/catchAsync.js";
// import APIFeatures from "../utils/apiFeatures.js";

export const getAllUsers = factory.getAll(User);
export const createUser = factory.createOne(User);
export const getUser = factory.getOne(User);
export const deleteUser = factory.deleteOne(User);

//changing password not allowed by this handler
export const updateUser = factory.updateOne(User);

/*** Middlewares ***/
export const removePasswordFieldsReq = (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        "This route not for update password, Please remove (password | passwrodConfirm) from request",
        400
      )
    );

  next();
};
