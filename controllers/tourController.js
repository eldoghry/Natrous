import Tour from "./../models/tourModel.js";

export const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find({});
    res.status(200).json({ tours });
  } catch (error) {
    res.status(500).send("something is wrong ");
  }
};

export const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({ tour });
  } catch (error) {
    res.status(500).send("something is wrong ");
  }
};
