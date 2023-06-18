const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = async (id) => {
    return new Promise((resolve, reject) => {
        const payload = { id }
        const options = {
            expiresIn: "2h",
        }
        const secret = process.env.TOKEN_SECRET;
        jsonwebtoken.sign(payload, secret, options, (err, token) => {
            if (err) {
                reject(err);
            }
            resolve(token);
        });

    })
}

const generateRefreshToken = async (id) => {
    return new Promise((resolve, reject) => {
        const payload = { id }
        const options = {
            expiresIn: "7d",
        }
        const secret = process.env.TOKEN_SECRET;
        jsonwebtoken.sign(payload, secret, options, (err, token) => {
            if (err) {
                reject(err);
            }
            resolve(token);
        });

    })
}

module.exports = { generateAccessToken, generateRefreshToken }; 