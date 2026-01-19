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
       const existingUser = await Customer.findOne({
    $or: [
        { email: email.toLowerCase() },
        { username }
    ]
});
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const cutomer = new Customer({
            username,
            email:email.toLowerCase() ,
            password,
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

    const customer = await Customer.findOne({ email:email.toLowerCase() });
    if (!customer) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    console.log("Stored password:", customer.password);
    console.log("Login input password:", password);
    const token = jwt.sign({ id: customer._id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRATION,
    });

    // Exclude password before sending back customer data
    const { password: _ , ...safecustomer } = customer.toObject();

    res.status(200).json({
      message: "Login successful",
      token,
      customer: safecustomer, // optional, sends customer data without password
    });
    
    } catch (error) {
        console.log("Error logging in customer:", error);
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