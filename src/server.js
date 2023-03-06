import Express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./api/authors/index.js";
import blogPostsRouter from "./api/blogposts/index.js";
import cors from "cors";

const server = Express();
const port = process.env.PORT;
console.log("port", port);
server.use(cors());
server.use(Express.json());
server.use("/authors", authorsRouter);
server.use("/blogposts", blogPostsRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("trying things out");
  console.log("application running on port:", port);
});
