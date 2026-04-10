import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    let decoded;

    decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'Not authorized - user not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};
