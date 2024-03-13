import jwt from 'jsonwebtoken';
export function verifyToken(req, res, next) {
  const token = req.cookies['coffee-token'];
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.decoded = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Доступ запрещен' });
  }
}