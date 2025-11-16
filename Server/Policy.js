const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    type: { type: String, required: true, unique: true },
    content: { type: String, required: true }
});

module.exports = mongoose.model('Policy', policySchema);