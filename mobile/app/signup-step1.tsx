import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function SignupStep1Screen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");

  const handleNext = () => {
    router.push({
      pathname: "/signup-step2",
      params: { fullName, mobile },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Cosmic Background Gradient */}
      <LinearGradient
        colors={["#e0e0ff", "#f7f9fb"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      />
      <View style={styles.starPatternOverlay} pointerEvents="none" />

      {/* Header (TopAppBar) */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="rocket-launch" size={28} color="#141779" />
          <Text style={styles.headerTitle}>NR Scholar</Text>
        </View>
        {/* Close/Back button for focused task */}
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialIcons name="close" size={24} color="#767683" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Step Indicator (Orbit Progress style) */}
          <View style={styles.stepIndicatorContainer}>
            <View style={styles.stepTextRow}>
              <Text style={styles.stepLabel}>STEP 1 OF 3</Text>
              <Text style={styles.stepPercent}>33%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '33%' }]} />
            </View>
          </View>

          {/* Glass Content Card */}
          <View style={styles.glassCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Join the Mission</Text>
              <Text style={styles.cardSubtitle}>Let's set up your parent account to guide your explorer.</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Parent Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Sarah Johnson"
                    placeholderTextColor="#c7c5d4"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                  <MaterialIcons name="person" size={22} color="#c7c5d4" style={styles.inputIcon} />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 9876543210"
                    placeholderTextColor="#c7c5d4"
                    value={mobile}
                    onChangeText={setMobile}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                  />
                  <MaterialIcons name="phone" size={22} color="#c7c5d4" style={styles.inputIcon} />
                </View>
              </View>
            </View>

            {/* Primary Action */}
            <TouchableOpacity 
              style={[styles.nextButton, (!fullName || !mobile) && { opacity: 0.7 }]}
              onPress={handleNext}
              disabled={!fullName || !mobile}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>Next Step</Text>
              <MaterialIcons name="rocket" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Footnote */}
          <Text style={styles.footnote}>
            By continuing, you agree to our interstellar terms and conditions.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fb",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  starPatternOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 50,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#141779',
    letterSpacing: -0.5,
  },
  closeButton: {
    padding: 8,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  stepIndicatorContainer: {
    width: '100%',
    maxWidth: 430,
    marginBottom: 32,
  },
  stepTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006a62',
    letterSpacing: 1,
  },
  stepPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#767683',
  },
  progressTrack: {
    height: 8,
    width: '100%',
    backgroundColor: '#eceef0',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#57fae9',
    borderRadius: 9999,
  },
  glassCard: {
    width: '100%',
    maxWidth: 430,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#141779',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#464652',
    fontWeight: '500',
    textAlign: 'center',
  },
  formSection: {
    gap: 20,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#767683',
    marginLeft: 4,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    right: 20,
    zIndex: 1,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 9999,
    paddingLeft: 24,
    paddingRight: 56,
    fontSize: 16,
    fontWeight: '500',
    color: '#191c1e',
    borderWidth: 1,
    borderColor: '#c7c5d4',
  },
  illustrationContainer: {
    width: '100%',
    height: 128,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 24,
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.8,
  },
  illustrationGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  nextButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#141779',
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#141779',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  footnote: {
    marginTop: 32,
    fontSize: 12,
    fontWeight: '700',
    color: '#c7c5d4',
    textAlign: 'center',
    maxWidth: 300,
  }
});