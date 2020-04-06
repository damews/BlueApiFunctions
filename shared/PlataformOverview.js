const mongoose = require('mongoose');

const PlataformOverviewSchema = mongoose.Schema({

    pacientId: { type: String },
    gameDevice: { type: String },
    flowDataDevicesId: { type: mongoose.Schema.Types.ObjectId, ref: 'FlowDataDevice' },
    playStart: { type: Date },
    playFinish: { type: Date },
    duration: { type: Number },
    result: { type: Number },
    stageId: { type: Number },
    phase: { type: Number },
    level: { type: Number },
    relaxTimeSpawned: { type: Number },
    maxScore: { type: Number },
    scoreRatio: { type: Number },
    targetsSpawned: { type: Number },
    TargetsSuccess: { type: Number },
    TargetsInsuccess: { type: Number },
    TargetsExpSuccess: { type: Number },
    TargetsFails: { type: Number },
    TargetsInsFail: { type: Number },
    TargetsExpFail: { type: Number },
    ObstaclesSpawned: { type: Number },
    ObstaclesSuccess: { type: Number },
    ObstaclesInsSuccess: { type: Number },
    ObstaclesExpSuccess: { type: Number },
    ObstaclesFail: { type: Number },
    ObstaclesInsFail: { type: Number },
    ObstaclesExpFail: { type: Number },
    PlayerHp: { type: Number }
},
    { timestamps: { createdAt: 'created_at' } }
);

module.exports = mongoose.model('PlataformOverview', PlataformOverviewSchema);