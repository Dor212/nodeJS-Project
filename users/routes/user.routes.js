import { Router } from "express";
import User from "../models/User.schema.js"
import {
  addUser,
  deleteUser,
  updateUser,
  login,
} from "../services/userDataAccess.service.js";
import { validation } from "../../middlewares/validation.js";
import LoginSchema from "../validations/LoginSchema.js";
import RegisterSchema from "../validations/RegisterSchema.js";
import { generateToken } from "../../services/authService.js";
import { auth } from "../../middlewares/token.js";
import { isAdmin } from "../../middlewares/isAdmin.js";
import { isUser } from "../../middlewares/isUser.js";

const router = Router();


router.post("/register", validation(RegisterSchema), async (req, res) => {
  try {
    const data = req.body;
    const newUser = await addUser(data);
    if (data.email === email) {
      return res.status(404).send("The email already exists in the system.");
    }
    return res.json({ message: "User Created", newUser });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});



router.post("/login", validation(LoginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const tryLogin = await login(email, password);
    if (!tryLogin) {
      return res.status(404).send("User not found!");
    }
    const user = await User.findOne({ email });
    const token = generateToken(user);
    return res.send(token);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/:id", isUser, async (req, res) => {
  try {
    const user = await getUserById();
    return res.json(user);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.put("/:id", auth, isUser, async (req, res) => {
  try {
    const data = req.body;
    const user = await updateUser();
    return res.json(data);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});
router.patch("/updateBuissines", auth, isUser, async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    const authLever = await ChangeAuthlevel(user);
    return res.json(authLever);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.delete("/:id", auth, isUser, async (req, res) => {
  try {
    const user = await deleteUser(req.params.id);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});


export default router;