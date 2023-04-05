import createHttpError from "http-errors";
import AuthorsModel from "../api/authors/model.js";

export const adminOnlyMiddleware = async (req, res, next) => {
  const author = await AuthorsModel.findById(req.author._id);
  if (author.role === "Admin") {
    next();
  } else {
    next(createHttpError(403, "Admins only endpoint!"));
  }
};
