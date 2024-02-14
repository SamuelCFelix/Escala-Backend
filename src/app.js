const express = require("express");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: ["http://localhost:3001"],
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(routes);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
