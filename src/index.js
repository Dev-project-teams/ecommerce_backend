const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
