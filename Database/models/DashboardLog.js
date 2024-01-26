const mongoose = require('mongoose');

const dashboardLogSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    action: { type: String, required: true },
    details: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const DashboardLog = mongoose.model('DashboardLog', dashboardLogSchema);

module.exports = DashboardLog;
