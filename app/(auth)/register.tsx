import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import CustomInput from "@/components/CustomInput";
import { useAuth } from "@/components/context/AuthProvider";
import { useRouter } from "expo-router";
import { updateProfile } from "firebase/auth";

export default function RegisterScreen() {
  const auth = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function register() {
    if (!username.trim()) {
      Alert.alert("Error", "Please enter a username");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Error", "Please enter an email address");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Please enter a password");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const result = await auth.register(email.trim(), password);
      await updateProfile(result.user, {
        displayName: username.trim(),
      });

      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.replace("/(tabs)") },
      ]);
    } catch (error: any) {
      let errorMessage = "Failed to create account. ";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage +=
            "This email is already registered. Try logging in instead.";
          break;
        case "auth/weak-password":
          errorMessage += "Password is too weak. Use at least 6 characters.";
          break;
        case "auth/invalid-email":
          errorMessage += "Please enter a valid email address.";
          break;
        case "auth/operation-not-allowed":
          errorMessage += "Email/password authentication is not enabled.";
          break;
        default:
          errorMessage += error.message || "Unknown error occurred.";
      }

      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.headerText]}>Register</Text>

      <View style={styles.inputContainer}>
        <CustomInput
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
          placeholderTextColor="white"
          style={styles.input}
        />
        <CustomInput
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          placeholderTextColor="white"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
        <CustomInput
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          placeholderTextColor="white"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.buttonOne, loading && { opacity: 0.7 }]}
          onPress={register}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.text}>Create Account</Text>
          )}
        </Pressable>

        <Pressable
          style={[styles.button, styles.buttonTwo]}
          onPress={() => router.push("/(auth)")}
          disabled={loading}
        >
          <Text style={styles.text}>Login to existing account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#00003C",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 20,
  },
  inputContainer: {
    display: "flex",
    width: "100%",
    gap: 10,
  },
  buttonContainer: {
    display: "flex",
    width: "100%",
    gap: 10,
  },
  text: {
    color: "white",
    textAlign: "center",
  },
  headerText: {
    fontSize: 24,
  },
  button: {
    width: "100%",
    padding: 20,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonOne: {
    backgroundColor: "#1ED2AF",
  },
  buttonTwo: {
    borderWidth: 2,
    borderColor: "black",
  },
  input: {
    color: "white",
  },
});
