'use strict'

let mongoose = require('mongoose');

let companySchema = mongoose.Schema({
    name: {
        type: String, 
        index: true,
        required: [true, 'Name is required.']
    },
    Location: String,
    direction: String,
    website: String,
    information: String
}, { collation: { locale: 'es', strength: 1 } });

companySchema.index({ name: 'text' });

module.exports = mongoose.model('companies', companySchema);