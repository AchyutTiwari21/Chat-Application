import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../config";
import { ACCESS_TOKEN_SECRET } from "../globalConfig";
import { ApiError } from "./ApiError";

type User = {
    id: string;
    username: string | null;
    googleId: string | null;
    email: string;
    password: string | null;
    name: string | null;
    age: string | null;
    profilePicture: string | null;
    refreshToken: string | null;
    authProvider: string | null;
}

export default function generateToken(user: User) {

    if(ACCESS_TOKEN_SECRET === undefined || REFRESH_TOKEN_SECRET === undefined || ACCESS_TOKEN_EXPIRY === undefined || REFRESH_TOKEN_EXPIRY === undefined) {
        throw new ApiError(500, "Token secret or expiry is not defined in the environment variables.");
    }

    const accessTokenSecret = ACCESS_TOKEN_SECRET as string;
    const refreshTokenSecret = REFRESH_TOKEN_SECRET as string;
    const accessTokenExpiry = ACCESS_TOKEN_EXPIRY as string;
    const refreshTokenExpiry = REFRESH_TOKEN_EXPIRY as string;

    //@ts-ignore
    const accessToken = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        accessTokenSecret,
        {
            expiresIn: accessTokenExpiry
        }
    );

    //@ts-ignore
    const refreshToken = jwt.sign(
        {
            id: user.id
        },
        refreshTokenSecret,
        {
            expiresIn: refreshTokenExpiry
        }
    );

    return { accessToken, refreshToken };
}