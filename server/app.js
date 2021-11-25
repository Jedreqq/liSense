const express = require("express");
const PORT = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
var cors = require("cors");
const app = express();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use(
  cors({
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
app.use(bodyParser.json());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.get("/api", (req, res, next) => {
  res.json({ message: "Server is here." });
});

sequelize
  .sync()
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Server listens on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
