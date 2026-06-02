import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { styles } from "@/styles/auth.styles";
import { COLORS } from "@/constants/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (!/^[a-z0-9_]+$/.test(username)) {
      setError("Only lowercase letters, numbers, and underscores allowed.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { error: authError } = await authClient.signUp.email({
        name,
        username,
        email,
        password,
      } as any);
      if (authError) setError(authError.message ?? "Sign up failed.");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={0}
      keyboardShouldPersistTaps="handled"
      bounces={false}
    >
      <View
        style={[
          styles.container,
          { justifyContent: "flex-start", paddingTop: 40 },
        ]}
      >
        <Image
          source={require("@/assets/images/signup.png")}
          style={[styles.illustration, { height: 200 }]}
        />

        <Text style={[styles.title, { marginVertical: 10 }]}>
          Create Account
        </Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={name}
          placeholder="Full name"
          placeholderTextColor={COLORS.textLight}
          autoCapitalize="words"
          onChangeText={setName}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={username}
          placeholder="Username (e.g. john_doe)"
          placeholderTextColor={COLORS.textLight}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(val) => setUsername(val.toLowerCase())}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={email}
          placeholder="Email address"
          placeholderTextColor={COLORS.textLight}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
        />

        <View style={{ marginBottom: 16 }}>
          <TextInput
            style={[
              styles.input,
              error && styles.errorInput,
              { marginBottom: 0, paddingRight: 44 },
            ]}
            value={password}
            placeholder="Password (min. 8 characters)"
            placeholderTextColor={COLORS.textLight}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: 12,
              top: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating Account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href="/sign-in" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
