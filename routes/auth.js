const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post('/api/signup', async(req,res) => {
    try {
        const {fullName,email,password} = req.body;
        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({msg : "user with same email already exist"});
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            let user = new User({
                fullName,
                email,
                password : hashedPassword
            });
            user = await user.save();
            res.json({user});
        }
    } catch (e) {
        res.status(500).json({error : e.message});
    }
});


authRouter.post('/api/signin' ,async(req,res) => {
    try {
        const {email,password} = req.body;
        const findUser = await User.findOne({email});
        if(!findUser){
            return res.status(400).json({msg : "user does not exist"})
        } else {
            const isMatched = await bcrypt.compare(password,findUser.password);
            if(!isMatched){
               return res.status(400).json({msg : "Password does not match"});
            } else {
                const token = jwt.sign({id : findUser._id},"passwordKey");
                const {password, ...userWithoutPassword} = findUser._doc;
                res.json({token,...userWithoutPassword});
            }
        }
    } catch (e) {
        res.status(500).json({error : e.message});
    }
});

module.exports = authRouter;