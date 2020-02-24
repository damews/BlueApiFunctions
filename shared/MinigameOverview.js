const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const minigameOverviewSchema = mongoose.Schema({
    pacientId: { type: String },
    flowData: [{ flowValue: Number, timestamp: Date }],
    minigameType: { type: String },
    gameDevice: { type: String },
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('MinigameOverview', minigameOverviewSchema);