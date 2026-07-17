import { Request, Response } from "express";
import { Prisma, Profile } from "../../generated/prisma/client";
import userModel from "../../models/user.model";
import { profileInputSchema } from "../../schemas/user.schema";

const checkProfileExist = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (typeof userId !== "string") {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  try {
    const profile: Profile | null = await userModel.findProfile(userId);
    if (!profile) {
      res.status(200).json({ hasProfile: false, profile: null });
    } else {
      res.status(200).json({ hasProfile: true, profile });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

const createProfile = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (typeof userId !== "string") {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  const parsed = profileInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "missing required information" });
    return;
  }
  const { displayName, image } = parsed.data;

  try {
    const profile: Profile = await userModel.createProfile(userId, {
      displayName,
      image,
    });
    res.status(201).json(profile);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({ message: "Profile already exist" });
      return;
    }
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

export default {
  checkProfileExist,
  createProfile,
};
