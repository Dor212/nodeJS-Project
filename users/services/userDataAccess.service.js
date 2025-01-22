import { isBuissines } from "../../middlewares/isBuissines.js";
import User from "../models/User.schema.js";
import { hashPassword, comparePassword } from "./password.service.js";

/* import lodash from "lodash";
const { pick } = lodash; */

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    } else {
      return "Login successful";
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const returnUser = pick(user, [
      "name",
      "address",
      "image",
      "_id",
      "isBusiness",
      "isAdmin",
      "phone",
      "email",
    ]);
    return returnUser;
  } catch (err) {
    throw new Error(err.massage);
  }
};

const deleteUser = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (err) {
    throw new Error(err.massage);
  }
};

const updateUser = async (userId) => {
  try {
    const user = await User.findByIdAndUpdate(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (err) {
    throw new Error(err.massage);
  }
};

const addUser = async (userData) => {
  const newUser = new User(userData);
  const usedEmail = await User.findOne({ email: newUser.email });

  if (usedEmail) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await hashPassword(newUser.password);
  newUser.password = hashedPassword;

  newUser.save();
  const returnUser = pick(newUser, [
    "name",
    "address",
    "image",
    "_id",
    "isBusiness",
    "isAdmin",
    "phone",
    "email",
  ]);
  return returnUser;
};

const ChangeAuthlevel = async (userId) => {
  try {
    const user = await User.findById(userId);
    isBuissines = !isBuissines;
    return user;
  } catch (err) {
    throw new Error(err.massage);
  }
};

export { getUserById, deleteUser, updateUser, addUser, login, ChangeAuthlevel };
