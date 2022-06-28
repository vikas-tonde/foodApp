import pkg from "jsonwebtoken";
const Jwt = pkg;

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).send({
            messaage: "Unauthenticated"
        });
    }
    Jwt.verify(token, "secret", (err, decodedToken) => {
        if (err) {
            return res.status(401).send({
                messaage: "Unauthenticated" + err.messaage
            });
        }
        console.log(decodedToken);
        next();
    });
}

export default requireAuth;