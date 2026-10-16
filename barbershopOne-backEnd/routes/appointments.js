const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Appointment = require("../models/appointment");
const TimeSlot = require("../models/timeSlot.js");
const { browseLimiter, crudLimiter, authenticateAccessToken, requireAdmin } = require("../middleware/auth");
const { verifyPhoneFormatMonteNegro } = require("../services/verifyPhoneFormat.js");

//get times
router.get("/times", browseLimiter, async (req, res) => {
    try {
        const takenTimes = await Appointment.find({ date: { $gte: new Date().setHours(0, 0, 0, 0) } }, { _id: 0, time: 1, date: 1 });
        const disabledTimes = await TimeSlot.find({ date: { $gte: new Date().setHours(0, 0, 0, 0) } }, { _id: 0, time: 1, date: 1 });
        const unavailableTimes = [...takenTimes, ...disabledTimes];
        if (unavailableTimes.length === 0) return res.status(200).json({ message: "no taken times been found in present or future" });
        res.status(200).json({ times: [...unavailableTimes] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

//get user appointment by phone number
router.get("/byPhone", browseLimiter, async (req, res) => {
    try {
        const phone = req.query.phone;
        const expiredAppointmentsIds = [];
        const todayDate = new Date();
        const todayTime = [new Date().getHours(), new Date().getMinutes()];
        todayDate.setUTCHours(0, 0, 0, 0);
        if (!phone) return res.status(400).json({ message: "no phone number sent over" });
        const cleaned = phone.replace(/[^\d]/g, '');

        const appointments = await Appointment.find({ phone: cleaned, date: { $gte: todayDate } });

        for (const appointment of appointments) {
            if (String(todayDate) === String(appointment.date)) {

                const time = appointment.time.split(":");
                time[0] = Number(time[0]);
                time[1] = Number(time[1]);

                if (todayTime[0] >= time[0] && todayTime[1] > time[1]) {
                    expiredAppointmentsIds.push(appointment.id);
                }
            }
        }

        const filteredAppointments = [];
        
        for (const appointment of appointments) {
            if (expiredAppointmentsIds.length > 0) {
                for (const expiredAppointmentId of expiredAppointmentsIds) {
                    if (expiredAppointmentId === appointment.id) { }
                    else { filteredAppointments.push(appointment); }
                }
            } else {
                filteredAppointments.push(appointment);
            }
        }

        if (filteredAppointments.length === 0 && appointments.length !== 0) {
            return res.status(404).json({ message: "no appointments in present or future found for this phone number" });
        } else if (filteredAppointments.length === 0) {
            return res.status(404).json({ message: "no appointments found for this phone number" });
        }

        res.status(200).json({ appointments: filteredAppointments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

//get all
router.get("/", browseLimiter, authenticateAccessToken, requireAdmin, async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

//get by date
router.get("/byDate", browseLimiter,authenticateAccessToken, requireAdmin, async(req, res) => {
    try {
        const toggleFrom = req.query.toggleFrom === "true";
        const argDate = req.query.date.replace(" ", "T").replace(/(\+00:00)?$/, "Z");
        const date = new Date(argDate);
        const appointments = toggleFrom === true ? await Appointment.find({date: {$gte: date } } ) : await Appointment.find({date: date});
        if (appointments.length === 0) return res.status(404).json({message: "no appointments found (backend 404)"});
        res.status(200).json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error"});
    }
})

//get one
router.get("/:id", crudLimiter, authenticateAccessToken, requireAdmin, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "invalid appointment id" });
        }
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: "appointment not found" });
        res.status(200).json(appointment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

//post
router.post("/", crudLimiter, async (req, res) => {
    try {
        if (!req.body || typeof req.body.phone !== "string") {
            return res.status(400).json({ message: "phone number is required" });
        }

        const normalisedPhone = verifyPhoneFormatMonteNegro(req.body.phone);
        if (!normalisedPhone) {
            return res.status(400).json({ message: "invalid phone number" });
        }

        const appointment = new Appointment({
            fullname: req.body.fullname,
            phone: normalisedPhone,
            email: req.body.email,
            service: req.body.service,
            date: req.body.date,
            time: req.body.time,
            details: req.body.details
        });
        const appointmentDate = new Date(req.body.date);
        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const matchingAppointments = await Appointment.find({ phone: normalisedPhone, date: { $gte: today } });

        if (matchingAppointments.length > 0) {
            return res.status(409).json({ message: "An appointment already exists for this phone number." });
        }

        let nowTime = now.toLocaleTimeString('sr-ME', { hour: '2-digit', minute: '2-digit' });
        nowTime = nowTime.replace(":", "");
        const nowTimeHour = parseInt(nowTime.slice(0, 2));
        const nowTimeMin = parseInt(nowTime.slice(2));


        const bodyTime = req.body.time.replace(":", "");
        if (bodyTime.length !== 4) {
            return res.status(400).json({ message: "bad time field format" })
        }
        const appointHour = parseInt(bodyTime.slice(0, 2))//16
        const appointMin = parseInt(bodyTime.slice(2));//:30

        if (today.getTime() === appointmentDate.getTime()) {

            if (nowTimeHour > appointHour) {
                return res.status(400).json({ message: "cant create appointment in past date time" })
            } else if (nowTimeHour === appointHour) {
                if (nowTimeMin > appointMin) {
                    return res.status(400).json({ message: "cant create appointment in past date time" });
                }
            }
        } else if (today.getTime() > appointmentDate.getTime()) { return res.status(400).json({ message: "cant create appointment in past date time" }); }

        const newAppointment = await appointment.save();
        res.status(201).json(newAppointment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

router.post("/disableTimeSlot", authenticateAccessToken, requireAdmin, async (req, res) => {
    try {
        const [year, month, day] = req.body.date.split("-").map(Number); // .map(Number) converts strings to numbers
        const dateObj = new Date(Date.UTC(year, month -1, day)).setUTCHours(0,0,0,0);

        const disabledTimes = await TimeSlot.find({ date: dateObj, time: req.body.time }, { _id: 0, time: 1, date: 1 });
        if (disabledTimes.length !== 0) return res.status(400).json({message: "cant disable same time slot twice!"});

        const timeSlot = new TimeSlot({
            date: dateObj,
            time: req.body.time
        });

        const newTimeSlot = await timeSlot.save();
        console.log("newTimeSlot: ", newTimeSlot);

        res.status(201).json({message: "added disableTimeSlot", timeSlot: newTimeSlot});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

//update
router.patch("/:id", crudLimiter, authenticateAccessToken, requireAdmin, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "invalid appointment id" });
        }

        const updateBody = {
            fullname: req.body.fullname,
            phone: req.body.phone,
            date: req.body.date,
            time: req.body.time,
            details: req.body.details
        };

        const newAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            updateBody,
            { returnDocument: "after", runValidators: true }
        );
        if (!newAppointment) return res.status(404).json({ message: "appointment not found" });
        res.status(200).json({ message: "item updated", item: newAppointment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

//delete
router.delete("/:id", authenticateAccessToken, requireAdmin, async (req, res) => {
    //removed crud limit to prevent admin locking himself out of this function
    //should make new limiter for actions that happen more
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "invalid appointment id" });
        }
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) return res.status(404).json({ message: "appointment not found" });
        res.status(200).json({ message: "deleted item successfully", item: appointment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});


module.exports = router;