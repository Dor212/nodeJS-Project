import { Router } from "express";
import Card from "../models/cards.schema.js";
import { auth } from "../../middlewares/token.js";
import { isUser } from "../../middlewares/isUser.js";
import { addCard, Likes, updateCard } from "../services/cardDataAccess.service.js";
import { isBuissines } from "../../middlewares/isBuissines.js";
import CardSchema from "../validations/CardSchema.js";
import { validation } from "../../middlewares/validation.js";
import { isAdmin } from "../../middlewares/isAdmin.js";



const router = Router();

router.get("/", async (req, res) => {
    try {
        const cards = await Card.find();
        return res.json(cards);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

router.get("/my-cards ",auth, async (req, res) => {
  try {
    const myCards = await Card.find({ userId: userId});
    return res.json(myCards);
} catch (err) {
    return res.status(500).send(err.message);
}
});

router.get("/:id", async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        return res.json(card);
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

router.post("/",auth, isBuissines ,validation(CardSchema), async (req, res) => {
    try {
        const data = req.body;
        const newCard= await addCard(data);
        return res.json({ message: "Card Created", newCard });
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

router.put("/:id", auth, isUser, isBuissines, async (req, res) => {
  try {
    const data = req.body;
    const card = await updateCard()
    return res.json(data);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.patch("/:id", auth, isUser, async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    const like = await Likes(user);
    return res.json(like);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router.patch("/changebizNumber/:id", auth, isAdmin, async (req, res) => {
  try {
    const newBizNumber = req.body;
    if (newBizNumber){
      const newBZcard = Card.BizNumber = newBizNumber;
      newBZcard.save();
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});


router.delete("/:id", auth, isUser, async (req, res) => {
  try {
    const card = await deleteCard(req.params.id);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

export default router;
