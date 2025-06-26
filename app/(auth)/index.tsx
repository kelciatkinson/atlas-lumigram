import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import CustomInput from "@/components/CustomInput";
import { AuthProvider, useAuth } from "@/components/context/AuthProvider";
import { Link, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import lumiAnimation from "@/assets/lumi.json";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    const fakeUser = {
      id: "1",
      displayName: email,
      email: `${email}`,
    };

    signIn(fakeUser);
    router.push("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          source={lumiAnimation}
          autoPlay
          loop
          style={styles.animation}
          resizeMode="cover"
        />
      </View>
      <Text style={[styles.headerText, styles.text]}>Login</Text>
      <View style={styles.inputContainer}>
        <CustomInput
          placeholder="Email"
          placeholderTextColor={"white"}
          onChangeText={setEmail}
          value={email}
          style={{ color: "white" }}
        />
        <CustomInput
          placeholder="Password"
          placeholderTextColor={"white"}
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          style={{ color: "white" }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.buttonOne]}
          onPress={handleLogin}
        >
          <Text style={styles.text}>Sign In</Text>
        </Pressable>
        <Link
          style={[styles.button, styles.buttonTwo]}
          href={"/(auth)/register"}
        >
          <Text style={styles.text}>Create a new account</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#00003C",
    display: "flex",
    height: "100%",
    justifyContent: "flex-start",
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
  animationContainer: {
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  animation: {
    width: "100%",
    height: "100%",
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
