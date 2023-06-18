const jsonwebtoken = require("jsonwebtoken");
const crypto = require("crypto");
const responseHandler = require("../handlers/response.handler");
const db = require("../models");
require("dotenv").config();

const tokenDecode = (req) => {
    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader && bearerHeader.split(' ')[1];
    if (!token) {
        return { valid: false, error: 'missing_token' };
    }

    try {
        const decoded = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
        return { valid: true, decoded };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return { valid: false, error: 'token_expired' }; // Token đã hết hạn
        } else {
            return { valid: false, error: 'invalid_token' }; // Token không hợp lệ
        }
    }
};

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}

const auth = async (req, res, next) => {
    try {
        const verifyToken = tokenDecode(req);

        if (verifyToken.valid) {
            const { decoded } = verifyToken;
            const userFound = await db.User.findOne({ where: { id: decoded.id }, attributes: { exclude: ['password'] }, raw: true, });
            if (!userFound) {
                return responseHandler.unauthorize(res);
            }

            const results = await db.UserRole.findAll({
                where: { userId: userFound.id },
                include: [{
                    model: db.Role, as: 'roleData',
                    include: [{ model: db.RoleDetail, attributes: ["actionName"] }],
                }]
            });

            const userRoles = results.map(userRole => {
                const result = { ...userRole.toJSON() };
                return result;
            })
            const user = { ...userFound, userRoles };
            req.user = user;
            next();

        } else {
            if (verifyToken.error === "token_expired") {
                return responseHandler.unauthorize(res);
            }
            else {
                return responseHandler.unauthorize(res);
            }
        }
    } catch (err) {
        console.log(err);
        responseHandler.err(res);
    }
};





const checkRole = (roleAction) => {
    return (req, res, next) => {
        const { userRoles } = req.user;
        if (!userRoles) {
            return responseHandler.forbidden(res, { status: 403, messsage: 'Access denied!' });
        }

        let hasRole = userRoles.some(userRole => {
            const roleDetail = userRole?.roleData?.RoleDetails || [];
            return roleDetail.some(role => role.actionName === roleAction);
        })
        if (hasRole) {
            next();
        } else {
            return responseHandler.forbidden(res, { status: 403, messsage: 'Access denied!' });
        }
    };

};

module.exports = { auth, checkRole }; 
