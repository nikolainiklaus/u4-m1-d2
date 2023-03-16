import Express from "express";
import UsersModel from "./model.js";

const usersRouter = Express.Router();

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body);
    const createdUser = await newUser.save();
    res.status(201).send(createdUser);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
