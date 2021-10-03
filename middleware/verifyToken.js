const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) res.status(403).json({ message: "You are not authenticated" });
      req.user = user;
      next();
    });
  } else return res.status(200).json({ message: "You are authenticated" });
};

const verifyTokenAndAuthorize = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else return res.status(403).json({ message: "You are not authorized!" });
  });
};

module.exports = { verifyToken, verifyTokenAndAuthorize };
