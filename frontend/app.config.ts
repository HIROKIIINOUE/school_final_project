// app.jsonと同じ役割。アプリのメタ情報を管理。app.config.tsではapp.jsonと異なり環境(開発or本番)に合わせてメタ情報を変更できる。
// app.json or app.config.tsのどちらかを選び用意するとExpoがビルド時に読み込んでくれる。
// ※両方ある場合は dynamic config が最終的に使われる
import { ExpoConfig } from "@expo/config";

const APP_ENV = process.env.APP_ENV ?? "dev";
const isProd = APP_ENV === "prod";

const scheme = isProd ? "gowbie" : "gowbie-dev";
const name = isProd ? "gowbie" : "gowbie(dev)";

export default (): ExpoConfig => ({
  name,
  slug: "gowbie",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.gowbie.app",
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    appEnv: APP_ENV,
  },
});
