require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDb = require("./utils/connectDb");
// Import routes
const authRoutes = require("./routes/authRoutes");
const imageRoutes = require("./routes/imageRoutes");
const userRoutes = require('./routes/userRoutes')

const origins = [
  process.env.LOCAL_ORIGIN,
  process.env.PRODUCTION_ORIGIN,
  process.env.LOCAL_ADMIN_ORIGIN,
  process.env.PRODUCTION_ADMIN_ORIGIN,
];

const corsOptions = {
  origin: function (origin, callback) {
    if (origins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/v1", imageRoutes);
app.use("/api/user", userRoutes);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  connectDb();
});
