import express from "express";
import { Donation } from '../models/dontation.js'
import pkg from "jsonwebtoken";
import NodeMailer from 'nodemailer';
import { User } from "../models/users.js";


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
        let d = new Date(req.body.dateFilter)
        filter['dateAdded'] = { $gte: new Date(req.body.dateFilter), $lte: new Date(d.setDate(d.getDate() + 1)) };

    }
    let result = await Donation.find(filter);

    return res.status(200).send({
        data: result
    });
});

router.get("/search", async (req, res) => {
    let id = req.query.id;
    let filter = { recipient: { $exists: false }, _id: id }

    let result = await Donation.findOne(filter);

    return res.status(200).send({
        data: result
    });
});


router.post("/accept", async (req, res) => {
    /*
    donationId:Id of the donation,
    id:id of the recipient
    
    */
    const token = req.headers.authorization;
    const claims = await Jwt.verify(token, "secret");
    var query = { '_id': req.body.id, 'recipient': { $exists: false } };
    var recipient = { 'recipient': claims._id }
    let user = await User.findOne({_id:claims._id});
    Donation.findOneAndUpdate(query, recipient, async (err, doc) => {
        if (err)
            return res.status(424).send({ error: "Failed to allocate" });
        let transporter = NodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: "tondev98@gmail.com",
                pass: "onnqgmddgamvdjbj"
            }
        });
        let details = {
            from: "tondev98@gmail.com",
            to: user.email,
            subject: "Collect Your food",
            text: `Collect your food from ${doc.address} city ${doc.city}`
        }
        transporter.sendMail(details, async (errr) => {
            if (errr) {
                return res.status(400).send({
                    messaage: "Error occured"
                });
            }
            let result = await Donation.find({ recipient: { $exists: false } });
            console.log(result)
            return res.status(200).send({
                data: result
            });
        });
        // return res.send("Successfully Accepted... Please go to the location and receive.");
    });
});

router.get("/history", async (req, res) => {
    const token = req.headers.authorization;
    const claims = await Jwt.verify(token, "secret");
    var result = await Donation.find({ recipient: claims._id })

    if (!result) {
        return res.status(404).send({ message: "You haven't accepted any donation yet." });
    }
    return res.status(200).send({
        data: result
    });
})

router.post("/history", async (req, res) => {
    /*
    date format: YYYY-MM-DD
    */
    const token = req.headers.authorization;
    const claims = await Jwt.verify(token, "secret");
    let d= new Date(req.body.to);
    let to = new Date(req.body.to).setDate(d.getDate()+1);
    let from = new Date(req.body.from);
    var data = await Donation.find({
        recipient: claims._id, dateAdded: {
            $gte: from,
            $lte: to
        }
    })
    if (!data) {
        return res.status(404).send({ message: "You haven't accepted any donation yet." });
    }
    return res.status(200).send({
        data
    });
})

export default router;
