import mongoose from "mongoose";

const Schema = mongoose.Schema;
const o = Schema.ObjectId;
const item = new Schema(
    {
        name: String,
        // required: true
    }
);

const location = new Schema(
    {
        longitude: String,
        latitude: String, 
    }
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
        }
    }, { collection: 'Donation' }
);

export const Donation = mongoose.model('Donation', donationSchema);