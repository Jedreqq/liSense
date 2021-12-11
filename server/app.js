const express = require("express");
const PORT = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
var cors = require("cors");
const app = express();

const User = require('./models/user');
const School = require('./models/school');
const Branch = require('./models/branch');
const Category = require('./models/category');
const Vehicle = require('./models/vehicle');

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const UserCategory = require("./models/user-category");
const VehicleCategory = require("./models/vehicle-category");

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
app.use(userRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.get("/api", (req, res, next) => {
  res.json({ message: "Server is here." });
});

User.hasOne(School);
School.belongsTo(User);

School.hasMany(Branch);
Branch.belongsTo(School);

User.belongsTo(Branch, {as: 'member', constraints: false, allowNull: true, defaultValue: null}); //In branch there are many users, but user is in branch, just like in school there can be many branches, but branch is in school...

User.belongsToMany(Category, {through: UserCategory});
Category.belongsToMany(User, {through: UserCategory});

Branch.hasMany(Vehicle);
Vehicle.belongsTo(Branch);

User.hasOne(Vehicle);
Vehicle.belongsTo(User);

Vehicle.belongsToMany(Category, {through: VehicleCategory});
Category.belongsToMany(Vehicle, {through: VehicleCategory});


sequelize
  .sync()
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Server listens on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
