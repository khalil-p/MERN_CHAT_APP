import express from "express";
import cookiParser from "cookie-parser";
import { config } from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import { dbConnect } from "./database/db.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.route.js"
const app = express();

config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(cookiParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);

dbConnect();
export default app;
