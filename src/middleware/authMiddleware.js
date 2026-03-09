const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    console.log('-----------------------');
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided." });
  }

  try {
    const verified = jwt.verify(token.split(" ")[1], "SECRET_KEY");  // Verify the token and extract the user ID
    req.user = verified;  // Save the user info into the request object
    next();  // Proceed to the next middleware
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = verifyToken;