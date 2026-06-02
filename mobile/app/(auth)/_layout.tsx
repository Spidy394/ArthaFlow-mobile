import { Redirect, Stack } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { StatusBar } from "react-native";
import { COLORS } from "@/constants/colors";

export default function AuthRoutesLayout() {
  const { data: session } = authClient.useSession();

  if (session) {
    return <Redirect href={"/"} />;
  }
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={COLORS.background}
      />
    </>
  );
}
