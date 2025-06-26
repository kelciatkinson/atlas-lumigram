import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, StyleSheet, Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";

interface ImagePickerProps {
  onImageSelected: (uri: string | null) => void;
  imageUri: string | null;
}

const ImagePickerComponent: React.FC<ImagePickerProps> = ({
  onImageSelected,
  imageUri,
}) => {
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(status === "granted");
    })();
  }, []);

  const pickImage = async () => {
    try {
      if (!hasMediaLibraryPermission) {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Please grant media library permissions to select photos."
          );
          return;
        }
        setHasMediaLibraryPermission(true);
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        </View>
      ) : (
        <Pressable
          style={[styles.button, styles.buttonOne]}
          onPress={pickImage}
        >
          <Text style={styles.text}>Select image from gallery</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
  },
  text: {
    color: "white",
    textAlign: "center",
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
  imagePreviewContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  imagePreview: {
    width: 300,
    height: 300,
    borderRadius: 10,
    resizeMode: "cover",
  },
});

export default ImagePickerComponent;
