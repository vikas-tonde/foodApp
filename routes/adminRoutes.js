import express from "express";

import { User } from '../models/users.js'
import { Donation } from '../models/dontation.js'


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

router.get("/user", async (req, res) => {

    var email = req.query.email;
    var result = await User.find({ "email": email });
    if (!result) {
        return res.status(404).send({ message: "Invalid Email ID... No User found" });
    }
    return res.status(200).send({
        data: result
    });
});

router.get("/donation", async (req, res) => {

    var id = req.query._id;
    var result = await Donation.find({ _id: id });
    if (!result) {
        return res.status(404).send({ message: "Invalid Id... No donation found" });
    }
    return res.status(200).send({
        data: result
    });
});

router.get("/donations/count", async (req, res) => {
    var count = await Donation.estimatedDocumentCount();
    return res.status(200).send({ "count of donations": count });
});

router.get("/users/count", async (req, res) => {
    var count = await User.estimatedDocumentCount();
    return res.status(200).send({ "count of donations": count });
});

export default router;