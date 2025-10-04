import { Image } from 'expo-image';
import { Button, Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useState } from 'react';
import * as ImagePicker from "expo-image-picker";

export default function CapturePage() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async (useCamera: boolean) => {
    // Ask for permissions
    const permissionResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission is required!");
      return;
    }

    // Launch camera or gallery
    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ quality: 1, base64: true })
      : await ImagePicker.launchImageLibraryAsync({ quality: 1, base64: true });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImage(asset.uri);

      // Example: send to API
      const formData = new FormData();
      formData.append("image", {
        uri: asset.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);

      await fetch("http://localhost:3000/api/process-image", {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Capture
        </ThemedText>
        <Button title="Take Photo" onPress={() => pickImage(true)} />
        <Button title="Choose from Gallery" onPress={() => pickImage(false)} />
        {image && <Image source={{ uri: image }} style={styles.preview} />}
      </ThemedView>        
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  preview: { width: 200, height: 200, marginTop: 20 },
});
