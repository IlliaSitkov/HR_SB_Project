import express, { Express } from 'express';
import morgan from 'morgan';
import dotenv from "dotenv";
import { prisma } from "./config/connectDB";

prisma.$connect().then(() => {
    console.log("DB connected")
});

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(morgan("dev"));

const port = process.env.PORT || 8000;

// Routes
// app.use("/api/users", require("./src/routes/userRouter"));

app.listen(port, () => {
    console.log(`
    ################################################
          Server is running at http://localhost:${port}
    ################################################
  `);
}).on("error", (err: Error) => {
    console.error(err);
    process.exit(1);
});
