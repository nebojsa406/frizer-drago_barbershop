const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema({
    date: {type: Date, required: true},
    time: {type: String, required: true},
}, {versionKey: false});

module.exports = mongoose.model("TimeSlot", timeSlotSchema, "disabledTimeSlots");