import express from "express";
import urlRoutes from "./routes/url.routes";
import { errorHandler } from "./middleware/errorHandler";
import e from "express";

const app=express();
app.use(express.json());

app.use("/api/v1/url",urlRoutes);
app.use(errorHandler);

export default app;