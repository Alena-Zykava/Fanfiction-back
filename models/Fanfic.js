const { Schema, model } = require('mongoose');

const Fanfic = new Schema({
    title: { type: String, unique: true, required: true },
    shortDescription: { type: String, require: true },
    userName: { type: String, require: true },
    subtitle: { type: String, require: true },
    lastDataUpdate: { type: String, require: true } //Data.now??
});

module.exports = model('Fanfic', Fanfic);