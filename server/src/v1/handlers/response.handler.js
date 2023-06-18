const responseWithData = (res, statusCode, data) =>
  res.status(statusCode).json(data);

const responseHandler = {

  err: (res) =>
    responseWithData(res, 500, {
      status: 500,
      message: "Opps! Something wrong",
    }),

  badRequest: (res, message) => responseWithData(res, 400, message),

  ok: (res, data) => responseWithData(res, 200, data),

  created: (res, data) => responseWithData(res, 201, data),

  unauthorize: (res) =>
    responseWithData(res, 401, {
      status: 401,
      message: "Unathorized",
    }),

  forbidden: (res, message) => {
    responseWithData(res, 403, message);
  },
  serviceUnavailable: (res) => {
    responseWithData(res, 403, {
      message: 'Server is busy!'
    })
  },
  notfound: (res) =>
    responseWithData(res, 404, {
      status: 404,
      message: "Resource not found",
    }),
};

module.exports = responseHandler;
