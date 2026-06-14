const express = require("express");
const cors = require("cors");
const router = require("./routes/index");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

module.exports = app;
