function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }
  
  function isAdmin(req, res, next) {
    if (req.user && req.user.user_role === "admin") {
      next();
    } else {
      res.status(403).json({ error: "Access denied" });
    }
  }
  
  module.exports = { authenticateToken, isAdmin };
  