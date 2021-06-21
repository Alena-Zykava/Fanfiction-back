const { Schema, model } = require('mongoose');

const Role = new Schema({
    value: { type: String, unique: true, default: "USER"}//unique??
});

module.exports = model('Role', Role); 