import { WebSocketServer, WebSocket } from 'ws';
import { ACCESS_TOKEN_SECRET } from './config';
import jwt from "jsonwebtoken";
import { prismaClient } from "@workspace/db/client";

const wss = new WebSocketServer({port: 8080});

const allRoomSockets = new Map<Number, WebSocket[]>();

function checkUser(token: string): string | null {
    try {
        console.log(`ACCESS_TOKEN_SECRET: ${ACCESS_TOKEN_SECRET}`);
        
        if(!ACCESS_TOKEN_SECRET || token === '') {
            return null;
        }
    
        const decodedUser = jwt.verify(token, ACCESS_TOKEN_SECRET);
    
        if(typeof(decodedUser) === "string") {
            return null;
        }
    
        if(!decodedUser || !decodedUser.id) {
            return null;
        }
    
        return decodedUser.id;
    } catch (error) {
        return null;
    }
}

wss.on('connection', async function connection(socket, request) {
    socket.on('error', console.error);

    try {
        const url = request.url;
    
        if(!url) {
            socket.close();
            return;
        }
    
        const queryParams = new URLSearchParams(url.split('?')[1]);
        const token = queryParams.get("token") || '';
        console.log(`Token: ${token}`);
        
    
        // getting the userId through jwt token
        const userId = checkUser(token);

        console.log(`UserId: ${userId}`);
        
    
        if(!userId) {
            socket.close();
            return;
        }
    
        const authenticatedUser = await prismaClient.user.findUnique({
            where: {
                id: userId
            }
        });

        console.log(authenticatedUser);
        
    
        if(!authenticatedUser) {
            socket.close();
            return;
        }
    
        socket.on('message', async function message(message) {
            //@ts-ignore
           const userMessage = JSON.parse(message.toString());
    
    
           //if the user wants to join a room in the server
           if(userMessage.type === "join_room") {
            const roomId = userMessage.payload.roomId;

            const authenticatedRoom = await prismaClient.room.findUnique({
                where: {
                    id: roomId
                },
                include: {
                    users: true
                }
            });

            console.log(authenticatedRoom);
            if(!authenticatedRoom) {
                socket.close();
                return;
            }

            // db call to add the user in the room
            if((authenticatedRoom.adminId !== userId) && (authenticatedRoom.users.some((user) => user.id !== userId))) {
                await prismaClient.room.update({
                    where: {
                        id: roomId
                    },
                    data: {
                        users: {connect: {id: userId}}
                    }
                });
            }

            // check if the room is already present or not
            if(allRoomSockets.get(roomId) !== undefined) {
                allRoomSockets.get(roomId)?.push(socket);
            } else {
                allRoomSockets.set(roomId, [socket]);
            }
            console.log("user joined room " + roomId);
           }

           //if the user wants to leave the room
           if(userMessage.type === "leave_room") {
            const roomId = userMessage.payload.roomId;

            const authenticatedRoom = await prismaClient.room.findUnique({
                where: {
                    id: roomId
                }
            });

            if(!authenticatedRoom) {
                socket.close();
                return;
            }

            // db call to remove the person from that room
            await prismaClient.room.update({
                where: {
                    id: roomId
                },
                data: {
                    users: {
                        disconnect: {id: userId}
                    }
                }
            });

            // remove that person from that room
            allRoomSockets.get(roomId)?.filter((s) => s != socket);
            socket.close();
           }
    
           //if the user wants to send the message to all the user in the particular room
           if(userMessage.type === "chat") {
            console.log("User wants to chat.");
            const roomId = userMessage.payload.roomId;

            const joinedUser = await prismaClient.room.findFirst({
                where: {
                    id: roomId,
                    users: {
                        some: {
                            id: userId
                        }
                    }
                }
            });

            console.log(joinedUser);
            

            if(!joinedUser) {
                socket.send("Client is not present in the room.");
                socket.close();
                return;
            }

            const message = await prismaClient.chat.create({
                data: {
                    chat: userMessage.payload.message,
                    userId,
                    roomId
                }
            });

            if(!message) {
                socket.send("Something went while propagating the message in the room.");
                socket.close();
                return;
            }

            // check if the user is present in that room or not
            if(!allRoomSockets.get(roomId)?.includes(socket)) {
                socket.send("Client is not present in the room!");
            } else {
                // if present then send the message to all sockets in the room
                allRoomSockets.get(roomId)?.forEach(s => s.send(userMessage.payload.message));
            }
           }
        });
    
    
    
        socket.on('disconnect', function disconnect() {
            allRoomSockets.forEach((allSockets) => {
                console.log(socket, " disconnected!");
                allSockets = allSockets.filter(s => s != socket);
            });
        });
        
    } catch (error) {
        console.log(error);
        socket.close();
    }
});