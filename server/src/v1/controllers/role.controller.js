const db = require("../models");
const responseHandler = require("../handlers/response.handler");

const roleController = {
    createRole: async (req, res) => {
        if (!req.user) {
            return responseHandler.unauthorize(res);
        }
        const { role } = req.body;
        if (!role) {
            return responseHandler.badRequest(res, {
                status: 400,
                message: 'missing parameters'
            })
        }

        try {
            const newRole = await db.Role.create({
                name: role,
            })

            responseHandler.ok(res, {
                status: 200,
                message: 'create role successfully!',
                role: newRole,
            })
        } catch (err) {
            return responseHandler.err(res);
        }


    },

    createRoleDetail: async (req, res) => {
        if (!req.user) {
            return responseHandler.unauthorize(res);
        }

        const { roleId } = req.params;

        if (!roleId) {
            return responseHandler.badRequest(res, {
                status: 400,
                message: "Missing parameters"
            })
        }

        const { actionName, actionCode } = req.body;

        if (!actionName || !actionCode) {
            return responseHandler.badRequest(res, {
                status: 400,
                message: "Missing parameters"
            })
        }

        try {
            const roleDetail = await db.RoleDetail.create({
                roleId,
                actionName,
                actionCode,
            })

            responseHandler.ok(res, {
                status: 200,
                message: 'create role detail successfully',
                roleDetail,
            })
        } catch (err) {
            console.log(err);
            return responseHandler.err(res);
        }
    },

    updateRole: async (req, res) => {
        if (!req.user) {
            return responseHandler.unauthorize(res);
        }

        const { id, name } = req.body;
        if (!id || !name) {
            return responseHandler.badRequest(res, {
                status: 400,
                message: 'missing parameters'
            })
        }

        try {
            const role = await db.Role.findOne({
                where: {
                    id,
                },
            })

            if (!role) {
                return responseHandler.notfound(res);
            }

            await db.Role.update(
                {
                    role: name
                },
                {
                    where: {
                        id
                    }
                });

            responseHandler.ok(res, {
                status: 200,
                message: 'update role successfully',
            })

        } catch (err) {
            responseHandler.err(res);
        }
    },

    setRoleOfUser: async (req, res) => {
        if (!req.user) {
            return responseHandler.unauthorize(res);
        }

        const { userId, roleId } = req.body;
        if (!userId || !roleId) {
            return responseHandler.badRequest(res, {
                status: 400,
                message: 'missing parameters'
            })
        }

        try {
            const [user, created] = await db.UserRole.findOrCreate({
                where: { userId },
                defaults: { roleId },
                attributes: { exclude: ['id'] },
                raw: true,
            });

            if (!created) {
                await user.update({ roleId });
            }

            const updatedUser = await db.UserRole.findOne({
                where: { userId },
                attributes: { exclude: ['id'] },

            });

            responseHandler.ok(res, {
                status: 200,
                message: 'set role successfully',
                userRole: updatedUser,
            })

        } catch (err) {
            return responseHandler.err(res);
        }


    }

}

module.exports = roleController; 