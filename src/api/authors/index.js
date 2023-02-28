import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { Dir } from "fs";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorsRouter = Express.Router();

const localFile = import.meta.url;
const fileToPath = fileURLToPath(localFile);
const parentFolderPath = dirname(fileToPath);
const authorsJSONPath = join(parentFolderPath, "/authors.json");

console.log(localFile);
console.log(fileToPath);
console.log(parentFolderPath);
console.log(authorsJSONPath);

authorsRouter.get("/", (req, res) => {
  const fileAsBuffer = fs.readFileSync(authorsJSONPath);
  const authors = JSON.parse(fileAsBuffer);
  res.status(200).send(authors);
  console.log(authors);
});

authorsRouter.get("/:authorId", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath));
  const author = authors.find((author) => author.id === req.params.authorId);
  res.status(200).send(author);
  console.log("author found:", author);
});

authorsRouter.post("/", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath));
  const existingMail = authors.find(
    (author) => author.email === req.body.email
  );

  if (existingMail) {
    res.status(400).send("Email address already exists");
    console.log("Email address already exists");
    return;
  }

  const newAuthor = {
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uniqid(),
  };

  authors.push(newAuthor);
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authors));

  res.status(201).send(newAuthor.id);
  console.log("author created:", newAuthor.id);
});

authorsRouter.put("/:authorId", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath));
  const index = authors.findIndex(
    (author) => author.id === req.params.authorId
  );
  const oldAuthor = authors[index];
  const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };
  authors[index] = updatedAuthor;

  fs.writeFileSync(authorsJSONPath, JSON.stringify(authors));

  res.status(201).send(updatedAuthor);
  console.log("author updated:", updatedAuthor);
});

authorsRouter.delete("/:authorId", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath));
  const remainingAuthors = authors.filter(
    (author) => author.id !== req.params.authorId
  );

  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));

  res.status(204).send(remainingAuthors);
  console.log("user deleted:", remainingAuthors);
});

export default authorsRouter;
