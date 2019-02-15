'use strict'

let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    user: {
        type: String, 
        index: true,
        unique: true,
        lowercase: true,
        required: [true, 'User is required.'],
    },
    email: { 
        type: String, 
        unique: true,
        index: true 
    },
    password: {
        type: String,
        required: [true, 'Password is required.']
    },
    role: {
        type: String,
        enum: ['ROLE_ADMIN', 'ROLE_CLIENT']
    }
}, { collation: { locale: 'es', strength: 2 } });

userSchema.index({ name: 'text', user: 'text', email: 'text' });

module.exports = mongoose.model('users', userSchema);