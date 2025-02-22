import * as dotenv from "dotenv";
dotenv.config();

const options = {
    httpOnly: true,
    secure: true
}

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export {
    options,
    REFRESH_TOKEN_SECRET
}