const config = require("../config/config");
const jwt = require("jsonwebtoken");
const Customer = require("../models/customerModels");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
    try {
        const {username,fullname,email,password,phone}=req.body;
        if (!username || !fullname || !email || !password || !phone) {
             return res.status(400).json({ error: "All fields are required." });
        }
        const existingUser = await Customer.findOne({email, username});
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const cutomer = new Customer({
            username,
            email,
            password: hashedPassword,
            fullname,
            phone

        });
        await cutomer.save();
        res.status(201).json({ message: "Customer registered successfully", cutomer });
    } catch (error) {
        console.log("Error registering user", error);
        res.status(500).json({ error: "Server error! Please Try Again Later!"
    });
};
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRATION,
    });

    // Exclude password before sending back user data
    const { password: _ , ...safeUser } = user.toObject();

    res.status(200).json({
      message: "Login successful",
      token,
      user: safeUser, // optional, sends user data without password
    });
    
    } catch (error) {
        console.log("Error logging in user:", error);
        res.status(500).json({error:"Server error. Please try again later."})
    }
}

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().select("-password");
    res.status(200).json({ customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
module.exports={register, login, getAllCustomers};