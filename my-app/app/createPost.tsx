import React, { useState, useEffect, useRef } from 'react';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';

import { Button, Text, SafeAreaView, ScrollView, StyleSheet, Image, View, TouchableOpacity, TextInput, Alert, Pressable, FlatList } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { router, useNavigation } from 'expo-router';
import { addPost } from '@/api/post';
import { Ionicons } from '@expo/vector-icons';

export default function CreatePost() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState("");
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [page, setPage] = useState(1);
  const cameraRef = useRef(null);

  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [useCamera, setUseCamera] = useState(false);
  const [permission, requestCameraPermission] = useCameraPermissions();

  const navigation = useNavigation();

  const fetchImages = async () => {
    try {
      const albumAssets = await MediaLibrary.getAssetsAsync({
        first: 10,
        after: images.length > 0 ? images[images.length - 1].id : undefined,
        mediaType: 'photo',
      });

      const imagePromises = await Promise.all(albumAssets.assets.map(async (asset) => {
        const localUri = await getLocalUri(asset.id);
        const compressedUri = await compressImage(localUri);

        return { id: asset.id, uri: compressedUri };
      }));

      setImages([...images, ...imagePromises].filter((image, index, self) => self.findIndex((t) => t.id === image.id) === index));
    } catch (error) {
      Alert.alert("Error", "Error al cargar las imágenes.");
    }
  };

  const getLocalUri = async (id) => {
    try {
      const assetInfo = await MediaLibrary.getAssetInfoAsync(id);

      if (!assetInfo) {
        throw new Error('Asset info is null');
      }
      const localUri = assetInfo.localUri || assetInfo.uri;

      const fileInfo = await FileSystem.getInfoAsync(localUri);

      if (!fileInfo.exists) {
        const downloadResumable = FileSystem.createDownloadResumable(
          localUri,
          FileSystem.documentDirectory + 'photo.jpg'
        );
        const { uri: downloadedUri } = await downloadResumable.downloadAsync();
        return downloadedUri;
      } else {
        return localUri;
      }
    } catch (error) {
      console.error("Error getting local URI:", error);
      return uri;
    }
  };

  const compressImage = async (uri) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 300 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      return manipResult.uri;
    } catch (error) {
      console.error("Error comprimiendo la imagen:", error);
      return uri;
    }
  };

  useEffect(() => {
    if (permissionResponse?.status === 'granted') {
      fetchImages(page);
    }
  }, [permissionResponse, page]);

  const handleSelectImage = async (uri) => {
    setUseCamera(false);
    setSelectedImage(uri);
  };

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
        setSelectedImage(null);
        setDescription("");
      } else {
        Alert.alert("Error", "Un error ocurrió mientras se subía el post.");
      }
    } catch (error) {
      console.error("Error subiendo el post:", error);
      Alert.alert("Error", "Un error ocurrió mientras se subía el post.");
    }
  };

  const handleUseCamera = () => {
    setUseCamera((prev) => !prev);
  }

  const handleFlipCamera = () => {
    setFacing((prev) => prev === 'back' ? 'front' : 'back');
  };

  useEffect(() => {
    requestCameraPermission();
    requestPermission();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => handleSubmit(selectedImage, description)}>
          <Text style={styles.buttonText}>Subir Post</Text>
        </Pressable>
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
