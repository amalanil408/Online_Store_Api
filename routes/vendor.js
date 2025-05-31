const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vendor = require("../models/vendor");

const vendorRouter = express.Router();


vendorRouter.post('/api/vendor/signup', async(req,res) => {
    try {
        const {fullName,email,password} = req.body;
        const existingEmail = await Vendor.findOne({email});
        if(existingEmail){
            return res.status(400).json({msg : "vendor with same email already exist"});
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            let vendor = new Vendor({
                fullName,
                email,
                password : hashedPassword
            });
            vendor = await vendor.save();
            res.json({vendor});
        }
    } catch (e) {
        res.status(500).json({error : e.message});
    }
});


vendorRouter.post('/api/vendor/signin' ,async(req,res) => {
    try {
        const {email,password} = req.body;
        const findVendor = await Vendor.findOne({email});
        if(!findVendor){
            return res.status(400).json({msg : "vendor does not exist"})
        } else {
            const isMatched = await bcrypt.compare(password,findVendor.password);
            if(!isMatched){
               return res.status(400).json({msg : "Password does not match"});
            } else {
                const token = jwt.sign({id : findVendor._id},"passwordKey");
                const {password, ...vendorWithoutPassword} = findVendor._doc;
                res.json({token,vendor:vendorWithoutPassword});
            }
        }
    } catch (e) {
        res.status(500).json({error : e.message});
    }
});



vendorRouter.get('/api/vendors',async (req,res) => {
    try {
        const vendor = await Vendor.find().select('-password');
        return res.status(200).json(vendor);
    } catch (e) {
        res.status(500).json({error : e.message});
    }
})

module.exports = vendorRouter;