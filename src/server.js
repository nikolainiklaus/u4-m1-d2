import Express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./api/authors/index.js";

const server = Express();
const port = 3001;

server.use(Express.json());
server.use("/authors", authorsRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("trying things out");
  console.log("application running on port:", port);
});
