const express = require("express");
const PORT = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
var cors = require("cors");
const app = express();
const { verifyTokenSocket } = require("./security/is-auth");

const userInSession = {};

const socketFunction = {
  sendMessage: undefined,
};

module.exports = socketFunction;

const User = require("./models/user");
const School = require("./models/school");
const Branch = require("./models/branch");
const Category = require("./models/category");
const Vehicle = require("./models/vehicle");
const Course = require("./models/course");
const Payment = require("./models/payment");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const UserCategory = require("./models/user-category");
const VehicleCategory = require("./models/vehicle-category");
const CourseCategory = require("./models/course-category");
const Comment = require("./models/comment");
const Mailbox = require("./models/mailbox");
const Message = require("./models/message");
const Calendar = require("./models/calendar");
const CalendarEvent = require("./models/calendar-event");
const Event = require("./models/event");

app.use(
  cors({
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
app.use(bodyParser.json());


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



User.belongsTo(Branch, {
  as: "member",
  constraints: false,
  allowNull: true,
  defaultValue: null,
}); //In branch there are many users, but user is in branch, just like in school there can be many branches, but branch is in school...

User.belongsToMany(Category, { through: UserCategory });
Category.belongsToMany(User, { through: UserCategory });

Branch.hasMany(Vehicle);
Vehicle.belongsTo(Branch);

User.hasOne(Vehicle);
Vehicle.belongsTo(User);

Vehicle.belongsToMany(Category, { through: VehicleCategory });
Category.belongsToMany(Vehicle, { through: VehicleCategory });

Branch.hasMany(Course);
Course.belongsTo(Branch);

Course.belongsToMany(Category, { through: CourseCategory });
Category.belongsToMany(Course, { through: CourseCategory });

User.hasMany(Payment);
Payment.belongsTo(User);

User.belongsTo(Course, {
  as: "attendedCourse",
  constraints: false,
  allowNull: true,
  defaultValue: null,
});

User.belongsTo(User, {
  as: "assignedInstructor",
  constraints: false,
  allowNull: true,
  defaultValue: null,
});

Comment.belongsTo(User, {
  as: "instructor",
  constraints: false,
  allowNull: false,
  onDelete: "cascade",
});

User.hasOne(Mailbox);
Mailbox.belongsTo(User);

Mailbox.hasMany(Message);
Message.belongsTo(Mailbox);

Message.belongsTo(User, {
  as: "sender",
  constraints: false,
  allowNull: false,
  onDelete: "cascade",
});

User.hasOne(Calendar);
Calendar.belongsTo(User);

Calendar.belongsToMany(Event, {through: CalendarEvent});
Event.belongsToMany(Calendar, {through: CalendarEvent});

sequelize
  .sync()
  .then((result) => {
    const server = app.listen(PORT, () => {
      console.log(`Server listens on port ${PORT}`);
    });
    const io = require("socket.io")(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    socketFunction.sendMessage = (message, receivedId) => {
      console.log(Object.entries(userInSession))
      Object.entries(userInSession)
        .filter((x) => +x[1]?.userId === +receivedId)
        .map((x) => x[0])
        .forEach((socketId) => {
          io.to(socketId).emit("sendMessage", message);
        });
    };
    io.on("connection", (socket) => {
      let token = socket?.handshake?.headers?.authorization;
      userInSession[socket?.id] = verifyTokenSocket(token);
      console.log(userInSession);

      socket.on("disconnect", () => {
        delete userInSession[socket?.id];
        console.log(userInSession);
      });
    });
  })
  .catch((err) => console.log(err));
