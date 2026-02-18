const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());


app.get("/test", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
