import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { config } from "dotenv";

config();
const url = process.env.MONGO_URL || "";

mongoose.connect(url) //connect mongoDB
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


// USER model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    country: { type: String, required: true }
});

// Hash the password when the data is saved in databse
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) 
        return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//create model for storing and accessing data
export const User = mongoose.model('User', userSchema);