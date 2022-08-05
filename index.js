import express from "express";
import bodyParser from 'body-parser';
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'

import usersRoutes from "./routes/users.js";
import donationRoutes from './routes/donations.js';
import recipientRoutes from './routes/recipients.js'
import adminRoutes from './routes/adminRoutes.js'
import requireAuth from './middleware/authMiddleware.js';
import donorAuth from './middleware/donorMiddleware.js';
import recipientAuth from "./middleware/recipientMiddleware.js";
import adminAuth from "./middleware/adminMiddleware.js";

dotenv.config()

mongoose.connect(process.env.MONGO_URL, () => {
    console.log("Database connected");
});
const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "*"
}));
app.use(bodyParser.json());
app.use("/users", usersRoutes);
app.use("/donation", requireAuth, donorAuth, donationRoutes);
app.use('/recipient', requireAuth, recipientAuth, recipientRoutes);
app.use('/admin', requireAuth, adminAuth, adminRoutes);

app.listen(PORT, () => console.log(`Server is runnning on port : http://localhost:${PORT}`));