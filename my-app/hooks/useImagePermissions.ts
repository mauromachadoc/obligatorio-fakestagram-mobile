import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';

import * as MediaLibrary from 'expo-media-library';

import {
  Text,
  Alert,
} from 'react-native';

import { compressImage, getLocalUri } from '@/helpers/imageHelper';

export const useImagePermissions = ({
  setUseCamera
}: {
  setUseCamera: Dispatch<SetStateAction<boolean>>
}) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [images, setImages] = useState([]);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const [page, setPage] = useState(1);

  const [permission, requestCameraPermission] = useCameraPermissions();

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

  const handleSelectImage = async (uri: string) => {
    setUseCamera(false);
    setSelectedImage(uri);
  };

  useEffect(() => {
    if (permissionResponse?.status === 'granted') {
      fetchImages();
    }

  }, [permissionResponse, page]);

  useEffect(() => {
    requestCameraPermission();
    requestPermission();
  }, []);

  return {
    images,
    handleSelectImage,
    setSelectedImage,
    page,
    setPage,
    selectedImage,
    fetchImages,
  };
};
