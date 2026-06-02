import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { registerUser } from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = await registerUser(username, email, password);

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    next(error);
  }
};