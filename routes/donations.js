import express from "express";
import { Donation } from '../models/dontation.js'

const router = new express.Router();

router.post("/register", (req, res) => {
    const donation = new Donation({
        items: [...req.body.items],

    });
});


export default router;