const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Vendor = require("../models/vendor");

const auth = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res
        .status(401)
        .json({ msg: "No Authentication Token, authorization denied" });
    const verified = jwt.verify(token, "passwordKey");
    if (!verified)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied" });

    // const user = await User.findById(verified.id) || Vendor.findById(verified.id);

    // if(!user) return res.status(401).json({msg : "User or Vendor not found, authorization denied"})

    let user = await User.findById(verified.id);
    if (!user) {
      user = await Vendor.findById(verified.id);
    }

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

const vendorAuth = (req, res, next) => {
  try {
    if (!req.user.role || req.user.role !== "vendor") {
      return res
        .status(403)
        .json({ msg: "Accrss denied, only vendors allowed" });
    }
    next();
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

module.exports = { auth, vendorAuth };
