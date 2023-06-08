const { deleteOrderFromDb } = require("../models/order.model");

async function deleteOrder(req, res) {
    const { bookingId } = req.params;

    const result = await deleteOrderFromDb(bookingId);

    if (!result.success) {
        return res.status(400).json({ success: false, message: "Something went wrong" });
    } else if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: "Order not found" });
    } else {
        return res.status(200).json({ success: true, message: "Order deleted successfully" });
    }
}

module.exports = { deleteOrder };