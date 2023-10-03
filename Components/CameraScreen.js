import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library'; 


export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photoData = await cameraRef.current.takePictureAsync();
        savePhotoToGallery(photoData.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const savePhotoToGallery = async (photoUri) => {
    if (photoUri) {
      try {
        const asset = await MediaLibrary.createAssetAsync(photoUri);
        await MediaLibrary.createAlbumAsync('MyPhotos', asset, false);
        alert('Photo saved to gallery!');
      } catch (error) {
        console.error('Error saving photo:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={cameraRef}
        onCameraReady={() => setIsCameraReady(true)}
      />
      <View style={styles.captureContainer}>
        <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
          <FontAwesome name="camera" size={36} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  camera: {
    flex: 1,
  },
  captureContainer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: 'blue',
    borderRadius: 50,
    padding: 20,
  },
  goBackButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  goBackText: {
    fontSize: 18,
    color: 'blue',
  },
});
