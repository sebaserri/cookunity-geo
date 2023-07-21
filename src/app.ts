import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
dotenv.config();

import { errorMiddleware } from "./middlewares/error.middleware";

import logger from "morgan";

import { IndexRouter } from "./routes";

const app: Application = express();

app.use(cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("tiny"));

app.use("/api", new IndexRouter().router);

app.use(errorMiddleware);

export default app;
