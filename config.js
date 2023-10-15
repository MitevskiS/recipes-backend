const jwt = require("jsonwebtoken");

const TOKEN_KEY="O5jkiTJaly/SZluAilZT0aKHvhsZj0KJiKHn02a6kDcznDDrNB/sI9sznNDLNG6mMYIQKNOykVGW2FXEOkZvN/kVGOF4jfyxMjFAbnz2niNTGZ0RBvnOIYigzWrsVSOdGAL1KusDZMcTrCJjBOdfq5e4cqbRoqU1nx8buLgAgfoYUAVv0y0PdygGqxrS2J+q01IgzdaoqsMJTnQOxj2iReHs+CLy12j8HFrYnFcDA8Vmwi3fGxlhTZULmzC6mdshuTVXutOiAQvpdLMoiNQM0ECWdsQzYk94xElNsLmQDHk+25oOZmHp2Jnr/cBEHVlKFSv5BQl8EK+eJipa4xV1hA=="

const tokenVerification = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("Token required !!");
  }
  try {
    const userDecoded = jwt.verify(token, TOKEN_KEY);
    req.user = userDecoded;
  } catch (err) {
    return res.status(401).send("Token not found");
  }
  return next();
};

module.exports = { TOKEN_KEY, tokenVerification };
