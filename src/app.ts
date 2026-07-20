import express from "express";
import urlRoutes from "./routes/url.routes";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import cors from "cors";
import { rateLimiter } from "./middleware/rateLimiter";
import helmet from "helmet";
import morgan from "morgan";

const app=express();
app.use(cors());
app.use(helmet());
//app.use(morgan("dev"));
app.use(
    morgan(
        process.env.NODE_ENV === "production"
            ? "combined"
            : "dev"
    )
);
app.use(express.json());

app.use(rateLimiter);

app.use("/api/auth",authRoutes);
app.use("/api/url",urlRoutes);
app.use(errorHandler);

export default app;