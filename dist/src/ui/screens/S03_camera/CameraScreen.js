"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const expo_camera_1 = require("expo-camera");
const native_1 = require("@react-navigation/native");
const CameraScreen = () => {
    const [hasPermission, setHasPermission] = (0, react_1.useState)(null);
    const [cameraType, setCameraType] = (0, react_1.useState)(expo_camera_1.Camera.Constants.Type.back);
    const [flashMode, setFlashMode] = (0, react_1.useState)(expo_camera_1.Camera.Constants.FlashMode.off);
    const cameraRef = (0, react_1.useRef)(null);
    const navigation = (0, native_1.useNavigation)();
    react_1.default.useEffect(() => {
        (async () => {
            const { status } = await expo_camera_1.Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);
    const takePicture = async () => {
        try {
            if (cameraRef.current) {
                const photo = await cameraRef.current.takePictureAsync();
                processCapturedImage(photo.uri);
            }
        }
        catch (error) {
            react_native_1.Alert.alert('エラー', '画像の撮影に失敗しました。もう一度お試しください。');
        }
    };
    const processCapturedImage = (imageUri) => {
        navigation.navigate('PlantIdentification', { imageUri });
    };
    const switchCamera = () => {
        setCameraType(cameraType === expo_camera_1.Camera.Constants.Type.back
            ? expo_camera_1.Camera.Constants.Type.front
            : expo_camera_1.Camera.Constants.Type.back);
    };
    const toggleFlash = () => {
        setFlashMode(flashMode === expo_camera_1.Camera.Constants.FlashMode.off
            ? expo_camera_1.Camera.Constants.FlashMode.on
            : expo_camera_1.Camera.Constants.FlashMode.off);
    };
    const openGallery = async () => {
        try {
            // Note: This is a stub - would use expo-image-picker in actual implementation
            const imageUri = 'file:///mock/image/path.jpg';
            navigation.navigate('PlantIdentification', { imageUri });
        }
        catch (error) {
            react_native_1.Alert.alert('エラー', 'ギャラリーへのアクセスに失敗しました。');
        }
    };
    const requestCameraPermission = async () => {
        const { status } = await expo_camera_1.Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
    };
    if (hasPermission === null) {
        return <react_native_1.View style={styles.container}><react_native_1.Text>カメラへのアクセス権限を確認中...</react_native_1.Text></react_native_1.View>;
    }
    if (hasPermission === false) {
        return (<react_native_1.View style={styles.container}>
        <react_native_1.Text id="permission-message">カメラへのアクセスが許可されていません</react_native_1.Text>
        <react_native_1.TouchableOpacity style={styles.button} onPress={requestCameraPermission} id="request-permission-button">
          <react_native_1.Text style={styles.buttonText}>許可を求める</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>);
    }
    return (<react_native_1.View style={styles.container}>
      <expo_camera_1.Camera style={styles.camera} type={cameraType} flashMode={flashMode} ref={cameraRef} id="camera-view">
        <react_native_1.View style={styles.controlsContainer}>
          <react_native_1.TouchableOpacity style={styles.controlButton} onPress={toggleFlash} id="flash-toggle">
            <react_native_1.Image source={{
            uri: flashMode === expo_camera_1.Camera.Constants.FlashMode.on
                ? '../../../../assets/icons/flash_on.png'
                : '../../../../assets/icons/flash_off.png'
        }} style={styles.icon}/>
          </react_native_1.TouchableOpacity>
          
          <react_native_1.TouchableOpacity style={styles.controlButton} onPress={switchCamera} id="flip-camera">
            <react_native_1.Image source={{ uri: '../../../../assets/icons/flip_camera.png' }} style={styles.icon}/>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>

        <react_native_1.View style={styles.bottomContainer}>
          <react_native_1.TouchableOpacity style={styles.galleryButton} onPress={openGallery} id="gallery-button">
            <react_native_1.Image source={{ uri: '../../../../assets/icons/gallery.png' }} style={styles.galleryIcon}/>
          </react_native_1.TouchableOpacity>

          <react_native_1.TouchableOpacity style={styles.shutterButton} onPress={takePicture} id="shutter-button">
            <react_native_1.Image source={{ uri: '../../../../assets/icons/shutter.png' }} style={styles.shutterIcon}/>
          </react_native_1.TouchableOpacity>
          
          <react_native_1.View style={styles.placeholderButton}/>
        </react_native_1.View>
      </expo_camera_1.Camera>
    </react_native_1.View>);
};
const styles = react_native_1.StyleSheet.create({
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
exports.default = CameraScreen;
//# sourceMappingURL=CameraScreen.js.map