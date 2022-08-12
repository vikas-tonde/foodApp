import express from "express";
import { Donation } from '../models/dontation.js'
import pkg from "jsonwebtoken";
import multer from "multer";

const Jwt = pkg;
const router = new express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post("/add", upload.array('image'), async (req, res) => {
    const token = req.headers.authorization;
    const claims = await Jwt.verify(token, "secret");
    const donation = new Donation({
        donor: claims._id,
        location: req.body.location,
        address: req.body.address
    });
    req.body.items.forEach(element => {
        donation.items.push({
            name: element.name,
            quantity: element.quantity,
            expiry: element.expiry
        });
    });
    if(req.files.length){
        req.files.forEach(element=>{
            donation.images.push(element.path);
        });
    }
    await donation.save((err, result) => {
        if (err) {
            console.log(err);
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
    var result = await Donation.find({ "donor": claims._id })
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


router.get("/history", async (req, res) => {
    const token = req.headers.authorization;
    const claims = await Jwt.verify(token, "secret");
    var result = await Donation.find({ donor: claims._id })

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
    const pageSize = 9;
    var pagenumber = req.query.page;
    var result = await Donation.find({ donor: claims._id })
        .limit(pageSize)
        .skip((pagenumber - 1) * pageSize)
        .exec();

    if (!result) {
        return res.status(404).send({ message: "You haven't accepted any donation yet." });
    }
    return res.status(200).send({
        data: result
    });
})

export default router;