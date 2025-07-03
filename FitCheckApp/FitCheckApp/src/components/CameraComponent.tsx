import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

interface CameraComponentProps {
  onPhotoTaken: (photoPath: string) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({onPhotoTaken}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const permission = await Camera.getCameraPermissionStatus();
      if (permission === 'granted') {
        setHasPermission(true);
        setIsLoading(false);
      } else {
        const newPermission = await Camera.requestCameraPermission();
        setHasPermission(newPermission === 'granted');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Permission error:', error);
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');
      
      const photo = await camera.current.takePhoto({});
      
      onPhotoTaken(photo.path);
    } catch (error) {
      console.error('Failed to take photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Camera...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission is required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={checkCameraPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        photo={true}
      />
      
      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <Text style={styles.instruction}>Stand in full length mirror</Text>
        </View>
        
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: 'white',
    marginTop: 20,
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  instruction: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bottomBar: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});

export default CameraComponent;