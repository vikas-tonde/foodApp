import pkg from "jsonwebtoken";

import { User } from "../models/users.js";

const Jwt = pkg;

const requireAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).send({
            messaage: "Unauthenticated"
        });
    }
    var dtoken;
    await Jwt.verify(token, "secret", (err, decodedToken) => {
        if (err) {
            return res.status(401).send({
                messaage: "Unauthenticated" + err.messaage
            });
        }
        dtoken=decodedToken;
    });
    const user =await User.findOne({_id:dtoken._id});
 
    if(!user){
        return res.status(404).send({
            messaage: "User not found"
        });
    }
    next();
}

export default requireAuth;