import * as Crypto from "expo-crypto";

export function createClientId(): string {
  return Crypto.randomUUID();
}
