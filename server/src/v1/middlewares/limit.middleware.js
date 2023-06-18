const client = require("../config/redis.config");
const responseHandler = require("../handlers/response.handler");


const limit = async (req, res, next) => {
    const getIpUser = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const numRequest = await client.incr(getIpUser);
    if (numRequest == 1) {
        await client.expire(getIpUser, 60);
    }
    if (numRequest > 20) {
        return responseHandler.serviceUnavailable(res);
    }
    next()

}

module.exports = { limit }; 