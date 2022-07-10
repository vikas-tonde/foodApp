import pkg from "jsonwebtoken";
import { User } from "../models/users.js";

const Jwt = pkg;

const recipientAuth = async (req, res, next) => {
    const token = req.headers.authorization;
    const claims = await Jwt.verify(token, "secret");
    const user = await User.findOne({ _id: claims._id });
    if (!user) {
        return res.status(404).send({
            messaage: "User not found"
        });
    }
    if(user.role!="recipient"){
        return res.status(403).send({
            messaage: "You are not allowed to access this URL"
        });
    }
    next();
}

export default recipientAuth;