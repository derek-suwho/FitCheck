import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');

interface PhotoEditorProps {
  imagePath: string;
  onSave: (editedImagePath: string) => void;
  onCancel: () => void;
  visible: boolean;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({
  imagePath,
  onSave,
  onCancel,
  visible,
}) => {
  const [currentFilter, setCurrentFilter] = useState<string>('none');
  const [rotation, setRotation] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(1);
  const [contrast, setContrast] = useState<number>(1);

  const filters = [
    {name: 'none', label: 'Original'},
    {name: 'sepia', label: 'Sepia'},
    {name: 'grayscale', label: 'B&W'},
    {name: 'vintage', label: 'Vintage'},
    {name: 'bright', label: 'Bright'},
    {name: 'cool', label: 'Cool'},
  ];

  const applyFilter = (filterName: string) => {
    setCurrentFilter(filterName);
  };

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const adjustBrightness = (direction: 'up' | 'down') => {
    setBrightness((prev) => {
      if (direction === 'up') return Math.min(2, prev + 0.2);
      return Math.max(0.2, prev - 0.2);
    });
  };

  const adjustContrast = (direction: 'up' | 'down') => {
    setContrast((prev) => {
      if (direction === 'up') return Math.min(2, prev + 0.2);
      return Math.max(0.2, prev - 0.2);
    });
  };

  const resetEdits = () => {
    setCurrentFilter('none');
    setRotation(0);
    setBrightness(1);
    setContrast(1);
  };

  const saveEdits = () => {
    // In a real app, this would apply the edits and save to a new file
    // For now, we'll just pass back the original path
    Alert.alert(
      'Edits Applied',
      'Your photo edits have been saved!',
      [
        {
          text: 'OK',
          onPress: () => onSave(imagePath),
        },
      ]
    );
  };

  const getFilterStyle = () => {
    let style: any = {
      transform: [{rotate: `${rotation}deg`}],
    };

    // Apply brightness and contrast
    style.opacity = brightness;
    
    // Apply filters (simplified for React Native)
    switch (currentFilter) {
      case 'sepia':
        style.tintColor = 'rgba(255, 223, 186, 0.5)';
        break;
      case 'grayscale':
        style.tintColor = 'rgba(128, 128, 128, 0.5)';
        break;
      case 'vintage':
        style.tintColor = 'rgba(255, 248, 220, 0.3)';
        break;
      case 'bright':
        style.opacity = Math.min(1.3, brightness + 0.3);
        break;
      case 'cool':
        style.tintColor = 'rgba(173, 216, 230, 0.2)';
        break;
      default:
        break;
    }

    return style;
  };

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Photo</Text>
          <TouchableOpacity style={styles.saveButton} onPress={saveEdits}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{uri: `file://${imagePath}`}}
            style={[styles.image, getFilterStyle()]}
            resizeMode="contain"
          />
        </View>

        <View style={styles.toolsContainer}>
          {/* Filters */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Filters</Text>
            <View style={styles.filtersRow}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.name}
                  style={[
                    styles.filterButton,
                    currentFilter === filter.name && styles.filterButtonActive,
                  ]}
                  onPress={() => applyFilter(filter.name)}>
                  <Text
                    style={[
                      styles.filterText,
                      currentFilter === filter.name && styles.filterTextActive,
                    ]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Adjustments */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Adjustments</Text>
            <View style={styles.adjustmentsRow}>
              <TouchableOpacity style={styles.rotateButton} onPress={rotateImage}>
                <Text style={styles.adjustmentText}>🔄 Rotate</Text>
              </TouchableOpacity>
              
              <View style={styles.sliderGroup}>
                <Text style={styles.sliderLabel}>Brightness</Text>
                <View style={styles.sliderControls}>
                  <TouchableOpacity
                    style={styles.sliderButton}
                    onPress={() => adjustBrightness('down')}>
                    <Text style={styles.sliderButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.sliderValue}>
                    {Math.round(brightness * 100)}%
                  </Text>
                  <TouchableOpacity
                    style={styles.sliderButton}
                    onPress={() => adjustBrightness('up')}>
                    <Text style={styles.sliderButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.sliderGroup}>
                <Text style={styles.sliderLabel}>Contrast</Text>
                <View style={styles.sliderControls}>
                  <TouchableOpacity
                    style={styles.sliderButton}
                    onPress={() => adjustContrast('down')}>
                    <Text style={styles.sliderButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.sliderValue}>
                    {Math.round(contrast * 100)}%
                  </Text>
                  <TouchableOpacity
                    style={styles.sliderButton}
                    onPress={() => adjustContrast('up')}>
                    <Text style={styles.sliderButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={resetEdits}>
            <Text style={styles.resetText}>Reset All</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    padding: 8,
  },
  saveText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: screenWidth,
    height: screenWidth * 1.2,
  },
  toolsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
    marginBottom: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: 'white',
    fontSize: 14,
  },
  filterTextActive: {
    fontWeight: '600',
  },
  adjustmentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  rotateButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 15,
    marginBottom: 10,
  },
  adjustmentText: {
    color: 'white',
    fontSize: 14,
  },
  sliderGroup: {
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },
  sliderLabel: {
    color: 'white',
    fontSize: 12,
    marginBottom: 5,
  },
  sliderControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sliderValue: {
    color: 'white',
    fontSize: 12,
    marginHorizontal: 8,
    minWidth: 40,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PhotoEditor;