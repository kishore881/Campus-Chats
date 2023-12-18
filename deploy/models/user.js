const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            lowercase: true,
            unique: true,
            required: [true, "email cannot be blank"],
            index: true,
        },
        status:{
            type: String,
            default: "pending"
        },
        password:{
            type: String,
            required: [true, "password cannot be blank"],
        },
        salt: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

module.exports = mongoose.model('User', UserSchema);