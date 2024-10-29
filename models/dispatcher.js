const mongoose = require('mongoose');

const dispatcherSchema = new mongoose.Schema({
    dispatcher_id: Number,
    name: String,
    email: String,
    phone: String,
    commission_rate: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { collection: 'dispatcher' });

const Dispatcher = mongoose.model('Dispatcher', dispatcherSchema);

module.exports = Dispatcher;
