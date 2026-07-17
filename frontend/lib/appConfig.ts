// get configure data from app.config.ts, according to the environment, by using Constants.expoConfig

import Constants from "expo-constants";
import * as Linking from "expo-linking";

export const getAppScheme = () => {
  const configuredScheme = Constants.expoConfig?.scheme;
  const appEnv = Constants.expoConfig?.extra?.appEnv;
  const fallbackScheme = appEnv === "prod" ? "gowbie" : "gowbie-dev";

  return configuredScheme ?? fallbackScheme;
};

export const buildRedirect = (path: string) => {
  const scheme = getAppScheme();
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  if (scheme) return `${scheme}://${normalized}`;
  // Fallback
  return Linking.createURL(path);
};
