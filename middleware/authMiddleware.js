import pkg from "jsonwebtoken";

import { User } from "../models/users.js";

const Jwt = pkg;

const requireAuth = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({
            messaage: "Unauthenticated"
        });
    }
    await Jwt.verify(token, "secret", async (err, decodedToken) => {
        if (err) {
            return res.status(401).send({
                messaage: "Unauthenticated" + err.messaage
            });
        }

        const user = await User.findOne({ _id: decodedToken._id });

        if (!user) {
            return res.status(404).send({
                messaage: "User not found"
            });
        }
        next();
    });
}

export default requireAuth;