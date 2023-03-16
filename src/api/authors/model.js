import mongoose from "mongoose";

const { Schema, model } = mongoose;

const authorsSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
  },
  {
    typestamp: true,
  }
);

export default model("Author", authorsSchema);
