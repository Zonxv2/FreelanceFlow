import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import clientRoutes from "./routes/clientRoutes";
import projectRoutes from "./routes/projectRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);

app.get("/", (req, res) => {
  res.send("FreelanceFlow API running");
});

export default app;