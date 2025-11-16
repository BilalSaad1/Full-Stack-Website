const mongoose = require('mongoose');

const revSchema = new mongoose.Schema({
    rating: {type: Number, required: true, min: 1, max: 10},
    flagged: {type: Boolean, default: false},
    review: {type: String}
});

const listSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String},
    heroes: [{type: Number, required: true}],
    visibility: {type: String, enum: ['public', 'private'], default: 'private'},
    nickname: {type: String},
    email: {type: String},
    date: {type: Date, default: Date.now},
    reviews: [revSchema]
});

const List = mongoose.model('List', listSchema);

module.exports = List;