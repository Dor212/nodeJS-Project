import cardSeed from "./initialCards.json" with {type: "json"};

import Card from "../models/cards.schema.js";

const seedCards = async () => {
    const cardsLength = await Card.countDocuments();

    if (cardsLength > 3) {
        return;
    };

    
    const cardsFromDB = await Card.find();

    try {
      
        for (const card of cardSeed) {
            
            if (cardsFromDB.find((dbCard) => dbCard.email === card.email)) {
                continue; 
            };
        
            const newCard = new Card(card);
            await newCard.save();
        };
    } catch (error) {
        throw new Error(`Error seeding cards: ${error.message}`);
    };
};

export default seedCards;