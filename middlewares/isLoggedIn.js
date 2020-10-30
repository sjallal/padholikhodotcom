const jwt = require("jsonwebtoken");
const config = require("config");

exports.isLoggedIn = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No token, Access denied!" });
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.author = decoded.author;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is invalid, Access denied!" });
  }
};
