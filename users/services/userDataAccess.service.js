import { isBuissines } from "../../middlewares/isBuissines.js";
import User from "../models/User.schema.js";
import { hashPassword, comparePassword } from "./password.service.js";
import lockUser from "../models/LoginTries.schema.js"

import lodash from "lodash";
const { pick } = lodash; 

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    let userBlock = await lockUser.findOne({ userId: user._id.toString() });

    if (userBlock && userBlock.tries >= 3) {
      const timeDifference = new Date() - new Date(userBlock.lastLoginDate);
      const hoursPassed = timeDifference / (1000 * 60 * 60);

      if (hoursPassed <= 24) {
        throw new Error(
          "Your account is temporarily locked due to multiple failed login attempts. Please try again after 24 hours."
        );
      }
      await lockUser.findByIdAndDelete(userBlock._id);
      userBlock = null;
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      if (!userBlock) {
                userBlock = new lockUser({
                    userId: user._id,
                    tries: 1,
                    lastLoginDate: new Date(), // Store as a proper Date object
                });
                await userBlock.save();
    } else {
      userBlock.tries++;
      userBlock.lastLoginDate = new Date();
      await userBlock.save();
    }
    throw new Error("Password is incorrect.");
  }
  if (userBlock) {
    await lockUser.findByIdAndDelete(userBlock._id);
  }

  return user;
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

  await newUser.save();
  const returnUser = pick(newUser.toObject(), [
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
    if (!user) {
      throw new Error("User not found");
    }
     if (user.isBusiness = true){
      user.isBusiness = false;
     }
    return user.save();
  } catch (err) {
    throw new Error(err.massage);
  }
};

export { getUserById, deleteUser, updateUser, addUser, login, ChangeAuthlevel };
