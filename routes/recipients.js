import express from "express";
import { Donation } from '../models/dontation.js'
import pkg from "jsonwebtoken";

const Jwt = pkg;
const router = new express.Router();

router.get("/", async (req, res) => {
    const pageSize = 9;
    var pagenumber = req.query.page;
    var result = await Donation.find({}, { '_id': 0 })
        .limit(pageSize)
        .skip((pagenumber - 1) * pageSize)
        .exec();

    return res.status(200).send({
        data: result
    });
});


export default router;
