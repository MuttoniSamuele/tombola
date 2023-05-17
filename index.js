import express from "express";
import TombolaServer from "./src/TombolaServer.js";
import { WEB_PORT, WS_PORT } from "./src/config.js";

const app = express();
const tombolaServer = new TombolaServer();

app.use(express.static("public"));
app.use(express.static("src"));

app.listen(WEB_PORT, () => {
  console.log(`Web server running on port ${WEB_PORT}`);
});

tombolaServer.listen(WS_PORT);
