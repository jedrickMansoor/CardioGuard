"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true,
        match: /^[A-Za-z\s-]+$/,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^\S+@\S+\.\S+$/,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 100,
    },
    role: {
        type: String,
        enum: ["patient", "doctor", "admin"],
        default: "patient",
    },
    address: {
        type: String,
        maxlength: 200,
        trim: true,
    },
    phoneNumber: {
        type: String,
        trim: true,
        match: /^\+?[1-9]\d{1,14}$/,
    },
    picture: {
        type: String,
        trim: true,
    },
    bio: {
        type: String,
        maxlength: 500,
        trim: true,
    },
    age: {
        type: Number,
        min: 0,
        max: 120,
        validate: {
            validator: Number.isInteger,
            message: "Age must be an integer",
        },
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },
    dateOfBirth: {
        type: Date,
    },
    doctorInfo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "DoctorInfo",
        default: null,
        validate: {
            validator: function (value) {
                if (this.role === "doctor" && !value && !this.isNew)
                    return false;
                return true;
            },
            message: "doctorInfo is required when role is doctor",
        },
    },
}, { timestamps: true });
// Create model
const UserModel = (0, mongoose_1.model)("User", UserSchema);
exports.default = UserModel;
