const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {browseLimiter, crudLimiter, authenticateAccessToken, requireAdmin } = require("../middleware/auth.js");
const LocationCard = require("../models/locationCard.js")

//get locations
router.get("/", browseLimiter, async(req, res) => {
    try {
        const services = await LocationCard.find();
        if (services.length === 0) return res.status(200).json({services: [], message: "no services found, list of services is empty"});
        res.status(200).json({services});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});


//-----ADMIN----\\

router.patch("/:id", crudLimiter, authenticateAccessToken, requireAdmin, async(req,res) => {
    try {
        if (!req.body) return res.status(400).json({message: "no req body"});

        // check if req body has only updated existing fields
        let addressExists = false;
        let workingTimeExists = false;
        let contactNumExists = false;
        let contactEmailExists = false;
        let workingDays = false;
        let notWorkingDays = false;
        let googleMapsLink = false;
        let googleMapsEmbedLink = false;

        for (const key of Object.keys(req.body)) {
            if (key === "address") {addressExists = true}
            else if (key === "workingTime") {workingTimeExists = true}
            else if (key === "contactNum") {contactNumExists = true}
            else if (key === "contactEmail") {contactEmailExists = true}
            else if (key === "workingDays") { workingDays = true}
            else if (key === "notWorkingDays") { notWorkingDays = true}
            else if (key === "googleMapsLink") { googleMapsLink = true}
            else if (key === "googleMapsEmbedLink") { googleMapsEmbedLink = true}

        }
        if (addressExists && workingTimeExists && contactNumExists && contactEmailExists &&
        workingDays && notWorkingDays && googleMapsLink && googleMapsEmbedLink) {}
        else {return res.status(400).json({message: "body contains update field that dosent exist in model"})}
        //checking fields completed

        const updateBody = {...req.body}
        
        const locationCard = await LocationCard.findByIdAndUpdate(
            req.params.id,
            updateBody
        );

        res.status(200).json(locationCard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});


module.exports = router;