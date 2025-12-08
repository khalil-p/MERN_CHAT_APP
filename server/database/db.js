import mongoose from "mongoose";

export const dbConnect = () => [
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "MERN_STACK_CHAT_APPLICAITION",
    })
    .then(() => {
      console.log("Connected to database.");
    })
    .catch((err) => {
      console.log(`Error connecting to database: ${err.message || err}`);
    }),
];
