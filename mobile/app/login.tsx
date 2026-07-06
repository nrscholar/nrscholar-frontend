import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { authApi, saveToken } from "./services/api";

const { height } = Dimensions.get("window");
const TOP_SECTION_HEIGHT = height * 0.4; // 40% for top section

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "error") => {
    Toast.show({
      type: type,
      text1: type === "success" ? "Success!" : "Error",
      text2: message,
    });
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showToast("Please enter your email and password.");
      return;
    }
    try {
      setLoading(true);
      const res = await authApi.login(email.trim(), password);
      if (res.success && res.data) {
        await saveToken(res.data.token);
        showToast("Login Successful!", "success");
        router.replace("/(tabs)");
      } else {
        showToast(res.message || "Login failed. Please try again.", "error");
      }
    } catch (e) {
      showToast("Unable to connect. Is the server running?", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Top 40%: Vibrant Hero Image */}
      <View style={styles.topSection}>
        <Image 
          source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFNKwPrtS83UvIEkqBto7V5ys1m7JDMLjJjFqK1e7Gxjb_ZusQCLoBxC-zdESJR4p2l6cM0dfUm0HvIlji1k3L82ebKyONS4MPuuGm20GFeJq4vQheATDJ3v6ZMRdE34NrakAV89kRMzGdWInjI3o3cYRynpfTHp4nLjdgzQqOtllBc2p6kkd2WsVwQC7jWW_Cr_3HFWqCc8ZKmnhnNh9Jgpy6SGQ04yt44Oh093XOg1MpQtc7yDC1BV90cMzw2JtBk4Niv5xBYw" }}
          style={styles.heroImage}
        />
        <LinearGradient
          colors={["transparent", "rgba(247, 249, 251, 0.5)", "#f7f9fb"]}
          style={styles.gradientOverlay}
        />
        
        {/* Floating Cosmic Element */}
        <View style={styles.floatingElement}>
          <MaterialIcons name="rocket-launch" size={24} color="#141779" />
        </View>
      </View>

      {/* Bottom 60%: Login Card wrapped in KeyboardAvoidingView for responsiveness */}
      <KeyboardAvoidingView 
        style={styles.bottomSection}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Brand Identity */}
          <View style={styles.brandContainer}>
            <View style={styles.logoBox}>
              <MaterialIcons name="menu-book" size={32} color="#ffffff" />
            </View>
            <Text style={styles.titleText}>Studysaathy</Text>
            <Text style={styles.subtitleText}>Welcome back</Text>
          </View>

          {/* Login Fields */}
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="alternate-email" size={22} color="#767683" style={styles.inputIconLeft} />
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                placeholderTextColor="#767683"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="lock-outline" size={22} color="#767683" style={styles.inputIconLeft} />
                <TextInput
                  style={[styles.input, { paddingRight: 48 }]}
                  placeholder="Enter Password"
                  placeholderTextColor="#767683"
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
              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Action Area */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[styles.loginButton, loading && { opacity: 0.8 }]} 
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Login</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/signup-step1")}>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Visual Decorative Spacer */}
          <View style={styles.decorativeSpacer} />
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
  topSection: {
    height: TOP_SECTION_HEIGHT,
    width: "100%",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
  },
  floatingElement: {
    position: "absolute",
    top: 50,
    left: 24,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 50,
    padding: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -24,
    borderTopWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 20,
    overflow: "hidden",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  logoBox: {
    width: 64,
    height: 64,
    backgroundColor: "#141779",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#57fae9",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#141779",
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 16,
    color: "#767683",
    fontWeight: "500",
    marginTop: 4,
  },
  formContainer: {
    width: "100%",
    maxWidth: 340,
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 4,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  inputIconLeft: {
    position: "absolute",
    left: 16,
    zIndex: 1,
  },
  inputIconRight: {
    position: "absolute",
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  input: {
    width: "100%",
    height: 56,
    backgroundColor: "#eceef0",
    borderRadius: 9999,
    paddingLeft: 48,
    paddingRight: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#191c1e",
    borderWidth: 2,
    borderColor: "transparent",
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    paddingHorizontal: 8,
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#006a62",
  },
  actionContainer: {
    width: "100%",
    maxWidth: 340,
    gap: 16,
    marginBottom: 16,
  },
  loginButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#141779",
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#141779",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 16,
    color: "#767683",
    fontWeight: "500",
  },
  signupLink: {
    fontSize: 16,
    color: "#141779",
    fontWeight: "700",
  },
  decorativeSpacer: {
    width: 48,
    height: 4,
    backgroundColor: "#e0e3e5",
    borderRadius: 9999,
    marginTop: 8,
  },
});