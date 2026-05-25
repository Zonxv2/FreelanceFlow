import { Response } from "express";
import Client from "../models/Client";
import { AuthRequest } from "../middlewares/authMiddleware";


export const createClient = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name, email, phone, company } = req.body;

    const client = await Client.create({
      name,
      email,
      phone,
      company,
      owner: req.user.id,
    });

    res.status(201).json(client);
  } catch (error) {
  console.log(error);

  res.status(500).json({
    message: "Server error",
    });
  }
};

export const getClients = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const clients = await Client.find({
      owner: req.user.id,
    });

    res.status(200).json(clients);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteClient = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    if (client.owner.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    await client.deleteOne();

    res.status(200).json({
      message: "Client deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateClient = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    if (client.owner.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatedClient);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};