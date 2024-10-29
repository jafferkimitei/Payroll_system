const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    load_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Load',
        required: true,
    },
    driver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true,
    },
    dispatcher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dispatcher',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    payment_date: {
        type: Date,
        default: Date.now,
    },
}, { collection: 'payment' });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
