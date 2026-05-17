import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import { protect } from "./middleware/authMiddleware";
import leadRoutes from "./routes/leadRoutes";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://lead-management-dashboard-rho-ten.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
  });
});

export default app;