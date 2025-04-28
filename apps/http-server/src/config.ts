import * as dotenv from "dotenv";
dotenv.config();

const options = {
    httpOnly: true,
    secure: true
}

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CALLBACK_URL = "http%3A//localhost:8000/google/callback";

const GOOGLE_OAUTH_SCOPES = [
"https%3A//www.googleapis.com/auth/userinfo.email",
"https%3A//www.googleapis.com/auth/userinfo.profile",
];

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL;

export {
    options,
    REFRESH_TOKEN_SECRET,
    GOOGLE_OAUTH_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CALLBACK_URL,
    GOOGLE_OAUTH_SCOPES,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_ACCESS_TOKEN_URL
}