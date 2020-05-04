const mongoose = require('mongoose');

const GameTokenSchema = mongoose.Schema({
    token: { type: String },
    author: { type: String },
    description: { type: String },

},
    { timestamps: { createdAt: 'created_at' } }
);

module.exports = mongoose.model('GameToken', GameTokenSchema);