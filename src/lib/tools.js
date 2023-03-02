import fs from "fs-extra";
import { join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const authorsPublicFolderPath = join(process.cwd(), "./public/img/authors");
const postsPublicFolderPath = join(process.cwd(), "./public/img/posts");
const authorsJSONPath = join(process.cwd(), "src/api/authors/authors.json");
const blogsJSONPath = join(process.cwd(), "src/api/blogposts/blogposts.json");

export const readAuthors = async (authorId) => {
  const authors = await readJSON(authorsJSONPath);
  if (authorId) {
    const author = authors.find((author) => author.id === authorId);
    return author;
  }
  return authors;
};
export const saveAuthorAvatar = (fileName, fileContent) => {
  writeFile(join(authorsPublicFolderPath, fileName), fileContent);
};

export const savePostImage = (fileName, fileContent) => {
  writeFile(join(postsPublicFolderPath, fileName), fileContent);
};

export const getPosts = async (postId) => {
  const blogs = await readJSON(blogsJSONPath);
  if (postId) {
    const blog = blogs.find((blog) => blog._id == postId);
    return blog;
  }
  return authors;
};

export const addComment = async (postId, commentContent) => {
  try {
    const blogs = await readJSON(blogsJSONPath);
    const blog = blogs.find((blog) => blog._id == postId);
    if (!blog) throw new Error("Blog post not found");

    const newComment = {
      author: commentContent.author,
      text: commentContent.text,
    };

    blog.comments.push(newComment);
    await writeJSON(blogsJSONPath, blogs);

    return newComment;
  } catch (error) {
    throw new Error(`Error adding comment to blog post: ${error.message}`);
  }
};
