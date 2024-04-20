import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes";

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 3003;

const host = process.env.HOST || "localhost";

const app = express();

app.use(express.json());
app.use(express.static("./public"));
app.use(routes);

function startServer() {
  try {
    app.listen(port);
  } catch (err) {
    console.error(err);
  }
  console.log(`Servidor iniciado em http://localhost:${port}`);
}
startServer();
