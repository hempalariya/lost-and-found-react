import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No Token" });
  try {
    const decoded = jwt.varify(token, process.env.SECRET);
    req.userId = decoded.id;
  } catch (error) {
    res.status(401).json({ message: "Token invalid" });
  }
}
