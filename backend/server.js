import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes";
import groupRouter from "./routes/groupRoutes";
import notificationRouter from "./routes/NotificationRoutes";
import subscriptionRouter from "./routes/SubscriptionRoutes";
import taskRouter from "./routes/taskRoutes";


dotenv.config();
const app = express();
app.use(express.json());


app.use('api/a',authRouter);
app.use('api/g', groupRouter);
app.use('api/n', notificationRouter);
app.use('api/s', subscriptionRouter);
app.use('api/t',taskRouter);

app.get("/", (req, res) => {
res.send("API is running...");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));