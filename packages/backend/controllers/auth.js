const Auth = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const register = async (req, res) => {
    try {
        const {username, firstName, lastName, email,phoneNumber,password} = req.body;
        const user = await Auth.findOne({email})

        if (user) {
            return res.status(500).json({message: "bu hesap var zaten"});
        }
        if (password.length <= 5) {
            return res.status(500).json({message: "parola 6dan az"});
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const newUser = await Auth.create({username, firstName, lastName, email,phoneNumber, password : passwordHash})

        const userToken = await jwt.sign({id : newUser.id},process.env.SECRET_TOKEN , {expiresIn: "1h"});

        res.status(201).json({
            status: "ok",
            newUser,
            userToken,
        });

    }catch(err) {
        return res.status(500).json({message: err.message});
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await Auth.findOne({email})
        if (!user) {
            return res.status(500).json({message: "böyle bir kullanıcı bulunamadı"});
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(500).json({message: "YANLIŞ ŞİFRE"});
        }
        const token = jwt.sign({id : user.id },process.env.SECRET_TOKEN , {expiresIn: "1h"});
        res.status(200).json({
            status: "ok",
            user,
            token,
        })
    }catch(err) {
        return res.status(500).json({message: err.message});
    }
}

module.exports = {register ,login};
