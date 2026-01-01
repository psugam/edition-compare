// basic imports
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const connectDB = require("./api/database/connect");

// routes
const textRoutes = require("./api/routes/text");
const editionRoutes = require("./api/routes/edition");

const userRoutes = require("./api/routes/user");

const mode = process.env.NODE_ENV || "development";

// express config
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

// app.get("/", (req, res) => {
//   res.send(`Hello. The port is ${port}`);
// });

connectDB();

app.use("/api/texts", textRoutes);
app.use("/api/editions", editionRoutes);
app.use("/api/users", userRoutes);

// Serve frontend static files and handle SPA fallback
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../frontend/dist"); // Check if this is 'dist' or 'build'
  app.use(express.static(buildPath));

  app.get("*splat", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send(`API is running on port ${port} and ${mode} mode`);
  });
}

module.exports = app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port} and ${mode} mode`);
  });
}
