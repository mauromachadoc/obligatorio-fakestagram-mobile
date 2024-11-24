import React, { useState } from "react";
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, Alert, TextInput, SafeAreaView
} from "react-native";
import * as ImagePicker from "expo-image-picker";


export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permission to upload images."
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync();

      if (!result.cancelled) {
        setFile(result.assets[0].uri);
        setError(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!file || !description) {
      Alert.alert("Error", "Please provide both an image and a description.");
      return;
    }

    const formData = new FormData();
    formData.append("image", {
      uri: file,
      name: "photo.jpg",
      type: "image/jpeg",
    });
    formData.append("caption", description);

    try {
      const response = await fetch("http://192.168.1.32:3001/api/posts/upload", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzI2N2E4ZWMzYzBhMjAyY2Y3MzQ1ZiIsImlhdCI6MTczMTM1Njg1OCwiZXhwIjoxNzMzOTQ4ODU4fQ.qtMmuQ5LaBnE7NHTOLPwLzAK8d_uOsoDiUT2tsL7Me0"
        },
        body: formData,
      });

      console.log(response);

      if (response.ok) {
        Alert.alert("Success", "Your post has been uploaded!");
        setFile(null);
        setDescription("");
      } else {
        Alert.alert("Error", "Failed to upload the post.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while uploading the post.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Elegir una imagen</Text>
      </TouchableOpacity>

      {file && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: file }} style={styles.image} />
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        onChangeText={(text) => setDescription(text)}
        value={description}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Subir</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "#F2F2F7",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageContainer: {
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  errorText: {
    color: "red",
    marginTop: 16,
  },
});
