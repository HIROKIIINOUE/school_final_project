import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/supabase-jws.service";

export const authCheck = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401).json({ message: "Access token is required" });
    return;
  }
  if (!authorizationHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Invalid authorization header format" });
    return;
  }

  const accessToken = authorizationHeader.split(" ")[1];

  if (!accessToken) {
    res.status(401).json({ message: "Access token is not valid" });
    return;
  }

  try {
    const payload = await verifyAccessToken(accessToken);
    const id = String(payload.sub);
    req.userId = id;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "User is not authorized" });
  }
};
