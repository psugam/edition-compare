// basic imports
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./api/database/connect");

// routes
const textRoutes = require("./api/routes/text");
const editionRoutes = require("./api/routes/edition");

const userRoutes = require("./api/routes/user");

// express config
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send(`Hello. The port is ${port}`);
});

connectDB();

app.use("/api/texts", textRoutes);
app.use("/api/editions", editionRoutes);
app.use("/api/users", userRoutes);

module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}
