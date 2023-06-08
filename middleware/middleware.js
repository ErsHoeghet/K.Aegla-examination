function postToDbInputValidation(req, res, next) {
    const { body } = req;

    if (!body) {
        return res.status(400).json({ success: false, message: "Missing body" });
    }

    const { gameDate, time, email, playersQty, alleysQty, shoeSizes } = body;

    if (!gameDate || !time || !email || !playersQty || !alleysQty || !shoeSizes) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    next();
}

function getOrDeleteFromDbInputValidation(req, res, next) {
    const { params } = req;

    if (!params) {
        return res.status(400).json({ success: false, message: "Missing params" });
    }

    const { bookingId } = params;

    if (!bookingId || bookingId.length !== 19) {
        return res.status(400).json({ success: false, message: "Missing required fields or length of booking ID mismatch" });
    }

    next();
}

function editDbInputValidation(req, res, next) {
    const { body } = req;

    if (!body) {
        return res.status(400).json({ success: false, message: "Missing body" });
    }

    const { bookingId } = body;

    if (!bookingId || bookingId.length !== 19) {
        return res.status(400).json({ success: false, message: "Missing required fields or length of booking ID mismatch" });
    }

    next();
}

module.exports = { postToDbInputValidation, getOrDeleteFromDbInputValidation, editDbInputValidation };