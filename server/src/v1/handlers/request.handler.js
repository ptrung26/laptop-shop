const { validationResult } = require("express-validator");
const responseHandler = require("../handlers/response.handler");

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
        return responseHandler.badRequest(res, errors.array()[0].msg);
    next();
};

module.exports = { validate };