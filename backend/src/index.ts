import express, {Express} from 'express';
import morgan from 'morgan';
import dotenv from "dotenv";
import cors from "cors";
import {prisma} from "./datasource/connectDB";
import router from "./routes";
import {errorHandler} from "./middleware/errorHandler";

prisma.$connect().then(() => {
    console.log("DB connected")
});

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const port = process.env.PORT || 8000;

// Routes
app.use("/api", router);

// Error handler
app.use(errorHandler);

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
