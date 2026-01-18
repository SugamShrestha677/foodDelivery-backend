const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const restaurantSchema = new mongoose.Schema({
        name:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },
        location:{
            type:String,
            required:true,
            trim:true
        },
        cuisine: {
            name: {
                type: String,
                required: true,
                trim: true
            },
            image: {
                type: String,
                required: true,
                default: ''
            },
            description: {
                type: String,
                default: ''
            }
        },
        description:{
            type:String,
            trim:true
        },
        website:{
            type:String,
            trim:true,
            unique:true
        },
        email:{
            type:String,
            trim:true,
            unique:true,
            required:true,
            lowercase: true,
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
        },
        logoImage: {
            type: String,
            required:true,
            default: 'https://res.cloudinary.com/dxtszq4xi/image/upload/v1768633287/download_ud9hr7.jpg'
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        socialMedia: {
            facebook: String,
            instagram: String,
            twitter: String
        }
},
 { timestamps: true }
)

restaurantSchema.pre("save",async (next) => {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

restaurantSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

module.exports=mongoose.model("Restaurant",restaurantSchema);