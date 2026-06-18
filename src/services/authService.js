import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const registerUser = async (username, name, email, password, accountType = "personal") => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    name,
    email,
    password: hashedPassword,
    accountType,
  });

  return user;
};
