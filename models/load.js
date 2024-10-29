const mongoose = require('mongoose');

const loadSchema = new mongoose.Schema({
    load_id: Number,
    from_location: String,
    to_location: String,
    rate: Number,
    dispatcher_id: String,
    driver_id: String,
    createdAt: Date,
},{ collection: 'load' }); 

const Load = mongoose.model('Load', loadSchema);

module.exports = Load;
