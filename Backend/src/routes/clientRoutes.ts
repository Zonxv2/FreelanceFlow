import express from "express";
import {
  createClient,
  getClients,
  updateClient,
  deleteClient,
} from "../controllers/clientController";

import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, createClient);

router.get("/", authMiddleware, getClients);

router.put("/:id", authMiddleware, updateClient);

router.delete("/:id", authMiddleware, deleteClient);

export default router;