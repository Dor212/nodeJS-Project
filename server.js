import express from 'express';
import router from './router/router.js';
import chalk from 'chalk';
import { morganLogger } from './middlewares/morganLogger.js';
import { badPathHandler } from './middlewares/badPathHandler.js';
import { ErrorHandler } from './middlewares/errorHandler.js';
import { conn } from './services/db.services.js';
import User from "./users/models/User.schema.js";
import usersSeed from "./users/initialData/initialUsers.json" with {type: "json"};
import cors from "cors";
import seedCards from './cards/initialData/cardsSeed.js';


const app = express();
const { SERVER } = process.env;
const PORT = SERVER;

app.use(express.json({ limit: "5mb" }));

app.use(morganLogger);

app.use(cors());

app.use(express.static('public'));

app.use(router);

app.use(badPathHandler);

app.use(ErrorHandler);

app.listen(PORT, async () => {
  console.log(chalk.blue(`Server is running on port ${PORT}`));
  await conn();
  await seedCards();
  const usersFromDb = await User.find();
  
  try {
    usersSeed.forEach(async(user)=>{
        if(usersFromDb.find((dbUser)=> dbUser.email === user.email)){
            return;
        }
        const newUser = new User(user);
        await newUser.save();
    });
    
    
  } catch (err) {
    console.log(err);
    
  }
});

