import { Router } from "express";
import { UserType } from "../type";
import { User } from "../model/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authUser } from "../middleware/userAuth";

export const userRoute = Router();

userRoute.post('/register', async (req, res) => {
    try {
        const { username, email, password, fullName, gender, dateOfBirth, country }: UserType = req.body;

        
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({ username, email, password, fullName, gender, dateOfBirth, country });
        res.status(201).json({ status: true, message: 'User registered successfully' });
    } catch (error: any) {
        res.status(500).json({ message: "User is not created.", status: false });
    }
});

userRoute.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const secreat = process.env.JWT_SECRET || "jsonwebToken";
        const token = jwt.sign({ id: user._id }, secreat, { expiresIn: '1h' });
        res.json({ token: token, user: user });
    }  catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

userRoute.get("/search", authUser, async (req, res) => {
    try {
        const { query } = req.query;
        console.log(query);

        if (!query || typeof query !== 'string') {
            res.status(400).json({ message: 'A valid query parameter is required' });
            return;
        }
        
        const user = await User.findOne({ 
            $or: [
                { username: query }, 
                { email: query }
            ]
        });
        
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        
        res.status(200).json({ user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
        return;
    }
})