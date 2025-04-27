import { Request, Response } from "express";
import { asyncHandler, ApiResponse, ApiError } from "../utils/index";
import { signupSchema, signinSchema, createRoomSchema } from "@workspace/zod-validation/zod-schema";
import { prismaClient } from "@workspace/db/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { options, REFRESH_TOKEN_SECRET } from "../config";
import { ACCESS_TOKEN_SECRET } from "../globalConfig";
import generateToken from "../utils/generateToken";

const registerUser = asyncHandler( async (req: Request, res: Response) => {

    // checking the type of request object
    const parsedData = signupSchema.safeParse(req.body);

    if(!parsedData.success) {
        throw new ApiError(400, "Incorrect Format");
    }

    // checking if user is present or not
    const existedUser = await prismaClient.user.findFirst({
        where: {
            OR: [
                {username: parsedData.data.username},
                {email: parsedData.data.email}
            ]
        }
    });

    if(existedUser) {
        throw new ApiError(409, "User already exists with this username and password.");
    }

    const hashedPassword: string = await bcrypt.hash(parsedData.data.password, 5);

    const user = await prismaClient.user.create({
        data: {
            username: parsedData.data.username,
            name: parsedData.data.name,
            age: parsedData.data.age,
            photo: parsedData.data.photo,
            email: parsedData.data.email,
            password: hashedPassword
        }
    });

    if(user) {
        res.status(201).json(
            new ApiResponse(
                201,
                { id: user.id, username: user.username, name: user.name, age: user.age, photo: user.photo, email: user.email },
                "User has been signed up",
                true
            )
        );
        return;
    } else {
        res.status(500).json({
            message: "Something went wrong while registering the user.s"
        });
        return;
    }
});

const loginUser = asyncHandler( async (req: Request, res: Response) => {

    // checking the type of input object
    const parsedData = signinSchema.safeParse(req.body);

    if(!parsedData.success) {
        throw new ApiError(400, "Incorrect Format");
    }

    const user = await prismaClient.user.findFirst({
        where: {
            OR: [
                {username: parsedData.data.username},
                {email: parsedData.data.email}
            ]
        }
    });

    if(!user) {
        throw new ApiError(400, "User does not exists with this username and email.");
    }

    const passwordMatch = await bcrypt.compare(parsedData.data.password, user.password);    

    if(!passwordMatch) {
        throw new ApiError(401, "Invalid Password");
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
            refreshToken: true
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

const logoutUser = asyncHandler( async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user;
    if(!user) {
        throw new ApiError(400, "Invalid Access");
    }

    const userId = user.id;
    if( userId === undefined ) {
        throw new ApiError(401, "Invalid Access.")
    }

    await prismaClient.user.update({
        where: {
            id: userId
        },
        data: {
            refreshToken: null
        }
    });

    res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .status(200).json({
        message: "User has been logged out successfully."
    });
    return;
});

const refreshAccessToken = asyncHandler( async (req: Request, res: Response) => {
    //@ts-ignore
    const refreshToken = req.cookies?.refreshToken || req.headers["Authorization"]?.replace("Bearer ", "");

    if(!refreshToken) {
        throw new ApiError(401, "Invalid Refresh Token.");
    }

    if(REFRESH_TOKEN_SECRET === undefined) {
        res.status(500).json({
            message: "Something went wrong."
        });
        return;
    }

    const decodedToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
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
        throw new ApiError(401, "Invalid Access Token.");
    }

    if(user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Invalid Refresh Token.");
    }

    if(ACCESS_TOKEN_SECRET === undefined || REFRESH_TOKEN_SECRET === undefined) {
        res.status(500).json({
            message: "Something went wrong."
        });
        return;
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

    const newRefreshToken = jwt.sign(
        {
            id: user.id
        },
        REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );

    res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
        new ApiResponse(
            200,
            { accessToken, refreshToken: newRefreshToken },
            "User signed the refresh token successfully.",
            true
        )
    );
});

const getCurrentUser = asyncHandler( async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user;
    if(!user) {
        throw new ApiError(400, "Invalid Access");
    }

    const userId = user.id;
    if( userId === undefined ) {
        throw new ApiError(401, "Invalid Access.")
    }

    const currentUser = await prismaClient.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            username: true,
            name: true,
            age: true,
            photo: true,
            email: true
        }
    });

    if(!currentUser) {
        res.status(500).json({
            message: "Something went wrong."
        });
        return;
    }

    res.status(200).json(
        new ApiResponse(
            200,
            currentUser,
            undefined,
            true
        )
    );
})

const createRoom = asyncHandler ( async (req: Request, res: Response) => {

    //checking the types of request object
    const parsedData = createRoomSchema.safeParse(req.body);
    if(!parsedData.success) {
        throw new ApiError(400, "Incorrect Format");
    }

    //@ts-ignore
    const user = req.user;
    if(!user) {
        throw new ApiError(400, "User does not exists in access token.");
    }

    const adminId = user.id;
    if( adminId === undefined ) {
        throw new ApiError(401, "UserId is not present in access token.")
    }

    const room = await prismaClient.room.create({
        data: {
            slug: parsedData.data.slug,
            adminId,
            users: { connect: {id: user.id} }
        }
    });

    if(room) {
        res.status(201).json(
            new ApiResponse(
                201, 
                room,
                "Room created successfully.",
                true
            )
        );
        return;
    } else {
        res.status(500).json({
            message: "Something went wrong while creating the room"
        });
        return;
    }
});

const getMessages = asyncHandler ( async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user;
    if(!user) {
        throw new ApiError(400, "Invalid Access");
    }

    const userId = user.id;
    if( userId === undefined ) {
        throw new ApiError(401, "Invalid Access.")
    }
    
    const roomId = Number(req.params.roomId);
    if(!roomId) {
        throw new ApiError(400, "RoomId is required in query params.");
    }

    const userPresent = await prismaClient.room.findFirst({
        where: {
            id: roomId,
            users: {
                some: {
                    id: userId
                }
            }
        }
    });

    if(!userPresent) {
        throw new ApiError(400, "Invalid Request.");
    }

    const chats = await prismaClient.chat.findMany({
        where: {
            roomId
        },
        orderBy: {
            id: "desc"
        },
        take: 150
    });

    if(!chats) {
        res.status(500).json({
            message: "Something went wrong while getting the messages."
        });
        return;
    }

    res.status(200).json(
        new ApiResponse(
            200,
            chats,
            undefined,
            true
        )
    );
    return;

});

const getRoomInfo = asyncHandler( async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user;
    if(!user) {
        throw new ApiError(400, "Invalid Access");
    }

    const userId = user.id;
    if( userId === undefined ) {
        throw new ApiError(401, "Invalid Access.")
    }

    const slug = req.params.slug;

    const userPresent = await prismaClient.room.findFirst({
        where: {
            slug,
            users: {
                some: {
                    id: userId
                }
            }
        }
    });

    if(!userPresent) {
        throw new ApiError(400, "Invalid Request.");
    }

    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    if(!room) {
        res.status(500).send({
            message: "Something went wrong while fetching room details."
        });
        return;
    }

    res.status(200).json(
        new ApiResponse(
            200,
            room,
            undefined,
            true
        )
    );
    return;
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    createRoom,
    getMessages,
    getRoomInfo
}