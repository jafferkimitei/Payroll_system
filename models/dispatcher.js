const mongoose = require('mongoose');
const Counter = require('./Counter');

const dispatcherSchema = new mongoose.Schema({
    dispatcher_id: {
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    commission_rate: {
        type: Number,
        required: true,
        min: 0,
        max: 30,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { collection: 'dispatcher' });

// Pre-save hook to auto-increment dispatcher_id
dispatcherSchema.pre('save', async function (next) {
    const dispatcher = this;

    // Only increment if the document is new
    if (dispatcher.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { model: 'Dispatcher' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            dispatcher.dispatcher_id = counter.seq;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const Dispatcher = mongoose.model('Dispatcher', dispatcherSchema);
module.exports = Dispatcher;
