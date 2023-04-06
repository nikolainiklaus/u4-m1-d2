import Express from "express";
import listEndpoints from "express-list-endpoints";
import passport from "passport";
import authorsRouter from "./api/authors/index.js";
import blogPostsRouter from "./api/blogposts/index.js";
import cors from "cors";
import mongoose from "mongoose";
import usersRouter from "./api/users/index.js";
import {
  forbiddenErrorHandler,
  genericErroHandler,
  notFoundErrorHandler,
  unauthorizedErrorHandler,
} from "./errorHandlers.js";
import googleStrategy from "./lib/googleOauth.js";
// import googleStrategy from "./lib/auth/googleOauth.js";

passport.use("google", googleStrategy);

const server = Express();
const port = process.env.PORT;
console.log("port", port);

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

mongoose.connect(process.env.MONGO_URL);

server.use(cors());

// server.use(cors());

server.use(Express.json());
server.use(passport.initialize());
server.use("/authors", authorsRouter);
server.use("/blogposts", blogPostsRouter);
server.use("/users", usersRouter);

// Error Handlers:
server.use(unauthorizedErrorHandler);
server.use(forbiddenErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericErroHandler);

mongoose.connection.on("connected", () => {
  console.log("connected to MongoDB");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log("application running on port:", port);
  });
});
