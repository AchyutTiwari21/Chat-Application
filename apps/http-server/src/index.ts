import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "1mb"}));
app.use(express.urlencoded({extended: true, limit: "1mb"}));
app.use(express.static("public"));
app.use(cookieParser());

// route import
import userRouter from "./routes/user.route";

// api declaration
app.use("/api/v1/user", userRouter);

app.listen(process.env.PORT, () => {
    console.log(`App is listening on port: ${process.env.PORT}`);
});