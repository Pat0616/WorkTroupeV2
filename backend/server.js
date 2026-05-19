import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/authRoutes.js"
import groupRouter from "./routes/groupRoutes.js";
import notificationRouter from "./routes/NotificationRoutes.js";
import subscriptionRouter from "./routes/SubscriptionRoutes.js";
import taskRouter from "./routes/taskRoutes.js";


dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    credentials: true,
  })
);


app.use('/api/a',authRouter);
app.use('/api/g', groupRouter);
app.use('/api/n', notificationRouter);
app.use('/api/s', subscriptionRouter);
app.use('/api/t',taskRouter);

app.get("/", (req, res) => {
res.send("API is running...");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));