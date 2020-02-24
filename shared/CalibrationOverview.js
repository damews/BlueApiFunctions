const mongoose = require('mongoose');

const CalibrationOverviewSchema = mongoose.Schema({
    pacientId: { type: String },
    gameDevice: { type: String },
    calibrationValue: { type: Number },
    calibrationExercise: { type: String },
},
    { timestamps: { createdAt: 'created_at' } }
);

module.exports = mongoose.model('CalibrationOverview', CalibrationOverviewSchema);