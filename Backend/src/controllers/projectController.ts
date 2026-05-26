import { Request, Response } from "express";
import Project from "../models/Project";
import { AuthRequest } from "../middlewares/authMiddleware";

export const getProjects = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const projects = await Project.find({
      user: req.user.id,
    }).populate("client");

    res.json(projects);

  } catch (error) {

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const createProject = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const {
      title,
      description,
      status,
      budget,
      client,
    } = req.body;

    const project = await Project.create({
      title,
      description,
      status,
      budget,
      client,
      user: req.user.id,
    });

    res.status(201).json(project);

  } catch (error) {

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateProject = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const updatedProject =
      await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updatedProject);

  } catch (error) {

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteProject = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    await Project.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Project deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
    });
  }
};