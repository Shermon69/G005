import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    name : {
        type: String,
        required: true,
        trim: true
    },

    email : {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    role : {
        type: String,
        enum: ['customer', 'restaurant', 'delivery', 'admin'],
        default: 'customer'
    },

    phone : {
        type: String
    },

    address : {
        type: String
    },

    restaurantName : {
        type: String
    },

    verified : {
        type: Boolean,
        default: false
    },

    vehicleType : {
        type: String
    },

    license : {
        type: String
    },

    createdAt : {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);
export default User;
