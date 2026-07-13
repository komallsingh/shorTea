import express from "express";
import urlRoutes from "./routes/url.routes";
import { errorHandler } from "./middleware/errorHandler";
import e from "express";
import authRoutes from "./routes/auth.routes";
import cors from "cors";

const app=express();
app.use(cors());
app.use(express.json());

app.use("/api/url",urlRoutes);
app.use("/api/auth",authRoutes);
app.use(errorHandler);

export default app;