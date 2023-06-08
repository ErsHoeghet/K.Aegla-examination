const Router = require("express");

const { postToDbInputValidation, getOrDeleteFromDbInputValidation, editDbInputValidation } = require("../middleware/middleware");
const { createOrder } = require("../controllers/createOrder.controller");
const { getOrder } = require("../controllers/getOrder.controller");
const { deleteOrder } = require("../controllers/deleteOrder.controller");

const router = Router();

router.post('/', postToDbInputValidation, createOrder);
router.get('/:bookingId', getOrDeleteFromDbInputValidation, getOrder);
router.delete('/:bookingId', getOrDeleteFromDbInputValidation, deleteOrder);
router.patch('/', editDbInputValidation, createOrder);

module.exports = router;