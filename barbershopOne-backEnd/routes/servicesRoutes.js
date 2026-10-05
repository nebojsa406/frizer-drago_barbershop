const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ServiceCard = require("../models/serviceCard.js");
const {browseLimiter, crudLimiter, authenticateAccessToken, requireAdmin } = require("../middleware/auth.js");
const { verifyPhoneFormatMonteNegro } = require("../services/verifyPhoneFormat.js");
const { findByIdAndDelete } = require("../models/appointment.js");


//get services
router.get("/", browseLimiter, async(req, res) => {
    try {
        const services = await ServiceCard.find();
        if (services.length === 0) return res.status(200).json({services: [], message: "no services found, list of services is empty"});
        res.status(200).json({services});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

//post serviceCard
router.post("/", crudLimiter, authenticateAccessToken, requireAdmin, async(req, res) => {
    try {
        const serviceBody = new ServiceCard({
            serviceName: req.body.serviceName,
            price: req.body.price,
            time: req.body.time,
            category: req.body.category,
            description: req.body.description
        })

        const newService = await serviceBody.save();
        res.status(201).json(newService);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});


//update serviceCard
router.patch("/:id", crudLimiter, authenticateAccessToken, requireAdmin, async(req, res) => {
    try {
        
        if (!req.body || Object.keys(req.body).length === 0) return res.status(400).json({message: "request body is empty"});
        const updateServiceCard = await ServiceCard.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        );

        if (!updateServiceCard) return res.status(404).json({message: "user not found"});

        res.status(200).json(updateServiceCard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

//delete serviceCard
router.delete("/:id", crudLimiter, authenticateAccessToken, requireAdmin, async(req, res) => {
    try {
        const serviceCard = await ServiceCard.findByIdAndDelete(req.params.id);

        if (!serviceCard) return res.status(404).json({message: "serviceCard not found,failed to delete"});

        res.status(200).json(serviceCard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

module.exports = router;