import * as dotenv from "dotenv";
dotenv.config({path: "../../.env"});

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;