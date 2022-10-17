import APIFeatures from "../utils/apiFeatures.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ status: "success", data: { data: doc } });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};

    // hack: filter for review handler
    if (req.params.tourId || req.body.tour)
      filter = { tour: req.params.tourId || req.body.tour };

    const apiFeatures = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .limitFields()
      .sort()
      .paginate();

    const doc = await apiFeatures.query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      requestTime: req.requestTime,
      data: {
        data: doc,
      },
    });
  });

export const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new AppError("Document not found", 404));
    }

    res.status(200).json({ status: "success", data: { data: doc } });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("Document not found", 404));
    }

    res.status(200).json({ status: "success", data: { data: doc } });
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("Document not found", 404));
    }
    res.status(204).send("deleted");
  });
