import express from "express";
import bcrypt from 'bcryptjs';
import { User } from '../models/users.js'

import pkg from "jsonwebtoken";
const Jwt = pkg;

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const cookie = req.cookies['jwt'];
        const claims = Jwt.verify(cookie, "secret");
        if (!claims) {
            return res.status(401).send({
                messaage: "Unauthenticated"
            });
        }
        const user = await User.findOne({ _id: claims._id });
        const { password, ...data } = await user.toJSON();
        res.send(data);
    } catch (e) {
        return res.status(401).send({
            messaage: "Unauthenticated"
        });
    }
});

router.post('/register', (req, res) => {
    (async function () {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
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
    const token = Jwt.sign({ _id: user._id }, "secret")
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 12 * 60 * 60 * 1000
    });
    res.send({
        message: "success"
    });
});

router.post("/logout", (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 });
    res.send({
        messaage: "You have been logged out"
    });
});

export default router;