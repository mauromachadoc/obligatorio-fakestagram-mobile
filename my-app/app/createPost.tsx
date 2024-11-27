import React, { useState, useEffect, useRef } from 'react';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';

import {
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Pressable,
  FlatList
} from 'react-native';

import { router, useNavigation } from 'expo-router';
import { addPost } from '@/api/post';
import { Ionicons } from '@expo/vector-icons';
import { useImagePermissions } from '@/hooks/useImagePermissions';

export default function CreatePost() {
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [useCamera, setUseCamera] = useState(false);
  const [description, setDescription] = useState("");

  const {
    page,
    setPage,
    handleSelectImage,
    setSelectedImage,
    selectedImage,
    images,
  } = useImagePermissions({
    setUseCamera,
  })

  const navigation = useNavigation();

  const cameraRef = useRef(null);

  const handleFlipCamera = () => {
    setFacing((prev) => prev === 'back' ? 'front' : 'back');
  };

  const handleUseCamera = () => {
    setUseCamera((prev) => !prev);
  }

  const handleSubmit = async (selectedImage, description) => {
    if (!selectedImage || !description) {
      Alert.alert("Error", "Por favor, selecciona una imagen y escribe una descripción.");
      return;
    }

    let fileUri = selectedImage;

    const formData = new FormData();
    formData.append("image", {
      uri: fileUri,
      name: "photo.jpg",
      type: "image/jpeg",
    });
    formData.append("caption", description);

    try {
      const response = await addPost(formData);

      if (response) {
        router.push('/');
        Alert.alert("Exito", "Post subido correctamente.");
        setSelectedImage('');
        setDescription("");
      } else {
        Alert.alert("Error", "Un error ocurrió mientras se subía el post.");
      }
    } catch (error) {
      console.error("Error subiendo el post:", error);
      Alert.alert("Error", "Un error ocurrió mientras se subía el post.");
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPressIn={() => handleSubmit(selectedImage, description)}>
          <Text style={styles.buttonText}>Subir Post</Text>
        </TouchableOpacity>
      ),
    });
  }, [selectedImage, description]);

  return (
    <SafeAreaView style={styles.container}>
      {
        useCamera ? (
          <View style={styles.selectedImageContainer}>
            <CameraView
              facing={facing}
              style={styles.selectedImage}
              ref={cameraRef}
              onPictureTaken={(photo) => {
                setSelectedImage(photo.uri);
                setUseCamera(false);
              }}
            >
              <Pressable
                onPress={() => cameraRef?.current?.takePictureAsync?.()
                  .then(photo => {
                    setSelectedImage(photo.uri);
                    setUseCamera(false);
                  })}
                style={styles.takePictureButton}
              >
                <Ionicons name="camera" size={24} color="white" />
              </Pressable>
              <Pressable
                onPress={handleFlipCamera}
                style={styles.flipCameraButton}
              >
                <Ionicons name="camera-reverse" size={24} color="white" />
              </Pressable>
            </CameraView>
          </View>
        ) : (
          <View style={styles.selectedImageContainer}>
            <Pressable onPress={handleUseCamera} style={styles.camera}>
              <Ionicons name="camera" size={24} color="white" />
            </Pressable>
            <Image source={{ uri: selectedImage || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png' }} style={styles.selectedImage} />
          </View>
        )
      }
      <View style={styles.inputContainer}>
        <Text>
          Descripcion:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Description"
          onChangeText={setDescription}
          value={description}
        />
      </View>
      <FlatList
        data={images}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectImage(item.uri)}>
            <Image source={{ uri: item.uri }} style={styles.imageThumbnail} />
          </TouchableOpacity>
        )}
        numColumns={3}
        onEndReached={() => setPage(page + 1)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          <View style={{ padding: 10 }}>
            <Text>Cargando más imágenes...</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10,
    alignItems: 'center',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  camera: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 2,
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
  selectedImageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  selectedImageText: {
    fontSize: 18,
    marginBottom: 8,
  },
  selectedImage: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  inputContainer: {
    gap: 8,
    width: '80%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    width: '80%',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 16
  },
  takePictureButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
  },
  flipCameraButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
