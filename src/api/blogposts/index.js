import express from "express";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
const { readJSON, writeJSON, writeFile } = fs;
import multer from "multer";
import { extname } from "path";
import { addComment, getPosts, savePostImage } from "../../lib/tools.js";
import { log } from "console";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";
import { pipeline } from "stream";

const blogPostsRouter = express.Router();

const blogPostsFilePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogposts.json"
);

// GET /blogPosts => returns the list of blogposts
blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await readJSON(blogPostsFilePath);
    res.send(blogPosts);
  } catch (error) {
    next(error);
  }
});

// GET /blogPosts/123 => returns a single blogpost
blogPostsRouter.get("/:id", async (req, res, next) => {
  try {
    const blogPost = await getPosts(req.params.id);
    if (blogPost) {
      res.send(blogPost);
    } else {
      res.status(404).send("Blog post not found.");
    }
  } catch (error) {
    next(error);
  }
});

// POST /blogPosts => create a new blogpost
blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const blogPosts = await readJSON(blogPostsFilePath);
    const newBlogPost = {
      _id: uniqid(),
      ...req.body,
      createdAt: new Date(),
    };
    blogPosts.push(newBlogPost);
    await writeJSON(blogPostsFilePath, blogPosts);
    res.send(newBlogPost);
  } catch (error) {
    next(error);
  }
});

// PUT /blogPosts/123 => edit the blogpost with the given id
blogPostsRouter.put("/:id", async (req, res, next) => {
  try {
    const blogPosts = await readJSON(blogPostsFilePath);
    const index = blogPosts.findIndex((post) => post._id === req.params.id);
    if (index !== -1) {
      const updatedBlogPost = {
        ...blogPosts[index],
        ...req.body,
        updatedAt: new Date(),
      };
      blogPosts[index] = updatedBlogPost;
      await writeJSON(blogPostsFilePath, blogPosts);
      res.send(updatedBlogPost);
    } else {
      res.status(404).send("Blog post not found.");
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /blogPosts/123 => delete the blogpost with the given id
blogPostsRouter.delete("/:id", async (req, res, next) => {
  try {
    const blogPosts = await readJSON(blogPostsFilePath);
    const remainingBlogPosts = blogPosts.filter(
      (post) => post._id !== req.params.id
    );
    await writeJSON(blogPostsFilePath, remainingBlogPosts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.post(
  "/:id/uploadCover",
  multer().single("cover"),
  async (req, res, next) => {
    try {
      const fileExtension = extname(req.file.originalname);
      const fileName = req.params.id + fileExtension;
      const blogCover = await savePostImage(fileName, req.file.buffer);
      res.send({ message: "cover uploaded" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

blogPostsRouter.get("/:id/comments", async (req, res, next) => {
  try {
    const blog = await getPosts(req.params.id);
    res.status(200).send(blog.comments);
  } catch (error) {
    console.log("blog not found");
  }
});

blogPostsRouter.post("/:id/comments", async (req, res, next) => {
  try {
    const newComment = await addComment(req.params.id, req.body);
    res.status(201).send(newComment);
  } catch (error) {
    console.log(error);
    next(error);
  }
  console.log("test");
});

blogPostsRouter.get("/:id/pdf", async (req, res, next) => {
  try {
    console.log("pdf has been triggered");
    const posts = await getPosts();
    const post = posts.find((post) => post._id == req.params.id);
    if (post) {
      console.log(post);
      const pdfStream = await getPDFReadableStream(post);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${post.title}.pdf`
      );
      pipeline(pdfStream, res, (err) => {
        if (err) {
          console.log(err);
          next(err);
        }
      });
    } else {
      console.log("post with this ID is not found");
    }
  } catch (error) {
    next(error);
  }
});

export default blogPostsRouter;
