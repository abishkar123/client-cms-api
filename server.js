import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan"
import cors from "cors"
const app = express();

const PORT = process.env.PORT || 8001;

//Database Connect

import { dbConnect } from "./src/config/dbConfig.js";
dbConnect();


//middlewares
app.use(cors())
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//API
import UserRouter from './src/router/UserRouter.js';


app.use("/api/v1/user", UserRouter)

//root url request
app.use("/", (req, res, next) => {
    const error = {
      message: "You dont have promission here",
    };
    next(error);
  });
  
//global error handleer
app.use((error, req, res, next) => {
    console.log(error);
    const statusCode = error.errorCode || 404;
    res.status(statusCode).json({
      status: "error",
      message: error.message,
    });
  });

  app.listen(PORT, (error) => {
    error
      ? console.log(error)
      : console.log(`Server running at http://localhost:${PORT}`);
  });