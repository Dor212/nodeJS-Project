import { connect } from "mongoose";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();
const { MONGO_LOCAL } = process.env;

export const conn = async () => {
    try {
        await connect(MONGO_LOCAL);
        console.log(chalk.magenta("Connected To MongoDB"));
    } catch (err) {
        console.log(err);
    }
}