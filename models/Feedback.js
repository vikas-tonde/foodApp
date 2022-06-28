import mongoose, { Schema } from "mongoose";

var schema = mongoose.Schema;
var o = schema.objectId;
const item = new Schema(
    {
        name: String,
        required: true
    }
);
const feedbackSchema = new mongoose.Schema(
    {
        donationId: {
            type: o,
            required: true,
            ref: 'Donation'
        },
        recipient: {
            type: o,
            ref: 'User'
        },
        location: {
            type: String,
            required: true
        }
    }, { collection: 'Feedback' }
);

export const Donation = mongoose.model('Feedback', feedbackSchema);