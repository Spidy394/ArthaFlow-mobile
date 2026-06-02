import SafeScreen from "@/components/SafeScreen";
import { COLORS } from "@/constants/colors";
import { Slot } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <SafeScreen>
        <Slot />
      </SafeScreen>
      <StatusBar barStyle={"dark-content"} backgroundColor={COLORS.background} />
    </>
  );
}
