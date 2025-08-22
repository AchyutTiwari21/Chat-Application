import { Request, Response } from "express";
import { asyncHandler, ApiResponse, ApiError } from "../utils/index";
import { prismaClient } from "@workspace/db/client";
import fetch from "node-fetch";
import { options, REFRESH_TOKEN_SECRET } from "../config";
import { ACCESS_TOKEN_SECRET } from "../globalConfig";
import generateToken from "../utils/generateToken";

import { 
    GOOGLE_CLIENT_ID, 
    GOOGLE_CALLBACK_URL, 
    GOOGLE_OAUTH_URL, 
    GOOGLE_OAUTH_SCOPES, 
    GOOGLE_CLIENT_SECRET,
    GOOGLE_ACCESS_TOKEN_URL
} from "../config";

const googleLoginUser = asyncHandler(async (req: Request, res: Response) => {
    const state = "some_state";
    const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
    const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
    res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
});

const googleCallback = asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.query;

    if (!code) {
        throw new ApiError(400, "Authorization code not provided");
    }

    const data = {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: "http://localhost:8000/api/v1/google/callback",
        grant_type: "authorization_code",
    };

    // exchange authorization code for access token & id_token

    if(GOOGLE_ACCESS_TOKEN_URL === undefined) {
        throw new ApiError(500, "GOOGLE_ACCESS_TOKEN_URL is not defined", );
    }

    const response = await fetch(GOOGLE_ACCESS_TOKEN_URL, {
        method: "POST",
        body: JSON.stringify(data),
    });

    const responseText = await response.json();

    const access_token_data = responseText;

    //@ts-ignore
    const { id_token } = access_token_data;

    // verify and extract the information in the id token

    const token_info_response = await fetch(
        `${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`
    );

    console.log("Token Response: ", token_info_response);
    

    const tokenData = await token_info_response.json() as {
        email: string;
        name: string;
        picture?: string;
        sub: string; // googleId
    };

    console.log("Token Data: ", tokenData);

    const { email, name, picture, sub } = tokenData;


    let user = await prismaClient.user.findFirst({
        where: {
            OR: [
                { email },
                { googleId: sub }
            ]
        },
    });

    if(!user) {
        user = await prismaClient.user.create({
            data: {
                email,
                name,
                googleId: sub,
                authProvider: "google",
                profilePicture: picture
            },
        });
    }

    if(ACCESS_TOKEN_SECRET === undefined || REFRESH_TOKEN_SECRET === undefined) {
        res.status(500).json({
            message: "Something went wrong."
        });
        return;
    }

    const { accessToken, refreshToken } = generateToken(user);

    await prismaClient.user.update({
        where: {
            id: user.id
        },
        data: {
            refreshToken
        }
    });

    const loggedInUser = await prismaClient.user.findUnique({
        where: {
            id: user.id
        },
        omit: {
            password: true,
            refreshToken: true,
            googleId: true,
            authProvider: true
        }
    });

    if(!loggedInUser) {
        res.status(500).json({
            message: "Something went wrong."
        });
        return;
    }

    res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            { user: loggedInUser, accessToken, refreshToken },
            "User has been signed up",
            true
        )
    );
    return;
});

export {
    googleLoginUser,
    googleCallback
}