import mongoose from "mongoose";

const Schema = mongoose.Schema;
const o = Schema.ObjectId;
const item = new Schema(
    {
        name: String,
        quantity: Number,
        expiry: Number
    }, { _id: false }
);

const location = new Schema(
    {
        longitude: String,
        latitude: String,
    },
    { _id: false } 
);
const donationSchema = new mongoose.Schema(
    {
        items: [item],
        donor: {
            type: o,
            required: true,
            ref: 'User'
        },
        recipient: {
            type: o,
            ref: 'User'
        },
        location: {
            type: location,
            required: true
        },
        dateAdded: {
            type: Date,
            default: Date.now()
        },
        address: {
            type: String,
            required: true,
        },
        images:[{
            type:String
        }]
    }, { collection: 'Donation', versionKey: false }
);

export const Donation = mongoose.model('Donation', donationSchema);