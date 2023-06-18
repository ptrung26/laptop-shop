const { createClient } = require("redis");

const client = createClient({
    port: 6379,
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