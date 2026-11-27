import crypto from "crypto";

const generateCsrfToken = (req, res) => {
  const csrfToken = crypto.randomBytes(32).toString("hex");

  const issuedAt = Date.now();

  const signature = crypto
    .createHmac("sha256", process.env.CSRF_SECRET)
    .update(`${csrfToken}.${issuedAt}`)
    .digest("hex");

  const signedToken = `${csrfToken}.${issuedAt}.${signature}`;

  res.cookie("csrfToken", signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/users",
    maxAge: 15 * 60 * 1000,
  });

  res.json({
    csrfToken
  });
};

export default generateCsrfToken;