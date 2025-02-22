import { ApiError, asyncHandler } from "../utils/index";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../globalConfig";
import { prismaClient } from "@workspace/db/client";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        //@ts-ignore
        const token = req.cookies?.accessToken || req.headers["Authorization"]?.replace("Bearer ", "");
    
        if(!token) {
            throw new ApiError(401, "Unauthorized request");
        }
    
        if(ACCESS_TOKEN_SECRET === undefined) {
            res.status(500).json({
                message: "Access token is required is not present"
            });
            return;
        }

        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
        if(typeof(decodedToken) === "string") {
            res.status(500).json({
                message: "Type of decoded token is not jwt payload."
            });
            return;
        }
    
        const user = await prismaClient.user.findUnique({
            where: {
                id: decodedToken.id
            }
        });

        if(!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        //@ts-ignore
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid access token.");
    }
});