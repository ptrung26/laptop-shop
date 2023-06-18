const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const connect = require("./src/v1/config/db.config.js");
const router_v1 = require("./src/v1/routes/index.js");


require("dotenv").config();
const app = express();


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(cookieParser())
// add body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// add routes
app.use("/api/v1/", router_v1);

//init dbs
connect();

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => console.log(`app is running at ${PORT}`));
