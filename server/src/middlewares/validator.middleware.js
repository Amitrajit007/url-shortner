import validator from "valid-url";
const urlValidator = (req, res, next) => {
  const { originalUrl } = req.body;
  if (!validator.isUri(originalUrl)) {
    return res.status(400).json({ error: "Invalid URL" });
  }
  next();
};

export default urlValidator;
