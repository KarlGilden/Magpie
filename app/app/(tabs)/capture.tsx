import { Image } from 'expo-image';
import { Button, Platform, StyleSheet, ScrollView, View, Modal, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useState } from 'react';
import * as ImagePicker from "expo-image-picker";
import { WordCaptureResponse } from '@/types/capture';

export default function CapturePage() {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [apiData, setApiData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [language, setLanguage] = useState<string>('es');

  const pickImage = async (useCamera: boolean) => {
    // Ask for permissions
    const permissionResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission is required!");
      return;
    }

    // Launch camera or gallery with resizing
    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ 
          quality: 0.7, 
          base64: true,
          allowsEditing: true,
          aspect: [4, 3]
        })
      : await ImagePicker.launchImageLibraryAsync({ 
          quality: 0.7, 
          base64: true,
          allowsEditing: true,
          aspect: [4, 3]
        });

    if(result.canceled) return;

    const asset = result.assets[0];
    setImage(asset.uri);
    setIsLoading(true);
    setApiStatus('idle');

    try {
      // Send to API
      const formData = new FormData();
      formData.append("image", {
        uri: asset.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);

      const response = await fetch(`http://192.168.1.22:3000/api/capture?language=${language}`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response)
       if (response.ok) {
         const data = await response.json();
         setApiData(data);
         console.log(data);
         setApiStatus('success');
         setShowModal(true);
       } else {
        const data = await response?.json();
        console.error("API Error: ", response.status, data.error ?? response.statusText);
        setApiStatus('error');
      }
    } catch (error) {
      console.error("Network Error: ", error);
      setApiStatus('error');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <ThemedText
            type="title"
            style={styles.title}>
            Capture
          </ThemedText>
          
          <View style={styles.buttonContainer}>
            <Button title="Take Photo" onPress={() => pickImage(true)} />
            <Button title="Choose from Gallery" onPress={() => pickImage(false)} />
          </View>
          
          {/* Status Display */}
          {isLoading && (
            <View style={styles.statusContainer}>
              <IconSymbol name="arrow.triangle.2.circlepath" size={48} color="#007AFF" />
              <ThemedText style={styles.statusText}>Processing image...</ThemedText>
            </View>
          )}
          
          {!isLoading && apiStatus === 'success' && (
            <View style={styles.statusContainer}>
              <IconSymbol name="checkmark.circle.fill" size={48} color="#34C759" />
              <ThemedText style={styles.statusText}>Success!</ThemedText>
            </View>
          )}
          
          {!isLoading && apiStatus === 'error' && (
            <View style={styles.statusContainer}>
              <IconSymbol name="xmark.circle.fill" size={48} color="#FF3B30" />
              <ThemedText style={styles.statusText}>Failed to process</ThemedText>
            </View>
          )}
        </View>
        {/* Success Modal */}
        <Modal
          visible={showModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowModal(false)}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <ThemedText type="subtitle" style={styles.modalTitle}>
                    Words
                  </ThemedText>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowModal(false)}
                  >
                    <IconSymbol name="xmark" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.dataContainer}>
                  <Text style={styles.dataText}>
                    {apiData ? apiData.data : 'No data available'}
                  </Text>
                </ScrollView>
                
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.dismissButton}
                    onPress={() => setShowModal(false)}
                  >
                    <ThemedText style={styles.dismissButtonText}>Close</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </SafeAreaView>
          
        </Modal>
      </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.rounded,
    marginBottom: 30,
    marginTop: 20,
  },
  buttonContainer: {
    gap: 15,
    width: '100%',
    marginBottom: 30,
  },
  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  // Modal styles
  modalOverlay: {
    flex: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '100%',
    maxHeight: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    marginBottom: 20,
    flex: 1,
  },
  scrollContainer: {
    maxHeight: 250,
    flex: 1,
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  dataContainer: {
    backgroundColor: '#fff',
    borderColor: 'fff',
    minHeight: 100,
  },
  dataText: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
  },
  modalFooter: {
    alignItems: 'center',
    padding: 10
  },
  dismissButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  dismissButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  testText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
});
