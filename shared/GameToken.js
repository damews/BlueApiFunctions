const mongoose = require('mongoose');

const GameTokenSchema = mongoose.Schema({
    name: { type: String },
    token: { type: String },
},
    { timestamps: { createdAt: 'created_at' } }
);

module.exports = mongoose.model('GameToken', GameTokenSchema);