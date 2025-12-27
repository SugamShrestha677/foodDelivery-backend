const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const customerSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique:true,
    },
    password: {
      type: String,
      required: true,
      minlength:8,
    },
    phone:{
      type:String,
      required:true,
      minlength:10,
    }
  },
  { timestamps: true }
);

customerSchema.pre("save",async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

customerSchema.methods.comparePassword = function(candidatePassword){
    return bcrypt.compare(candidatePassword,this.password);
};

module.exports = mongoose.model("Customer",customerSchema);
