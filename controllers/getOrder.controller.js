const { getOrderFromDb } = require("../models/order.model");

async function getOrder(req, res) {
    const { bookingId } = req.params;

    const result = await getOrderFromDb(bookingId);

    if (!result.success) {
        return res.status(404).json({ success: false, message: "Order not found" });
    } else {
        return res.status(200).json(result.order);
    }
}

module.exports = { getOrder };