import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export const compressImage = async (uri: string) => {
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


export const getLocalUri = async (id: string) => {
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
    return error;
  }
};
