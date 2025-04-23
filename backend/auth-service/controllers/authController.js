import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

//for login
dotenv.config();

export const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            address,
            phone,
            restaurantName,
            vehicleType,
            license
        } = req.body;

        //check if the user already exists

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message : 'user already exists with this email.' });
        }

        //role based validation
        if (role === 'restaurant' && !restaurantName) {
            return res.status(400).json({ message : 'Restaurant name is required.'});
        }

        if (role === 'delivery' && !vehicleType) {
            return res.status(400).json({ message : 'vehicle type is required'});
        }

        //Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create a new user
        const newUser = new User ({
            name,
            email,
            password: hashedPassword,
            role,
            address,
            phone,
            restaurantName,
            vehicleType,
            license
        });
        
        await newUser.save();

        res.status(201).json({ message : 'User registered successfully! '});
    }
    catch (err) {
        console.errir('Error in registering user', err.message);
        res.status(500).json({ message : 'Server Error' });
    }
};


export const loginUser = async (req, res) => {
    try {

        const { email , password } = req.body;

        //check if user exists

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message : 'User does not exists.' });
        }

        //comparing the password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message : 'invalid credentials.' });
        }

        //Creating jwt token
        const payLoad = {
            id: user._id,
            role : user.role,
            email: user.email,
            name: user.name
        };

        const token = jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    }
    catch (err) {
        console.error('Error in loginUser: ', err.message);
        res.status(500).json({ message : 'Server Error' });
    }

};


// ADmin only - get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); //To exclude the password
        res.status(200).json(users);
    }
    catch (err) {
        console.error('Error in getting all users: ', err.message);
        res.status(500).json({ message : 'Server Error' });
    }
};

//Admin only delete a user
export const deleteUser = async (req, res ) => {
    try {
        const userId = req.params.id;

        const user = await User.findByIdAndDelete(userId);

        //if user does not exists
        if(!user) {
            return res.status(404).json({ message : 'User not found' });
        }

        res.status(200).json({ message : 'user deleted successfully. '});
    }
    catch (err) {
        console.error('Error in deleting user : ', err.message);
        res.status(500).json({ message : 'Server error'});
    }
};

//admin only get all restaurants
export const getPendingRestaurants = async (req, res) => {
    try {
        const pending = await User.find({ role : 'restaurant', verified: false}).select('-password');
        res.status(200).json(pending);
    }
    catch (err) {
        console.error('Error in getting all pending restaurants : ', err.message );
        res.status(500).json({ message : 'Server error' });
    }
};

//admin only - verify restaurants
export const verifyRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const { verified } = req.body;

        const user = await User.findById(restaurantId);

        if (!user || user.role !== 'restaurant') {
            return res.status(404).json({ message : 'Restaurant not found.'});
        }

        user.verified = verified;

        await user.save();

        res.status(200).json({ message : `Restaurant verification is set to ${verified}` });
    }
    catch (err) {
        console.error('Error in verifying restaurant.', err.message);
        res.status(500).json({ message : 'Server Error' });
    }
};




