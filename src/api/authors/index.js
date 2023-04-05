import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { Dir } from "fs";
import { dirname, join } from "path";
import uniqid from "uniqid";
import uiavatars from "ui-avatars";
import multer from "multer";
import { extname } from "path";
import { saveAuthorAvatar, readAuthors } from "../../lib/tools.js";
import AuthorsModel from "./model.js";
import { basicAuthMiddleware } from "../../lib/basic.js";

const authorsRouter = Express.Router();

const localFile = import.meta.url;
const fileToPath = fileURLToPath(localFile);
const parentFolderPath = dirname(fileToPath);
const authorsJSONPath = join(parentFolderPath, "/authors.json");

// console.log(localFile);
// console.log(fileToPath);
// console.log(parentFolderPath);
// console.log(authorsJSONPath);

authorsRouter.get("/", basicAuthMiddleware, async (req, res, next) => {
  try {
    const authors = await readAuthors();
    res.status(200).send(authors);
    console.log(authors);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

authorsRouter.get("/:authorId", basicAuthMiddleware, async (req, res) => {
  try {
    const author = await readAuthors(req.params.authorId);
    res.status(200).send(author);
  } catch (error) {
    console.log("author found");
  }
});

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorsModel(req.body);
    const { email, password } = req.body;
    const createdAuthor = await newAuthor.save();
    res.status(201).send(createdAuthor);
    const encodedCredentials = Buffer.from(`${email}:${password}`).toString(
      "base64"
    );
    console.log(
      `New user created with email ${email} and credentials ${encodedCredentials}`
    );
  } catch (error) {
    next(error);
  }
});

//old
// authorsRouter.post("/", (req, res) => {
//   const authors = JSON.parse(fs.readFileSync(authorsJSONPath));
//   const existingMail = authors.find(
//     (author) => author.email === req.body.email
//   );

//   if (existingMail) {
//     res.status(400).send("Email address already exists");
//     console.log("Email address already exists");
//     return;
//   }

//   const avatarURL = uiavatars.generateAvatar({
//     uppercase: true,
//     name: req.body.name + req.body.surname,
//     background: "990000",
//     color: "000000",
//     fontsize: 0.5,
//     bold: true,
//     length: 2,
//     rounded: true,
//     size: 250,
//   });

//   const newAuthor = {
//     ...req.body,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     avatar: avatarURL,
//     id: uniqid(),
//   };

//   authors.push(newAuthor);
//   fs.writeFileSync(authorsJSONPath, JSON.stringify(authors));

//   res.status(201).send(newAuthor.id);
//   console.log("author created:", newAuthor.id);
// });

authorsRouter.put("/:authorId", basicAuthMiddleware, (req, res) => {
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

authorsRouter.delete("/:authorId", basicAuthMiddleware, (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath));
  const remainingAuthors = authors.filter(
    (author) => author.id !== req.params.authorId
  );

  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));

  res.status(204).send(remainingAuthors);
  console.log("user deleted:", remainingAuthors);
});

authorsRouter.post(
  "/:authorId/uploadAvatar",
  basicAuthMiddleware,
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      const fileExtension = extname(req.file.originalname);
      const fileName = req.params.authorId + fileExtension;
      await saveAuthorAvatar(fileName, req.file.buffer);
      res.send({ message: "avatar uploaded" });
    } catch (error) {
      next(error);
    }
  }
);

export default authorsRouter;
