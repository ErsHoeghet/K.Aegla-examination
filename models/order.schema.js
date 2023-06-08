const mongoose = require("mongoose");
const nanoId = require("nanoid");

const orderSchema = new mongoose.Schema({
    orderDate: {
        type: String
    },
    gameDate: {
        type: String
    },
    time: {
        type: Number
    },
    email: {
        type: String
    },
    playersQty: {
        type: Number
    },
    alleysQty: {
        type: Number
    },
    shoeSizes: {
        type: Array
    },
    totalPrice: {
        type: Number
    },
    bookingId: {
        type: String,
        required: true
    }
});

orderSchema.pre("validate", function (next) {
    if (this.isNew || this.isModified()) {
        this.schema.path("orderDate").required(true);
        this.schema.path("gameDate").required(true);
        this.schema.path("time").required(true);
        this.schema.path("email").required(true);
        this.schema.path("playersQty").required(true);
        this.schema.path("alleysQty").required(true);
        this.schema.path("shoeSizes").required(true);
        this.schema.path("totalPrice").required(true);
        this.schema.path("bookingId").required(true);
    }
    next();
});

module.exports = mongoose.model("Order", orderSchema);