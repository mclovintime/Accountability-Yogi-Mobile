import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { techYogi } from '../assets/assets';
import WavyPattern from '/home/halincandenza/personalProjects/realReactTestrun/components/WavyPattern.tsx';
import * as Font from 'expo-font';

type IntroScreenProps = {
  onAnimationComplete: () => void;
};

const IntroScreen: React.FC<IntroScreenProps> = ({ onAnimationComplete }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const loadingOpacity = useRef(new Animated.Value(1)).current;

  const [fontLoaded, setFontLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'GreatVibes-Regular': require('/home/halincandenza/personalProjects/realReactTestrun/assets/fonts/GreatVibes-Regular.ttf'),
        });
        setFontLoaded(true);
        setLoading(false);
      } catch (error) {
        console.error('Error loading font: ', error);
      }
    };
  
    loadFonts();
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.timing(loadingOpacity, {
        toValue: 0,
        duration: 2500, // 2.5 seconds
        useNativeDriver: true,
      }).start(() => {
        // Start fade-in animation after loading wheel has faded out
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(translateY, {
            toValue: -1000,
            duration: 2000,
            useNativeDriver: true,
            delay: 2500,
          }).start(onAnimationComplete);
        });
      });
    }
  }, [loading, loadingOpacity, fadeAnim, translateY, onAnimationComplete]);

  
  useEffect(() => {
    if (!loading) {
      const loopAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -20,
            duration: 2100,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2100,
            useNativeDriver: true,
          }),
        ]),
        {
          iterations: -1,
        },
      );
  
      loopAnimation.start();
    }
  }, [loading, floatAnim]);
 

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.loadingContainer,
          { opacity: loadingOpacity },
        ]}
      >
        <ActivityIndicator
          size="large"
          color="grey"
          style={{ transform: [{ scale: 1.3 }] }}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.contentContainer,
          { transform: [{ translateY }], opacity: fadeAnim },
        ]}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            { transform: [{ translateY: floatAnim }] },
          ]}
        >
          <Image source={techYogi} style={styles.logo} />
        </Animated.View>
        {
  fontLoaded && (
    <Text style={styles.appName}>Accountability Yogi</Text>
  )
}
        <View style={styles.wavyPatternContainer}>
          <WavyPattern />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e6e6', // Set the background color to the same light grey as the SVG
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5', // Set the background color to the same light grey as the SVG
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: -100, // Move the logo and title higher on the screen
  },
  logo: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 55, // Make the title 35% larger
    fontWeight: 'bold',
    marginTop: -70, // Move the title closer to the bottom of the logo
    fontFamily: 'GreatVibes-Regular',
  },
  wavyPatternContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

export default IntroScreen;