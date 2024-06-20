// src/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

UserSchema.index({ email: 1 }); // Indexing for performance

module.exports = mongoose.model('User', UserSchema);
