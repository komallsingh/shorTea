import express from "express";
import urlRoutes from "./routes/url.routes";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import cors from "cors";
import { rateLimiter } from "./middleware/rateLimiter";

const app=express();
app.use(cors());
app.use(express.json());

app.use(rateLimiter);

app.use("/api/auth",authRoutes);
app.use("/api/url",urlRoutes);
app.use(errorHandler);

export default app;