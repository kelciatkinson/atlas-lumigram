import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAuth } from "@/components/context/AuthProvider";
import { router, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CustomHeader({ backgroundColor }) {
  const { user, signOut, isSignedIn } = useAuth();
  const pathname = usePathname();

  const getTitle = () => {
    if (
      pathname === "/" ||
      pathname === "/(tabs)" ||
      pathname === "/(tabs)/" ||
      pathname === "/(tabs)/index"
    ) {
      return "Home";
    } else if (pathname.includes("/profile")) {
      return "Profile";
    } else if (pathname.includes("/add-post")) {
      return "Add Post";
    } else if (pathname.includes("/favorites")) {
      return "Favorites";
    } else if (pathname.includes("/search")) {
      return "Search";
    }

    return "Lumi Gram";
  };

  const handleLogout = async () => {
    // First sign out using the auth context
    await signOut();

    // Then explicitly navigate to the auth screen
    router.replace("/(auth)");
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{getTitle()}</Text>
      </View>
      {isSignedIn ? (
        <Pressable style={styles.iconButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#1ED2AF" />
        </Pressable>
      ) : (
        <Pressable
          style={styles.button}
          onPress={() => router.replace("/(auth)")}
        >
          <Text>Login</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 50,
    paddingBottom: 10,
    paddingRight: 25,
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 10,
    backgroundColor: "#1ED2AF",
    borderRadius: 15,
  },
});
