import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const registerUser = async (
  username,
  email,
  password
) => {
  const exists = await User.findOne({ email });

  if (exists) {
    throw new Error("User already exists");
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  return user;
};