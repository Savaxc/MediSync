import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { app } from "./app";
import cors from "cors";

const server = http.createServer(app);

const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));

//Test route
app.get("/api", (req, res) => {
  res.json({ nesto: ["backend", "check"] });
});


server.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});