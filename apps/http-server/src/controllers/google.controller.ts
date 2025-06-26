import { Request, Response } from "express";
import { asyncHandler, ApiResponse, ApiError } from "../utils/index";
import { prismaClient } from "@workspace/db/client";
const crypto = require("crypto");
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
    console.log(req.query);

    const { code } = req.query;

    const data = {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: "http://localhost:8000/google/callback",
        grant_type: "authorization_code",
    };

    console.log(data);

    // exchange authorization code for access token & id_token

    if(GOOGLE_ACCESS_TOKEN_URL === undefined) {
        throw new ApiError(500, "GOOGLE_ACCESS_TOKEN_URL is not defined", );
    }

    const response = await fetch(GOOGLE_ACCESS_TOKEN_URL, {
        method: "POST",
        body: JSON.stringify(data),
    });

    const access_token_data = await response.json();

    const { id_token } = access_token_data;

    console.log(id_token);

    // verify and extract the information in the id token

    const token_info_response = await fetch(
        `${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`
    );

//   const { email, name } = token_info_data;
//   let user = await User.findOne({ email }).select("-password");
//   if (!user) {
//     user = await User.create({ email, name});
//   }
//   const token = user.generateToken();
//   res.status(token_info_response.status).json({ user, token });
    res.status(token_info_response.status).json(await token_info_response.json());
});

export {
    googleLoginUser,
    googleCallback
}