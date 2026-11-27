import crypto from "crypto";

const verifyCsrfToken = (req, res, next) => {
  const csrfToken = req.headers["x-csrf-token"];
  const signedCookie = req.cookies.csrfToken;

  if (!csrfToken || !signedCookie) {
    return res.status(403).json({
      message: "CSRF token missing."
    });
  }

const [cookieToken, issuedAt, receivedSignature] = signedCookie.split(".");

  if (!cookieToken || !receivedSignature || !issuedAt) {
    return res.status(403).json({
      message: "Invalid CSRF token."
    });
  }

  const tokenAge = Date.now() - Number(issuedAt);

  if (
    !Number.isSafeInteger(Number(issuedAt)) ||
    tokenAge < 0 ||
    tokenAge > 15 * 60 * 1000
  ) {
    return res.status(403).json({
      message: "CSRF token expired."
    });
  }

  const expectedSignature = crypto
  .createHmac("sha256", process.env.CSRF_SECRET)
  .update(`${cookieToken}.${issuedAt}`)
  .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature, "hex");
  const receivedBuffer = Buffer.from(receivedSignature, "hex");

  if (receivedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
    return res.status(403).json({
      message: "Invalid CSRF token."
    });
  }

  const cookieTokenBuffer = Buffer.from(cookieToken);
  const requestTokenBuffer = Buffer.from(csrfToken);

  if (cookieTokenBuffer.length !== requestTokenBuffer.length || !crypto.timingSafeEqual(cookieTokenBuffer, requestTokenBuffer)) {
    return res.status(403).json({
      message: "CSRF token mismatch."
    });
  }

  next();
};

export default verifyCsrfToken;