import mongoose, { Schema } from "mongoose";

var schema = mongoose.Schema;
var o = schema.objectId;
const item = new Schema(
    {
        name: String,
        required: true
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
            type: String,
            required: true
        }
    }, { collection: 'Donation' }
);

export const Donation = mongoose.model('Donation', donationSchema);