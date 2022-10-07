import Tour from "./../models/tourModel.js";

export const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find({});
    res
      .status(200)
      .json({
        status: "success",
        results: tours.length,
        requestTime: req.requestTime,
        tours,
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({ status: "success", tour });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

export const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({ status: "success", tour });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

export const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).send("deleted");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

export const updateTour = async (req, res) => {
  try {
    console.log(req.body);
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ status: "success", tour });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
