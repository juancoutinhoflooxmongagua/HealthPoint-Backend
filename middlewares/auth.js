function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (decoded.hospital_id) {
      req.hospital = { id: decoded.hospital_id };
    }

    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido" });
  }
}
