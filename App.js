import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { useState, useRef } from 'react';

import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import CircleButton from './components/CircleButton';
import IconButton from './components/IconButton';
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';

export default function App() {

  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);

  const PlaceholderImage = require('./assets/images/background-image.png');

  const onReset = () => {
    setShowAppOptions(false);
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('You did not select any image.');
    }
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const [status, requestPermission] = MediaLibrary.usePermissions();

  if (status === null) {
    requestPermission();
  }

  const imageRef = useRef();

  const onSaveImageAsync = async () => {

    if (Platform.OS !== 'web') {
      
      try {
          const localUri = await captureRef(imageRef, {
            height: 440,
            quality: 1,
          });

          await MediaLibrary.saveToLibraryAsync(localUri);
          if (localUri) {
            alert("Saved to "+ localUri);
          }
        } catch (e) {
          console.log(e);
        }} else {
          try {
            const dataUrl = await domtoimage.toJpeg(imageRef.current, {
              quality: 0.95,
              width: 320,
              height: 440,
            });
      
            let link = document.createElement('a');
            link.download = 'sticker-smash.jpeg';
            link.href = dataUrl;
            link.click();
          } catch (e) {
            console.log(e);
          }
        }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}> 
          <ImageViewer
            placeholderImageSource={PlaceholderImage}
            selectedImage={selectedImage}
          />
          {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
        </View>
      </View>
      {showAppOptions ? (
                <View style={styles.optionsContainer}>
                <View style={styles.optionsRow}>
                  <IconButton icon="refresh" label="Reset" onPress={onReset} />
                  <CircleButton onPress={onAddSticker} />
                  <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
                </View>
              </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>
      )}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} /> 
        </EmojiPicker>
      <StatusBar style="dark" />
      </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  button: {
    marginVertical: 10,
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
