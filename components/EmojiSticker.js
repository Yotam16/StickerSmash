import { View, Image } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';


export default function EmojiSticker({ imageSize, stickerSource }) {

    const scaleImage = useSharedValue(imageSize);
    const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .onStart(() => {
    if (scaleImage.value !== imageSize * 1.5) {
      scaleImage.value = scaleImage.value * 1.5;
    } else { scaleImage.value = scaleImage.value * (2 / 3);}
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });
  
  
    return (
        <View style={{ top: -175, right: '10%' }}>
            <GestureDetector gesture={doubleTap}>
                <Animated.Image
                    source={stickerSource}
                    resizeMode="contain"
                    style={[imageStyle, { width: imageSize, height: imageSize }]}
                />
            </GestureDetector>
        </View>
  );
}
