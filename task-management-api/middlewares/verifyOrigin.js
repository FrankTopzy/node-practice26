
const verifyOrigin = (req, res, next) => {
  const allowedOrigin = process.env.CLIENT_URL;
  const requestOrigin = req.headers.origin;

  if (!requestOrigin || requestOrigin !== allowedOrigin) {
    return res.status(403).json({
      message: "Forbidden origin."
    });
  }

  next();
};

export default verifyOrigin;
