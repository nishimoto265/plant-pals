import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        processCapturedImage(photo.uri);
      }
    } catch (error) {
      Alert.alert('エラー', '画像の撮影に失敗しました。もう一度お試しください。');
    }
  };

  const processCapturedImage = (imageUri) => {
    navigation.navigate('PlantIdentification', { imageUri });
  };

  const switchCamera = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const toggleFlash = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };

  const openGallery = async () => {
    try {
      // Note: This is a stub - would use expo-image-picker in actual implementation
      const imageUri = 'file:///mock/image/path.jpg';
      navigation.navigate('PlantIdentification', { imageUri });
    } catch (error) {
      Alert.alert('エラー', 'ギャラリーへのアクセスに失敗しました。');
    }
  };

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>カメラへのアクセス権限を確認中...</Text></View>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text id="permission-message">カメラへのアクセスが許可されていません</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={requestCameraPermission}
          id="request-permission-button"
        >
          <Text style={styles.buttonText}>許可を求める</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera 
        style={styles.camera} 
        type={cameraType}
        flashMode={flashMode}
        ref={cameraRef}
        id="camera-view"
      >
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={toggleFlash}
            id="flash-toggle"
          >
            <Image 
              source={{
                uri: flashMode === Camera.Constants.FlashMode.on
                  ? '../../../../assets/icons/flash_on.png' 
                  : '../../../../assets/icons/flash_off.png'
              }}
              style={styles.icon}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={switchCamera}
            id="flip-camera"
          >
            <Image 
              source={{uri: '../../../../assets/icons/flip_camera.png'}}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.galleryButton}
            onPress={openGallery}
            id="gallery-button"
          >
            <Image 
              source={{uri: '../../../../assets/icons/gallery.png'}}
              style={styles.galleryIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.shutterButton} 
            onPress={takePicture}
            id="shutter-button"
          >
            <Image 
              source={{uri: '../../../../assets/icons/shutter.png'}}
              style={styles.shutterIcon}
            />
          </TouchableOpacity>
          
          <View style={styles.placeholderButton} />
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  controlsContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'column',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderButton: {
    width: 50,
    height: 50,
  },
  icon: {
    width: 30,
    height: 30,
  },
  galleryIcon: {
    width: 25,
    height: 25,
  },
  shutterIcon: {
    width: 40,
    height: 40,
  },
  button: {
    backgroundColor: '#2C6E49',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CameraScreen; 