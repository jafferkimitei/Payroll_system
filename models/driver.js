const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    driver_id: String,
    name: String,
    phone: String,
    pay_rate: Number,
    createdAt: Date,
}, { collection: 'driver' }); 

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
