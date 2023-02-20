import express, { Express } from 'express';
import morgan from 'morgan';

const app: Express = express();
app.use(express.json());
app.use(morgan("dev"));

const port = 8000;

// Routes
//app.use("/api/users", require("./src/routes/userRouter"));

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
