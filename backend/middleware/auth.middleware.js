import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
// import { generateToken } from '../utils/generateToken.js';

export const protect = async (req, res, next) => {
  try {
    console.log('COOKIES:', req.cookies);

    const token = req.cookies.token;
    console.log('TOKEN:', token);

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('DECODED:', decoded);

    req.user = await User.findById(decoded.id).select('-password');

    console.log('REQ.USER:', req.user);

    next();
  } catch (error) {
    console.log('PROTECT ERROR:', error.message);
    return res.status(401).json({ message: 'Not authorized' });
  }
};
