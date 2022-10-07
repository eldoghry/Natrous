import Tour from "./../models/tourModel.js";

export const getAllTours = async (req, res) => {
  try {
    // 1) filtering
    let filters = { ...req.query };
    const excludes = ["sort", "limit", "page", "fields"];
    excludes.forEach((el) => delete filters[el]);

    let query;

    if (filters) {
      //advanced filtering { difficulty: 'easy', price: { $gte: '500' } }
      //http://localhost:3000/api/v1/tours?difficulty=easy&price[gte]=500 => { difficulty: 'easy', price: { gte: '500' } }

      let filterStr = JSON.stringify(filters);
      filterStr = filterStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
      filters = JSON.parse(filterStr);

      query = Tour.find(filters);
    } else {
      query = Tour.find({});
    }

    //2) sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt"); //newest first
    }

    //3)limiting selected fields;
    if (req.query.fields) {
      const fields = req.query.fields.split(",");
      query = query.select(fields);
    } else {
      query = query.select(["-__v"]); //remove unnessasry __v
    }

    const tours = await query;

    res.status(200).json({
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
