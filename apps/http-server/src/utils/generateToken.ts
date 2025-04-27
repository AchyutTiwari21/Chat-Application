import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../config";
import { ACCESS_TOKEN_SECRET } from "../globalConfig";
import { ApiError } from "./ApiError";

type User = {
    username: string;
    email: string;
    password: string;
    id: string;
    name: string | null;
    age: string | null;
    photo: string | null;
    refreshToken: string | null;
}

export default function generateToken(user: User) {

    if(ACCESS_TOKEN_SECRET === undefined || REFRESH_TOKEN_SECRET === undefined) {
        throw new ApiError(500, "Token secret is not defined in the environment variables.");
    }

    const accessToken = jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email
        },
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );

    const refreshToken = jwt.sign(
        {
            id: user.id
        },
        REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );

    return { accessToken, refreshToken };
}