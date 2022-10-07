const checkBody = (req, res, next) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({
      status: "fail",
      message: "body are required",
    });
  }

  next();
};

export default checkBody;
