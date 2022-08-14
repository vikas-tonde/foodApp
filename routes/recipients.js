import express from "express";
import { Donation } from '../models/dontation.js'
import pkg from "jsonwebtoken";

const Jwt = pkg;
const router = new express.Router();

router.get("/", async (req, res) => {
    let result = await Donation.find({ recipient: { $exists: false } })

    return res.status(200).send({
        data: result
    });
});

router.post("/search", async (req, res) => {
    let filter = { recipient: { $exists: false } }
    if ("city" in req.body) {
        filter['city'] = req.body.city;
    }
    if ("dateFilter" in req.body) {
        let d=new Date(req.body.dateFilter)
        filter['dateAdded']={ $gte:new Date(req.body.dateFilter) , $lte:new Date(d.setDate(d.getDate()+1))};

    }
    let result = await Donation.find(filter);

    return res.status(200).send({
        data: result
    });
});

router.get("/search", async (req, res) => {
    let id = req.query.id;
    let filter = { recipient: { $exists: false },_id=id}

    let result = await Donation.find(filter);

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
            return res.status(424).send({ error: "Failed to allocate" });
        return res.send("Successfully Accepted... Please go to the location and receive.");
    });
});

router.get("/history", async (req, res) => {
    const token = req.headers.authorization;
    const claims = await Jwt.verify(token, "secret");
    const pageSize = 9;
    var pagenumber = req.query.page;
    var result = await Donation.find({ recipient: claims._id })

    if (!result) {
        return res.status(404).send({ message: "You haven't accepted any donation yet." });
    }
    return res.status(200).send({
        data: result
    });
})

export default router;
