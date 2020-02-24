const mongoose = require('mongoose');

const PlataformFlowOverviewSchema = mongoose.Schema({
    pacientId: { type: String },
    flowData: { type: [{ flowValue: Number, timestamp: Date }] }
},
    { timestamps: { createdAt: 'created_at' } }
);

module.exports = mongoose.model('PlataformFlowOverview', PlataformFlowOverviewSchema);