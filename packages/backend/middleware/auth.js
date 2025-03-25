const jwt = require("jsonwebtoken");
const router = require("../routes/auth");

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        let decodedData;
        if (token) {
            decodedData = await jwt.verify(token, process.env.SECRET_TOKEN);
            req.userId = decodedData?.id;
        }else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.id;
        }
        next();
    }catch (error) {

    }
}

module.exports = auth;
