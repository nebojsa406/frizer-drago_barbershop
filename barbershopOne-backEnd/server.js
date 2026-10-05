const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {notFoundHandler, errorHandler} = require("./middleware/errorHandler");

const requiredEnvVars = [
    'DATABASE_URL',
    'ACCESS_TOKEN_SECRET',
    'REFRESH_TOKEN_SECRET',
    'FRONTEND_ORIGIN',
    'PORT'
]
for (const key of requiredEnvVars) {
    if (!process.env[key]) {
        console.error(`missing required env variable ${key}`);
        process.exit(1);
    }
}
console.log("all required env variables are present");

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once('open', () => console.log("connected to data base"));

app.use(express.json()); //allow middleware
app.use(cookieParser());
app.use(cors({origin: process.env.FRONTEND_ORIGIN, credentials: true})); //to not block front end connection to back end if they are different origin
app.set("trust proxy", 1);

//-------routes-------\\

//appointment routes
const appointmentRoutes = require("./routes/appointments");
app.use("/appointments", appointmentRoutes);

//user routes
const userRoutes = require("./routes/userRoutes");
app.use("/user", userRoutes);

//service routes
const serviceRoutes = require("./routes/servicesRoutes");
app.use("/services", serviceRoutes);

//location routes
const locationRoutes = require("./routes/locationRoutes");
app.use("/location", locationRoutes);

//gallery routes
const galleryRoutes = require("./routes/galleryRoutes");
app.use("/gallery", galleryRoutes);


app.use(notFoundHandler);
app.use(errorHandler);

//port
app.listen(process.env.PORT, () => console.log("server has started on port 5000"));