import { authClient } from "@/lib/auth-client";
import { Redirect, Stack } from "expo-router";

export default function RootLayout() {
    const { data: session } = authClient.useSession();

    if (!session) return <Redirect href={"/(auth)/sign-in" as any} />

    return <Stack screenOptions={{ headerShown: false }} /> 
}