const express = require("express");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const cors = require("cors");

const app = express();

const corsOptions = {
  /* origin: "https://meusite.com", */
  origin: "*", //TEMPORÁRIO
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(routes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Listening on port 3000");
});
