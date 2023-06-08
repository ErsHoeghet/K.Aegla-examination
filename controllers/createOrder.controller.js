const mongoose = require("mongoose");
const moment = require("moment");
const nanoId = require("nanoid");

const Order = require("../models/order.schema");

const { createOrderInDb, editOrderInDb } = require("../models/order.model");

async function createOrder(req, res, next) {
    const { gameDate, time, email, playersQty, alleysQty, shoeSizes } = req.body;
    const orderDate = moment().format("YYYY-MM-DD");

    if (typeof gameDate !== "string" || typeof time !== "number" || typeof email !== "string" || typeof playersQty !== "number" || typeof alleysQty !== "number" || !Array.isArray(shoeSizes)) {
        return res.status(400).json({ success: false, message: "Invalid field type" });
    }

    if (gameDate.length === 0 || time.length === 0 || email.length === 0 || playersQty <= 1 || alleysQty <= 0 || shoeSizes.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid field length" });
    }

    if ((playersQty > alleysQty * 8) || (playersQty < alleysQty * 2)) {
        return res.status(400).json({ success: false, message: "Invalid players quantity" });
    }

    if (alleysQty > 8) {
        return res.status(400).json({ success: false, message: "Invalid alleys quantity (max: 8)" });
    }

    if (shoeSizes.length !== playersQty) {
        return res.status(400).json({ success: false, message: "Invalid amount of shoes" });
    }

    if (!email.includes("@") || !email.includes(".")) {
        return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (shoeSizes.some((size) => typeof size !== "number" || size < 34 || size > 48)) {
        return res.status(400).json({ success: false, message: "Invalid shoe size. Pick sizes in the range 34-48" });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(gameDate)) {
        return res.status(400).json({ success: false, message: "Invalid date format (the format should be: YYYY-MM-DD)" });
    }

    if (gameDate < orderDate) {
        return res.status(400).json({ success: false, message: "Invalid date. Date must be in the future" });
    }

    if (time < 10 || time > 22) {
        return res.status(400).json({ success: false, message: "Invalid time. Time must be in the range 10-22" });
    }

    const totalPrice = calculateTotalPrice(playersQty, alleysQty);

    let bookingId;
    let editOrder;

    if (!req.body.bookingId || req.body.bookingId.length === 0 || req.body.bookingId === "undefined") {
        bookingId = `BID${nanoId.nanoid(16)}`;
        editOrder = false;
    } else {
        bookingId = req.body.bookingId;
        editOrder = true;
    }

    const order = { orderDate, gameDate, time, email, playersQty, alleysQty, shoeSizes, totalPrice, bookingId };

    let result;

    if (!editOrder) {
        const canBeBooked = await bookableCheck(gameDate, time, alleysQty);

        if (!canBeBooked.success) {
            return res.status(400).json({ successs: canBeBooked.success, message: canBeBooked.message });
        } else {
            result = await createOrderInDb(order);
        }
    } else {
        result = await editOrderInDb(order);
    }

    if (result.newOrder) {
        return res.status(201).json({ success: true, message: result.message, order: result.newOrder });
    } else if (result.editedOrder) {
        return res.status(201).json({ success: true, message: result.message, order: result.editOrder });
    } else {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

function calculateTotalPrice(playersQty, alleysQty) {
    const totalPrice = (playersQty * 120) + (alleysQty * 100);

    return totalPrice;
}

async function bookableCheck(gameDate, time, alleysQty) {
    const db = await Order.find({ gameDate, time });

    if (db.length === 0) {
        return { success: true };
    } else {
        const bookedAlleys = db.map((order) => order.alleysQty);

        const bookedAlleysQty = bookedAlleys.reduce((acc, curr) => acc + curr);

        if (bookedAlleysQty + alleysQty <= 8) {
            return { success: true };
        } else {
            return { success: false, message: `We're sorry, but there is only ${(8 - bookedAlleysQty)} alleys available at this time` };
        }
    }
}

module.exports = { createOrder };