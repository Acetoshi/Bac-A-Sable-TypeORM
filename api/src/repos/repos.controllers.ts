import express, { NextFunction } from "express";
import { Request, Response } from "express";
import z from "zod";
import repos from "../../data/repo.json";
import { Repo } from "@/types";

// BREAD operations
const browse = (_: Request, res: Response) => {
  res.status(200).json(repos);
};

const read = (req: Request, res: Response) => {
  const result = repos.filter((repo: Repo) => repo.id == req.params.id);

  if (result.length === 0) {
    res.status(404).json("No repo was found");
  } else {
    res.status(200).json(result[0]);
  }
};

const add = (req: Request, res: Response) => {
  repos.push(req.body);
  res.status(201).json(req.body);
};

//Validate that the body actually is compatible with repos

// Define Zod schema
const RepoSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string()
});

const validateRepo = (req: Request, res: Response, next: NextFunction) => {
  try {
    RepoSchema.parse(req.body);
    next();
  } catch (e) {
    res.status(400).json("the data isn't in the right format");
  }
};

// HTTP verbs assciated with this controller
const repoControllers = express.Router();

repoControllers.get("/", browse);
repoControllers.get("/:id", read);
repoControllers.post("/", validateRepo, add);

export default repoControllers;
