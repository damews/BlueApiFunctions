const mongoose = require('mongoose');

const FlowDataDeviceSchema = mongoose.Schema({
    flowDataDevices: [{ deviceName: { type: String }, flowData: [{ flowValue: Number, timestamp: Date }] }]
});

module.exports = mongoose.model('FlowDataDevice', FlowDataDeviceSchema);