import { useState } from "react";
import { View, Text, Pressable, Alert, StyleSheet } from "react-native";
import CustomInput from "@/components/CustomInput";
import { useAuth } from "@/components/context/AuthProvider";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const auth = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  async function register() {
    try {
      await auth.register(email, password);
      router.replace("/(tabs)");
    } catch (err) {
      alert("unable to create account.");
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
          placeholderTextColor={undefined}
        />
        <CustomInput
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          placeholderTextColor={undefined}
        />
        <CustomInput
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          placeholderTextColor={undefined}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, styles.buttonOne]} onPress={register}>
          <Text style={styles.text}>Create Account</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.buttonTwo]}
          onPress={() => router.push("/(auth)")}
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
});
