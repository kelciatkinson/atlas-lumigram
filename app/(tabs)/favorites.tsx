import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import {
  LongPressGestureHandler,
  TapGestureHandler,
  State,
} from "react-native-gesture-handler";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  arrayUnion,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/components/context/AuthProvider";

export default function FavoritesScreen() {
  const { user } = useAuth();
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const userFavoritesRef = doc(db, "userFavorites", user.uid);
      const userFavoritesDoc = await getDoc(userFavoritesRef);

      if (!userFavoritesDoc.exists()) {
        setFavoriteItems([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const favorites = userFavoritesDoc.data().favorites || [];

      if (favorites.length === 0) {
        setFavoriteItems([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const fetchedPosts = [];

      for (const postId of favorites) {
        const postRef = doc(db, "posts", postId);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
          fetchedPosts.push({
            id: postDoc.id,
            ...postDoc.data(),
          });
        }
      }

      setFavoriteItems(fetchedPosts);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFavorites();
  }, [fetchFavorites]);

  const FeedImage = ({ uri, imageKey }) => {
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
      setImageLoading(true);
    }, [uri]);

    return (
      <View style={styles.imageContainer}>
        {imageLoading && (
          <View style={styles.imagePlaceholder}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        <Image
          key={imageKey}
          source={{ uri }}
          style={styles.feedImage}
          onLoadStart={() => setImageLoading(true)}
          onLoad={() => setImageLoading(false)}
          defaultSource={null}
        />
      </View>
    );
  };

  const FeedItem = ({ item }) => {
    const { user } = useAuth();
    const [showCaption, setShowCaption] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const doubleTapRef = React.useRef();

    useEffect(() => {
      const checkIfFavorited = async () => {
        if (!user) return;

        try {
          const userFavoritesRef = doc(db, "userFavorites", user.uid);
          const userFavoritesDoc = await getDoc(userFavoritesRef);

          if (userFavoritesDoc.exists()) {
            const favorites = userFavoritesDoc.data().favorites || [];
            setIsFavorite(favorites.includes(item.id));
          }
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      };

      checkIfFavorited();
    }, [user, item.id]);

    const handleLongPress = (event) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        setShowCaption(true);
      } else if (event.nativeEvent.state === State.END) {
        setShowCaption(false);
      }
    };

    const toggleFavorite = async () => {
      if (!user) {
        Alert.alert("Sign In Required", "Please sign in to favorite posts");
        return;
      }

      try {
        const userFavoritesRef = doc(db, "userFavorites", user.uid);
        const userFavoritesDoc = await getDoc(userFavoritesRef);

        if (!userFavoritesDoc.exists()) {
          await setDoc(userFavoritesRef, {
            favorites: [item.id],
            userId: user.uid,
            updatedAt: new Date(),
          });
          setIsFavorite(true);
          Alert.alert("Success", `You favorited ${item.createdBy}'s post!`);
          fetchFavorites();
          return;
        }
        if (isFavorite) {
          await updateDoc(userFavoritesRef, {
            favorites: arrayRemove(item.id),
            updatedAt: new Date(),
          });
          setIsFavorite(false);
          Alert.alert("Removed", `Removed from favorites`);
          fetchFavorites();
        } else {
          await updateDoc(userFavoritesRef, {
            favorites: arrayUnion(item.id),
            updatedAt: new Date(),
          });
          setIsFavorite(true);
          Alert.alert("Success", `You favorited ${item.createdBy}'s post!`);
          fetchFavorites();
        }
      } catch (error) {
        console.error("Error updating favorites:", error);
        Alert.alert("Error", "Failed to update favorites. Please try again.");
      }
    };

    const handleDoubleTap = (event) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        toggleFavorite();
      }
    };

    return (
      <View style={styles.feedItem}>
        <View style={{ marginHorizontal: 2 }}>
          <TapGestureHandler
            waitFor={doubleTapRef}
            shouldCancelWhenOutside={true}
          >
            <View>
              <TapGestureHandler
                ref={doubleTapRef}
                numberOfTaps={2}
                onHandlerStateChange={handleDoubleTap}
                shouldCancelWhenOutside={true}
              >
                <View>
                  <LongPressGestureHandler
                    onHandlerStateChange={handleLongPress}
                    minDurationMs={500}
                    shouldCancelWhenOutside={true}
                  >
                    <View>
                      <FeedImage
                        uri={item.image}
                        imageKey={`image-${item.id}`}
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
      </View>
    );
  };

  const renderItem = useCallback(
    ({ item }) => {
      return <FeedItem item={item} />;
    },
    [fetchFavorites]
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user || favoriteItems.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ fontSize: 18, textAlign: "center", margin: 20 }}>
          {!user
            ? "Please sign in to see your favorites"
            : "You haven't favorited any posts yet.\nDouble-tap on a post in the feed to add it to favorites."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={favoriteItems}
        renderItem={renderItem}
        estimatedItemSize={400}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="always"
        refreshing={refreshing}
        onRefresh={handleRefresh}
        extraData={favoriteItems}
        initialScrollIndex={0}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        removeClippedSubviews={false}
        contentContainerStyle={{
          paddingBottom: 60,
        }}
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
    marginBottom: 90,
    paddingHorizontal: 2,
  },
  feedItem: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  imageContainer: {
    width: width - 4,
    height: width - 20,
    borderRadius: 30,
    alignSelf: "center",
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
  },
  imagePlaceholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  feedImage: {
    width: "100%",
    height: "100%",
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
  favoriteIcon: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
  },
  favoriteIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
