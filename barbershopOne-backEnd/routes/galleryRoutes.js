const express = require('express');
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { fileTypeFromBuffer } = require("file-type");
const { crudLimiter, browseLimiter, authenticateAccessToken, requireAdmin } = require('../middleware/auth');

const Photo = require("../models/photos.js");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 5 }, // 5 files x 5mb = 24mb per request
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("only images are allowed"))
    }
})

function uploadToCloud(buffer, originalName) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "barbershop-one-gallery",
                resource_type: "image"
            },
            (error, result) => {
                if (error) return reject(error);
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id
                });
            }
        );
        stream.end(buffer);
    });
}

async function deleteFromCloud(publicId) {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
}
//------------------------------------all above boiler plate functions-----------------------\\


//get 
router.get("/", browseLimiter, async (req, res, next) => {
    try {
        const photos = await Photo.find();
        if (photos.length === 0) return res.status(200).json(photos);
        return res.status(200).json(photos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

//upload many
router.post("/", crudLimiter, authenticateAccessToken, requireAdmin, upload.array("images", 5), async (req, res, next) => {
    const cloudUploads = []
    try {
        if (!req.files || req.files.length === 0) return res.status(400).json({ message: "no files uploaded" });

        for (const file of req.files) { //upload photos
            const result = await uploadToCloud(file.buffer, file.originalname);
            cloudUploads.push(result);
        }

        const photoBodys = [] //creating many documents bodys
        for (const item of cloudUploads) {
            const photoBody = {
                imageUrl: item.url,
                imagePublicId: item.publicId,
                category: req.body.category
            }
            photoBodys.push(photoBody);
        }

        const newPhotos = await Photo.insertMany(photoBodys);

        res.status(201).json(newPhotos);
    } catch (err) {
        for (const item of cloudUploads) { //delete photos
            const result = await deleteFromCloud(item.publicId);
            console.log(result);
        }

        console.error(err);
        res.status(500).json({ message: "internal server error" });
    }
});

//delete
router.delete("/:id", crudLimiter, authenticateAccessToken, requireAdmin, async (req, res, next) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) return res.status(404).json({ message: "no photo with matching id found in db" });


        const deletedPhotoStatus = await cloudinary.uploader.destroy(photo.imagePublicId);
        console.log("deleted photo status: ", deletedPhotoStatus);


        const deletedDocument = await Photo.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "photo deleted successfuly", photo: deletedDocument });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

module.exports = router;