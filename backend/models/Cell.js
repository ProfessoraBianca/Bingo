//Cell.js
const mongoose = require('mongoose');

const cellSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    names: { type: [String], default: [] },
    clicks: { type: Number, default: 0 }
});

module.exports = mongoose.model('Cell', cellSchema);
