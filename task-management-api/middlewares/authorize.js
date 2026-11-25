const authorize = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        message: "Forbidden: Insufficient permissions."
      });
    }

    next();
  };
};

export default authorize;