import Express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./api/authors/index.js";
import blogPostsRouter from "./api/blogposts/index.js";
import cors from "cors";
import mongoose from "mongoose";

const server = Express();
const port = process.env.PORT;
console.log("port", port);

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

mongoose.connect(process.env.MONGO_URL);

server.use(
  cors({
    origin: (currentOrigin, corsNext) => {
      if (!currentOrigin || whitelist.indexOf(currentOrigin) !== -1) {
        // origin is in the whitelist
        corsNext(null, true);
      } else {
        // origin is not in the whitelist
        corsNext(
          createHttpError(
            400,
            `Origin ${currentOrigin} is not in the whitelist!`
          )
        );
      }
    },
  })
);

// server.use(cors());

server.use(Express.json());
server.use("/authors", authorsRouter);
server.use("/blogposts", blogPostsRouter);

mongoose.connection.on("connected", () => {
  console.log("connected to MongoDB");
  server.listen(port, () => {
    console.table(listEndpoints(server));

    console.log("application running on port:", port);
  });
});
