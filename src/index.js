const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
