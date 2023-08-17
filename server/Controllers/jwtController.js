const jwt = require("jsonwebtoken");

const authenticateToken = (request, response, next) => {
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return response.status(401).send({
      success: false,
      message: "token was missing",
    });
  }

  jwt.verify(token, process.env.ACCESS_KEY, (error, user) => {
    if (error) {
      response.status(403).send({
        success: false,
        message: "invalid token",
      });
    }
    request.userId = user.userId;
    next();
  });
};

module.exports = authenticateToken;
