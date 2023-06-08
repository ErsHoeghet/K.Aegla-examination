require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bookingRouter = require("./routes/router.js");

const app = express();

app.use(express.json());

app.use("/api/booking", bookingRouter);

mongoose.connect(process.env.DB_URL);
const database = mongoose.connection;

database.on("error", (error) => console.log(error));

database.once("open", () => console.log("Connected to database"));

app.use((req, res) => {
    res.status(404).send({ error: "Endpoint not found" });
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        res.status(400).json({ success: false, message: "Invalid JSON syntax" });
    } else {
        next(err);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

module.exports = database;