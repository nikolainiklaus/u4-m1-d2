import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number },
      unit: { type: String },
    },
    author: {
      name: { type: String },
      avatar: { type: String },
    },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "Author" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

// blogSchema.static("findBlogsWithAuthor", async function (query) {
//   const blogs = await this.find(query.criteria, query.options.fields)
//     .limit(query.options.limit)
//     .skip(query.options.skip)
//     .sort(query.options.sort)
//     .populate({ path: "author", select: "name surname" });
//   return { blogs };
// });

export default model("Blog", blogSchema);
