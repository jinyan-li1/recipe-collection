import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// CRUD - Create, Return, Update, Delete
// POST: creates new recipe
app.post("/recipes", async (req, res) => {
  const { title, content } = req.body;
  if (title.length <= 0 || title.length > 25 
    || content.length <= 0 || content.length > 500) {
    res.status(406).send("Invalid title and/or content input.");
  } else {
    const recipeItem = await prisma.recipeTable.create({
        data: {
          title,
          content
        },
      });
      res.json(recipeItem);
  }
});

// GET: return all recipes in database
app.get("/recipes", async (req, res) => {
  const recipeItems = await prisma.recipeTable.findMany();
  res.json(recipeItems);
});

// UPDATE: update an recipe by id
app.put("/recipes", async (req, res) => {
  const { id, content } = req.body;
  if (content.length <= 0 || content.length > 500) {
    res.status(406).send("Invalid content input.");
  } else {
    const recipeItem = await prisma.recipeTable.update({
      where: {
        id
      },
      data: {
        content
      }
    });
    res.json(recipeItem);
  }
});

// DELETE: deletes a recipe by id
app.delete("/recipes", async (req, res) => {
  const { id } = req.body;
  const recipeItem = await prisma.recipeTable.delete({
    where: {
      id
    }
  });
  const recipeItems = await prisma.recipeTable.findMany();
  res.json(recipeItems);
});

// Starts HTTP Server
app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
