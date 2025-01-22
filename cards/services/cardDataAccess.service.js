import Card from "../models/cards.schema.js";
import lodash from "lodash";


const { pick } = lodash; 

const addCard = async (cardData) => {
  const newCard = new Card(cardData);
  newCard.save();
  const returnCard = pick(newCard, [
    "name",
    "address",
    "image",
    "_id",
    "isBusiness",
    "isAdmin",
    "phone",
    "email",
  ]);
  return returnCard;
};

const updateCard = async (cardId) => {
  try {
    const card = await Card.findByIdAndUpdate(cardId);
    if (!user) {
      throw new Error("User not found");
    }
    return card;
  } catch (err) {
    throw new Error(err.massage);
  }
};

const deleteCard = async (cardId) => {
    try{
        const card = await Card.findByIdAndDelete(cardId);
        return card;
    }catch(err){
        throw new Error(err.massage);
    }
};

const Likes = async (userId) => {
  try {
    const card = await Card.Likes.push(userId);
    card.save();
  }catch{
    throw new Error(err.massage);
  }
};


export { updateCard, addCard, deleteCard, Likes };