const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    load_id: Number,
    driver_id: String,
    dispatcher_id: Date,
    amount: Number,
    payment_date: Date,
}, { collection: 'payment' });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
