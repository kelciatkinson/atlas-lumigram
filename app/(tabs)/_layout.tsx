import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import CustomTabHeader from "@/components/CustomTabHeader";

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <CustomTabHeader backgroundColor="white" />
      <Tabs
        screenOptions={{
          headerShown: true,
          header: () => null,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home Feed",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size ?? 28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size ?? 28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="add-post"
          options={{
            title: "Create Post",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add" size={size ?? 28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favorites",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart" size={size ?? 28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            title: "My Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size ?? 28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile/[id]"
          options={{
            title: "Profile",
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
