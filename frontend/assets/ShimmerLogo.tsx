import React, { useEffect, useRef } from "react";
import { View, Image, Animated, ImageSourcePropType, StyleProp, ImageStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface ShimmerLogoProps {
  loading: boolean;
  style: StyleProp<ImageStyle>;
  source: ImageSourcePropType;
}

export default function ShimmerLogo({ loading, style, source }: ShimmerLogoProps) {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      shimmerAnimation.stopAnimation();
      shimmerAnimation.setValue(0);
    }
  }, [loading, shimmerAnimation]);

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  const translateY = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <View style={[style, { overflow: 'hidden' }]}>
      <Image
        source={source}
        style={style}
        resizeMode="contain"
      />
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateX }, { translateY }],
        }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.4)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: '200%',
            height: '200%',
          }}
        />
      </Animated.View>
    </View>
  );
}
