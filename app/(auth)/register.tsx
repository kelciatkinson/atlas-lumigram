import { useState } from "react";
import { View, Text, Pressable, Alert, StyleSheet, Image } from "react-native";
import CustomInput from "@/components/CustomInput";
import { useAuth } from "@/components/context/AuthProvider";
import { useRouter } from "expo-router";
import logo from "@/assets/images/logo.png";

export default function RegisterScreen() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      displayName: username,
      email: `${username}@example.com`,
    };

    signIn(newUser);
    router.push("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={logo}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Lumigram logo"
        />
      </View>
      <Text style={[styles.text, styles.headerText]}>Register</Text>
      <View style={styles.inputContainer}>
        <CustomInput
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
        />
        <CustomInput
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
        />
        <CustomInput
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.buttonOne]}
          onPress={handleRegister}
        >
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
  logoContainer: {
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
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
