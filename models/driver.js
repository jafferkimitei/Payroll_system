const mongoose = require('mongoose');
const Counter = require('./Counter');

const driverSchema = new mongoose.Schema({
    driver_id: {
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    pay_rate: {
        type: Number,
        required: true,
        min: 0,
    },
    license_number: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { collection: 'driver' });

// Pre-save hook to auto-increment driver_id
driverSchema.pre('save', async function (next) {
    const driver = this;

    
    if (driver.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { model: 'Driver' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            driver.driver_id = counter.seq;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
