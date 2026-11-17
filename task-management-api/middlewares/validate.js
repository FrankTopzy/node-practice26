const validate = (schema, property = "body") => (req, res, next) => {
  const result = schema.safeParse(req[property]);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.issues
    });
  }

 if (property === "query") {
    Object.defineProperty(req, "validatedQuery", {
      value: result.data,
      writable: true,
      configurable: true
    });
  } else {
    req[property] = result.data;
  }

  next();
};

export default validate;