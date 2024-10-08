const express = require("express");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: process.env.ORIGIN_DOMAIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204, // Sucesso silencioso para preflight
};

// Middleware de CORS
app.use(cors(corsOptions));

// Middleware para lidar com OPTIONS antes de outras rotas
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(routes);

// Rota simples para teste
app.get("/api/", (req, res) => {
  res.send("Hello World!");
});

// Inicia o servidor
app.listen(3000, "0.0.0.0", () => {
  console.log("Listening on port 3000");
});
