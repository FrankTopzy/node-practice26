export function errorHandler(err, req, res, next) {
  console.error(err.stack || err);

  // Check whether the response has already started
  if (res.headersSent) {
    return next(err);
  }

  // Get the intended status code
  const candidateStatus = err.statusCode ?? err.status;

  const statusCode =
    Number.isInteger(candidateStatus) &&
    candidateStatus >= 400 &&
    candidateStatus <= 599
      ? candidateStatus
      : 500;

  // Avoid exposing internal server errors
  const message = statusCode >= 500 ? "Internal server error" : err.message || "Something went wrong";
  console.log(message);
  

  return res.status(statusCode).json({message});
}