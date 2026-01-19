import express from "express";
import cors from "cors";
import medicalRoutes from "./routes/medical.routes";

export const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"]
}));

app.use(express.json());

app.use("/api/medical", medicalRoutes);

app.get("/", (req, res) => {
  res.send("Backend OK!");
});
