import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const baseURL =
  Platform.OS === "web"
    ? "http://localhost:3000"
    : (process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000");

const plugins =
  Platform.OS === "web"
    ? []
    : [
        expoClient({
          scheme: "myapp",
          storagePrefix: "myapp",
          storage: SecureStore,
        }),
      ];

export const authClient = createAuthClient({
  baseURL,
  plugins,
});
