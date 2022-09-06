import express from "express";

import { User } from '../models/users.js'
import { Donation } from '../models/dontation.js'


const router = new express.Router();

router.post("/donations", async (req, res) => {
    let d = new Date(req.body.dateFilter)
    let result = {}
    if ("dateFilter" in req.body) {
        result = await Donation.find({ dateAdded: { $gte: new Date(req.body.dateFilter), $lte: new Date(d.setDate(d.getDate() + 1)) } });
    }
    else {
        result = await Donation.find();
    }

    let r = []
    for (let x of result) {
        let u = await User.findOne({ _id: x.donor });

        if (x.recipient) {
            let recipient = await User.findOne({ _id: x.recipient });
            r.push({ donor: u.name, "recipient": recipient.name, donation: x });
        }
        else
            r.push({ donor: u.name, "recipient": '', donation: x });

    }
    return res.status(200).send({
        data: r
    });
});

router.get("/users", async (req, res) => {
    var result = await User.find()

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