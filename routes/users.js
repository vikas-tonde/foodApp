import express from "express";
import bcrypt from 'bcryptjs';
import NodeMailer from 'nodemailer';
import pkg from "jsonwebtoken";

import { User } from '../models/users.js'
import requireAuth from '../middleware/authMiddleware.js';
import generateOTP from "../helpers/generateOtp.js";

const Jwt = pkg;

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    const token = req.headers.authorization;
    const claims = Jwt.verify(token, "secret");

    const user = await User.findOne({ _id: claims._id });
    if (!user) {
        return res.status(404).send({
            messaage: "user not found"
        });
    }
    const { password, ...data } = await user.toJSON();
    res.send(data);
});

router.post('/register', (req, res) => {
    (async function () {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
            adhaarNumber: req.body.adhaarNumber,
            address: req.body.address,
            location: req.body.location
        })
        const result = await user.save();
        const { password, ...data } = result.toJSON();
        res.send(data);
    })().catch(err => {
        res.status(424).send({
            messaage: "Register unsuccessfull"
        });
    });
});

router.post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).send({
            messaage: "user not found"
        });
    }
    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send({
            messaage: "Invalid Credentials"
        });
    }
    const token = Jwt.sign({ _id: user._id }, "secret", {
        expiresIn: 86400 // expires in 24 hours
    });
    res.send({
        jwt: token,
        role: user.role,
        name: user.name
    });
});

// router.post("/logout", (req, res) => {
//     res.cookie('jwt', '', { maxAge: 0 });
//     res.send({
//         messaage: "You have been logged out"
//     });
// });

router.post('/forgot', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).send({
            messaage: "User not found"
        });
    }
    const otp= generateOTP();
    await User.updateOne({email:user.email}, {otp:otp});
    let transporter = NodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: "tondev98@gmail.com",
            pass: "onnqgmddgamvdjbj"
        }
    });
    let details = {
        from: "tondev98@gmail.com",
        to: req.body.email,
        subject: "Reset your Password",
        text: "Your OTP is :" + otp
    }
    transporter.sendMail(details, (err) => {
        if (err) {
            res.status(400).send({
                messaage: "Error occured"
            });
        }
        res.status(200).send({
            messaage: "OTP has been send check your mail"
        });
    });
});

export default router;