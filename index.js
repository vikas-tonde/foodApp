import express from "express";
import bodyParser from 'body-parser';
import usersRoutes from "./routes/users.js";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'

dotenv.config()
mongoose.connect(process.env.MONGO_URL, () => {
    console.log("Database connected");
});

const app = express();
const PORT = 5000;

// var corsOptions = {
//     origin: `http://localhost:${PORT}`

// }

app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "*"
}));
app.use(bodyParser.json());
app.use("/users", usersRoutes);

app.listen(PORT, () => console.log(`Server is runnning on port : http://localhost:${PORT}`));