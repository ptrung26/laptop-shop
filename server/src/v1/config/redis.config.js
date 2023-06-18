const { createClient } = require("redis");
require("dotenv").config();
const client = createClient({
    port: process.env.REDIS_PORT,
});
client
    .connect()
    .then(async (res) => {
        console.log('connected redis successfully.');
    })
    .catch((err) => {
        console.log('err happened' + err);
    });

module.exports = client; 