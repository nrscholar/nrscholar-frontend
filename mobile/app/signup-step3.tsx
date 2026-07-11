import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import { authApi, saveToken } from "./services/api";

export default function SignupStep3Screen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);

  const isMinLength = password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const showToast = (message: string, type: 'success' | 'error' = 'error') => {
    Toast.show({
      type: type,
      text1: type === 'success' ? 'Success!' : 'Error',
      text2: message,
    });
  };

  const handleSignup = async () => {
    if (!isMinLength || !hasSpecialChar) {
      showToast("Please meet all password requirements");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Passwords do not match");
      return;
    }

    const { fullName, email, childName, age, selectedClass } = params;

    const finalData = {
      fullName: String(fullName),
      email: String(email),
      password,
      childName: childName ? String(childName) : undefined,
      childAge: age ? Number(age) : undefined,
      childClass: selectedClass ? String(selectedClass) : undefined,
    };

    try {
      setLoading(true);
      const res = await authApi.signup(finalData);

      if (res.success && res.data) {
        await saveToken(res.data.token);
        showToast("Signup Successful!", "success");
        router.replace("/(tabs)");
      } else {
        showToast(res.message || "Signup failed. Please try again.", "error");
      }
    } catch (e) {
      showToast("Unable to connect. Is the server running?", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Cosmic Background Gradient */}
      <LinearGradient
        colors={["#e0e0ff", "#f7f9fb", "#f7f9fb"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      />

      {/* Blurred decorative blobs (approximated with View & opacity) */}
      <View style={[styles.blob, styles.blobBottomLeft]} />
      <View style={[styles.blob, styles.blobTopRight]} />

      {/* Header (TopAppBar) */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="rocket-launch" size={28} color="#141779" />
          <Text style={styles.headerTitle}>NR Scholar</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileIcon}
          onPress={() => router.back()} // Fallback to go back if needed
        >
          <MaterialIcons name="person" size={24} color="#141779" />
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
          {/* Step Indicator */}
          <View style={styles.stepIndicatorContainer}>
            <View style={styles.stepTextRow}>
              <Text style={styles.stepLabel}>STEP 3 OF 3</Text>
              <Text style={styles.stepPercent}>100%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
          </View>

          <View style={styles.titlesContainer}>
            <Text style={styles.mainTitle}>Secure Your Cockpit</Text>
            <Text style={styles.subTitle}>Set your access codes for the cosmic journey ahead.</Text>
          </View>

          {/* Glass Form Card */}
          <View style={styles.glassCard}>
            
            <View style={styles.formSection}>
              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CREATE PASSWORD</Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="lock" size={22} color="#767683" style={styles.inputIconLeft} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#c7c5d4"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity 
                    style={styles.inputIconRight}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={22} color="#767683" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="shield" size={22} color="#767683" style={styles.inputIconLeft} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#c7c5d4"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity 
                    style={styles.inputIconRight}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} size={22} color="#767683" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Password Validation Rules */}
            <View style={styles.validationSection}>
              <View style={styles.validationRow}>
                <MaterialIcons 
                  name={isMinLength ? "check-circle" : "radio-button-unchecked"} 
                  size={20} 
                  color={isMinLength ? "#007168" : "#c7c5d4"} 
                />
                <Text style={styles.validationText}>At least 8 characters</Text>
              </View>
              <View style={styles.validationRow}>
                <MaterialIcons 
                  name={hasSpecialChar ? "check-circle" : "radio-button-unchecked"} 
                  size={20} 
                  color={hasSpecialChar ? "#007168" : "#c7c5d4"} 
                />
                <Text style={styles.validationText}>Include a special symbol</Text>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[
                styles.submitButton, 
                (!isMinLength || !hasSpecialChar || !confirmPassword || loading) && { opacity: 0.7 }
              ]}
              onPress={handleSignup}
              disabled={!isMinLength || !hasSpecialChar || !confirmPassword || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Ready for Liftoff!</Text>
                  <MaterialIcons name="rocket" size={22} color="#ffffff" />
                </>
              )}
            </TouchableOpacity>
          </View>

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
  blob: {
    position: 'absolute',
    borderRadius: 9999,
  },
  blobBottomLeft: {
    width: 250,
    height: 250,
    backgroundColor: 'rgba(87, 250, 233, 0.1)',
    bottom: -80,
    left: -80,
  },
  blobTopRight: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(191, 194, 255, 0.2)',
    top: 160,
    right: -80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: 'rgba(247, 249, 251, 0.8)',
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
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0ff',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 48,
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
    color: '#141779',
    letterSpacing: 1,
  },
  stepPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#141779',
  },
  progressTrack: {
    height: 8,
    width: '100%',
    backgroundColor: '#e0e3e5',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#57fae9',
    borderRadius: 9999,
  },
  titlesContainer: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    maxWidth: 430,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#141779',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    color: '#464652',
    fontWeight: '500',
    textAlign: 'center',
  },
  glassCard: {
    width: '100%',
    maxWidth: 430,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  formSection: {
    gap: 20,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#464652',
    marginLeft: 12,
    letterSpacing: 1,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIconLeft: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  inputIconRight: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 9999,
    paddingLeft: 48,
    paddingRight: 48,
    fontSize: 16,
    fontWeight: '500',
    color: '#191c1e',
    borderWidth: 1.5,
    borderColor: '#c7c5d4',
  },
  validationSection: {
    gap: 12,
  },
  validationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  validationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#464652',
  },
  actionContainer: {
    width: '100%',
    maxWidth: 430,
    marginTop: 24,
  },
  submitButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#141779',
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#141779',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  }
});