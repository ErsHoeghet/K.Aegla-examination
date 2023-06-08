const Order = require("./order.schema");

async function createOrderInDb(order) {
    const newOrder = new Order(order);
    await newOrder.save()

    if (newOrder === null) {
        const result = { success: false };
        return result;
    } else {
        const result = { success: true, newOrder: true, message: "Order created successfully", newOrder };
        return result;
    }
}

async function getOrderFromDb(bookingId) {
    const order = await Order.findOne({ bookingId });

    if (order === null) {
        const result = { success: false };
        return result;
    } else {
        const result = { success: true, order };
        return result;
    }
}

async function deleteOrderFromDb(bookingId) {
    try {
        const unordered = await Order.deleteOne({ bookingId });
        return { success: true, unordered };
    } catch (error) {
        console.log(error);
    }
}

async function editOrderInDb(order) {
    try {
        const editOrder = await Order.findOneAndUpdate({ bookingId: order.bookingId }, order, { new: true });
        return { success: true, editedOrder: true, message: "Order edited successfully", editOrder };
    } catch (error) {
        console.log(error);
    }
}

module.exports = { createOrderInDb, getOrderFromDb, deleteOrderFromDb, editOrderInDb };