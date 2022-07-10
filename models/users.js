import mongoose from "mongoose";

const Schema = mongoose.Schema;
const Location = new Schema(
    {
        longitude: String,
        latitude: String,
    },
    { _id: false }
);
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        adhaarNumber: {
            type: Number,
            required: true,
            length: 12,
            unique: true
        },
        address: {
            type: String,
            required: true,
        },
        location:{
            type:Location,
            required:true
        }
    }, { collection: 'User' }
);

export const User = mongoose.model('User', userSchema);