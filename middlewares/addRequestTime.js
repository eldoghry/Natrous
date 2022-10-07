const addRequestTime = (req, _, next) => {
  req.requestTime = new Date().toISOString();
  next();
};

export default addRequestTime;
