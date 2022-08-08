import express from "express";
import bcrypt from 'bcryptjs';
import pkg from "jsonwebtoken";

import { User } from '../models/users.js'
import { Donation } from '../models/dontation.js'

const Jwt = pkg;
const router = new express.Router();

router.get("/donations", async (req, res) => {
    const pageSize = 4;
    var pagenumber = req.query.page;
    var result = await Donation.find()
        .limit(pageSize)
        .skip((pagenumber - 1) * pageSize)
        .exec();

    return res.status(200).send({
        data: result
    });
});

router.get("/users", async (req, res) => {
    const pageSize = 4;
    var pagenumber = req.query.page;
    var result = await User.find()
        .limit(pageSize)
        .skip((pagenumber - 1) * pageSize)
        .exec();

    return res.status(200).send({
        data: result
    });
});



export default router;