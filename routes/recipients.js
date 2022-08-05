import express from "express";
import { Donation } from '../models/dontation.js'
import pkg from "jsonwebtoken";

const Jwt = pkg;
const router = new express.Router();

router.get("/", async (req, res) => {
    const pageSize = 9;
    var pagenumber = req.query.page;
    var result = await Donation.find({ recipient: { $exists: false } })
        .limit(pageSize)
        .skip((pagenumber - 1) * pageSize)
        .exec();

    return res.status(200).send({
        data: result
    });
});

router.post("/accept", async (req, res) => {
    /*
    donationId:Id of the donation,
    id:id of the recipient
    
    */
    var query = { '_id': req.body.donationId, 'recipient': { $exists: false } };
    var recipient = { 'recipient': req.body.id }
    Donation.findOneAndUpdate(query, recipient, function (err, doc) {
        if (err)
            return res.send(500, { error: "Failed to allocate" });
        return res.send("Successfully Accepted... Please go to the location and receive.");
    });
});

router.get("/history", async (req, res) => {
    const token = req.headers.authorization;
    const claims = await Jwt.verify(token, "secret");
    const pageSize = 9;
    var pagenumber = req.query.page;
    var result = await Donation.find({ recipient: claims_id })
        .limit(pageSize)
        .skip((pagenumber - 1) * pageSize)
        .exec();

    if (!result) {
        return res.status(404).send({ message: "You haven't accepted any dination yet." });
    }
    return res.status(200).send({
        data: result
    });
})

export default router;
