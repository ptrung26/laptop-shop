const responseHandler = require("../handlers/response.handler");
const db = require("../models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../helpers/jwt.helper");
const sendEmail = require("../helpers/sendEmail");
const { Op } = require("sequelize");


require("dotenv").config();

const userController = {

    signup: async (req, res) => {
        try {

            const { email, username, password } = req.body;
            const user = await db.User.findOne({ where: { username } });
            if (user) {
                return responseHandler.badRequest(res, "User already exists !")
            }

            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);
            const newUser = await db.User.create({
                email,
                username,
                password: hashed,
            });

            const role = await db.Role.findOne({
                where: {
                    name: "user"
                }
            });

            await db.UserRole.create({
                userId: newUser.id,
                roleId: role.id,
            });


            const accessToken = await generateAccessToken(newUser.id);

            responseHandler.created(res, {
                accessToken,
            });
        } catch (err) {
            responseHandler.err(res);
        }
    },

    signin: async (req, res) => {
        const { username, password } = req.body;
        const user = await db.User.findOne({ where: { username } });
        if (!user) {
            return responseHandler.badRequest(res, {
                status: 400,
                message: "Incorrect account or password!"
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return responseHandler.badRequest(res, {
                status: 400,
                message: "Incorrect account or password!"
            });
        }

        const accessToken = await generateAccessToken(user.id);
        const refreshToken = await generateRefreshToken(user.id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // khi deploy set true
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,

        })
        responseHandler.ok(res, {
            accessToken,
        })
    },

    getInfo: async (req, res) => {
        if (!req.user) {
            return responseHandler.unauthorize(res);
        }
        try {

            const user = await db.User.findOne({
                where: { id: req.user.id },
                attributes: ["username", "email"]
            })
            if (!user) {
                return responseHandler.notfound(res);
            }

            responseHandler.ok(res, {
                user
            })
        } catch (err) {
            responseHandler.err(res);

        }

    },

    logout: async (req, res) => {
        res.clearCookie("refreshToken");
        return responseHandler.ok(res, {
            status: 200,
            message: "Logout sucessfully",
        })
    }
    ,
    refreshToken: async (req, res) => {
        const refreshToken = req.cookies["refreshToken"];
        if (!refreshToken) {
            return responseHandler.unauthorize(res);
        }
        jsonwebtoken.verify(refreshToken, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
            }

            const accessToken = jsonwebtoken.sign({
                id: user.id,
            }, process.env.TOKEN_SECRET, { expiresIn: "2h" });

            return responseHandler.ok(res, {
                status: 200,
                accessToken,
            })
        })
    },

    forgotPassword: async (req, res) => {
        const { email } = req.body;
        try {
            const user = await db.User.findOne({ where: { email } });
            if (!user) {
                return responseHandler.badRequest(res, 'Email không tồn tại!');
            }
            const subject = 'Đổi mật khẩu';
            const resetToken = crypto.randomBytes(32).toString("hex");
            const verify = crypto.createHash("sha256").update(resetToken).digest('hex');
            const html = `<p>Để lấy lại mật khẩu tài khoản, quý Khách vui lòng nhấp vào link sau đây: 
                <a href="${process.env.URL_SERVER}/reset-password/${resetToken}">Click here</a>
            </p> 
                <p>Link này sẽ hết hiệu lực sau 15p.</p>
            `
            const rs = await sendEmail(email, subject, html);
            await db.User.update({
                verify,
                verifyUpdatedAt: new Date(),
            }, {
                where: {
                    id: user.id,
                }
            })

            return responseHandler.ok(res, {
                status: 200,
                message: 'send email to reset password successfully!'
            })
        } catch (err) {
            return responseHandler.err(res);
        }

    },

    verifyResetToken: async (req, res) => {
        const { token } = req.params;
        if (!token) {
            return responseHandler.badRequest(res, "token is missing!");
        }

        const checkExprired = new Date(Date.now() - 15 * 60 * 1000);
        const verify = crypto.createHash("sha256").update(token).digest("hex");
        const user = await db.User.findOne({
            where: {
                verify,
                verifyUpdatedAt: {
                    [Op.gte]: checkExprired,
                }
            }
        })

        if (!user) {
            return responseHandler.notfound(res);
        }

        return responseHandler.ok(res, {
            status: 200,
            message: 'token is valid',
        })

    },

    resetPassword: async (req, res) => {
        const { token, password } = req.body;
        if (!token || !password) {
            return responseHandler.badRequest(res, 'not enough parameter!');
        }


        const checkExprired = new Date(Date.now() - 15 * 60 * 1000);
        const verify = crypto.createHash("sha256").update(token).digest("hex");
        const user = await db.User.findOne({
            where: {
                verify,
                verifyUpdatedAt: {
                    [Op.gte]: checkExprired
                }

            }
        })

        if (!user) {
            return responseHandler.notfound(res);
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        await db.User.update({
            password: hashed,
        }, {
            where: {
                id: user.id,
            }
        })

        responseHandler.ok(res, {
            status: 200,
            message: 'Reset password successfully!'
        })

    }

};

module.exports = userController; 
