import React from "react";
import { View, Image, StyleSheet } from "react-native";

export default function ImagePreview({ source = {} }) {
  const imageSource = typeof source === "string" ? { uri: source } : source;

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 1,
    alignSelf: "center",
    borderRadius: 30,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
