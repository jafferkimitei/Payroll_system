const mongoose = require('mongoose');
const Counter = require('./Counter');

const loadSchema = new mongoose.Schema({
    load_id: {
        type: Number,
        unique: true, 
    },
    from_location: {
        type: String,
        required: true,
    },
    to_location: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
        min: 0, 
    },
    dispatcher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dispatcher',
        required: true,
    },
    driver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true,
    },
    dispatcher_fee: {
        type: Number,
        default: 0,
    },
    driver_fee: {
        type: Number,
        default: 0,
    },
    balance: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { collection: 'load' });

// Pre-save middleware to calculate fees and increment load_id
loadSchema.pre('save', async function (next) {
    const rate = this.rate;
    this.dispatcher_fee = rate * 0.03;
    this.driver_fee = rate * 0.20;
    this.balance = rate - this.dispatcher_fee - this.driver_fee;

    // Auto-increment load_id
    const counter = await Counter.findOneAndUpdate(
        { model: 'Load' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    this.load_id = counter.seq;

    next();
});

module.exports = mongoose.model('Load', loadSchema);
