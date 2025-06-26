import React, { useState, useRef } from "react";
import { View, Text, Image, StyleSheet, Dimensions, Alert } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { homeFeed } from "@/placeholder";
import {
  LongPressGestureHandler,
  TapGestureHandler,
  State,
} from "react-native-gesture-handler";

const FeedItem = ({ item }) => {
  const [showCaption, setShowCaption] = useState(false);
  const doubleTapRef = React.useRef();

  const handleLongPress = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setShowCaption(true);
    } else if (event.nativeEvent.state === State.END) {
      setShowCaption(false);
    }
  };

  const handleSingleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
    }
  };

  const handleDoubleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      Alert.alert("Double Tap", `You liked ${item.createdBy}'s post!`);
    }
  };

  return (
    <View style={styles.feedItem}>
      <TapGestureHandler
        waitFor={doubleTapRef}
        onHandlerStateChange={handleSingleTap}
      >
        <View>
          <TapGestureHandler
            ref={doubleTapRef}
            numberOfTaps={2}
            onHandlerStateChange={handleDoubleTap}
          >
            <View>
              <LongPressGestureHandler
                onHandlerStateChange={handleLongPress}
                minDurationMs={500}
              >
                <View>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.feedImage}
                  />
                  {showCaption && (
                    <View style={styles.overlayCaption}>
                      <Text style={styles.overlayCaptionText}>
                        {item.caption}
                      </Text>
                    </View>
                  )}
                </View>
              </LongPressGestureHandler>
            </View>
          </TapGestureHandler>
        </View>
      </TapGestureHandler>
    </View>
  );
};

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <FlashList
        data={homeFeed}
        renderItem={({ item }) => <FeedItem item={item} />}
        estimatedItemSize={400}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
    marginBottom: 70,
  },
  feedItem: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  feedImage: {
    width: width,
    height: width - 20,
    borderRadius: 30,
  },
  username: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  caption: {
    color: "#333",
  },
  overlayCaption: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  overlayCaptionText: {
    color: "#fff",
    fontSize: 16,
    padding: 20,
    textAlign: "center",
  },
});
