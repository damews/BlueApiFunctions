const mongoose = require('mongoose');

const PacientSchema = mongoose.Schema({
    name: { type: String, require: true },
    birthday: { type: Date },
    sex: { type: String },
    weigth: { type: Number },
    heigth: { type: Number },
    ethnicity: { type: String },
    condition: { type: String }
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Pacient', PacientSchema);