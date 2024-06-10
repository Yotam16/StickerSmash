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

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const imageStyle = useAnimatedStyle(() => {
        return {
        width: withSpring(scaleImage.value),
        height: withSpring(scaleImage.value),
        };
    });

    const drag = Gesture.Pan()
        .onChange((event) => {
        translateX.value += event.changeX;
        translateY.value += event.changeY;
    });

    const containerStyle = useAnimatedStyle(() => {
        return {
          transform: [
            {
              translateX: translateX.value,
            },
            {
              translateY: translateY.value,
            },
          ],
        };
      });
  
  
    return (
        <GestureDetector gesture={drag}>
            <Animated.View style={[containerStyle ,{ top: -175, right: '10%' }]}>
                <GestureDetector gesture={doubleTap}>
                    <Animated.Image
                        source={stickerSource}
                        resizeMode="contain"
                        style={[imageStyle, { width: imageSize, height: imageSize }]}
                    />
                </GestureDetector>
            </Animated.View>
        </GestureDetector>
  );
}
