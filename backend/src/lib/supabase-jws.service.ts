// verify provided access token with supabase
import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "../config/env";

const SUPABASE_URL = env.SUPABASE_URL;
// json web key set
const JWKS = createRemoteJWKSet(
  new URL(`${SUPABASE_URL}/auth/v1/.well-known/jwks.json`),
);

// those who issuing access token
const issuer = `${SUPABASE_URL}/auth/v1`;

export const verifyAccessToken = async (accessToken: string) => {
  const { payload } = await jwtVerify(accessToken, JWKS, {
    issuer,
    audience: "authenticated",
  });

  return payload;
};

// payload contains the data below (not only them but they are the main data we use)
//  sub - user id
//  email - user email
//  aud - audience
//  iss - issuer
//  exp - expired date
