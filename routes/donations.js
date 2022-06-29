import express from "express";
import { Donation } from '../models/dontation.js'
import pkg from "jsonwebtoken";

const Jwt = pkg;
const router = new express.Router();

router.post("/register", (req, res) => {
    const cookie = req.cookies['jwt'];
    const claims = Jwt.verify(cookie, "secret");

    const donation = new Donation({
        items: [...req.body.items],
        donor: claims._id,
        location: req.body.location
    });
});


export default router;