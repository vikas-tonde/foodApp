import express from "express";
import { Donation } from '../models/dontation.js'
import pkg from "jsonwebtoken";

const Jwt = pkg;
const router = new express.Router();

router.post("/add", async (req, res) => {
    const token = req.headers.authorization;
    const claims = await Jwt.verify(token, "secret");

    const donation = new Donation({
        donor: claims._id,
        location: req.body.location
    });
    req.body.items.forEach(element => {
        donation.items.push({ name: element });
    });
    await donation.save((err, result) => {
        if (err) {
            return res.status(400).send({
                messaage: "Failed to add the donation details"
            });
        }
        return res.status(200).send({
            messaage: "Success"
        });
    });
});

router.get("/", async (req, res) => {
    const token = req.headers.authorization;
    const claims = await Jwt.verify(token, "secret");
    const pageSize = 4;
    var pagenumber = req.query.page;
    var result = await Donation.find({"_id" : claims._id})
        .limit(pageSize)
        .skip((pagenumber - 1) * pageSize)
        .exec();

    return res.status(200).send({
        data: result
    });
});

// Donation.find()
//     .limit(pagesize)
//     .skip(pagenumber - 1 * pageSize)
//     .exec();

// Student.aggregate([{
//     $lookup: {
//         from: "worksnapsTimeEntries", // collection name in db
//         localField: "_id",
//         foreignField: "student",
//         as: "worksnapsTimeEntries"
//     }
// }]).exec(function(err, students) {
//     // students contain WorksnapsTimeEntries
// });

export default router;