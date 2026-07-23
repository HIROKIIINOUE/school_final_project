import { Profile } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { ProfileInputType } from "../schemas/user.schema";

const findProfile = async (userId: string) => {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) {
    return null;
  }
  return profile;
};

const createProfile = async (
  userId: string,
  inputData: ProfileInputType,
): Promise<Profile> => {
  return await prisma.profile.create({ data: { ...inputData, userId } });
};

export default { findProfile, createProfile };
