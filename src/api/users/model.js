import mongoose from "mongoose";

const { Schema, model } = mongoose;

const usersSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
});

export default model("User", usersSchema);
