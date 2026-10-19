import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { authApi } from "./services/api";

const { height } = Dimensions.get("window");
type Step = "REQUEST_OTP" | "VERIFY_OTP" | "RESET_PASSWORD" | "SUCCESS";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("REQUEST_OTP");
  const [mobile, setMobile] = useState("");
  const [maskedMobile, setMaskedMobile] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(45);
  const [isResendActive, setIsResendActive] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const otpRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    let interval: any = null;
    if (step === "VERIFY_OTP" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setIsResendActive(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  const handleSendOtp = async () => {
    const cleanDigits = mobile.replace(/\D/g, "");
    if (cleanDigits.length !== 10) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Enter a valid 10-digit mobile number." });
      return;
    }
    if (!/^[6-9]/.test(cleanDigits)) {
      Toast.show({ type: "error", text1: "Validation Error", text2: "Mobile number must start with 6, 7, 8, or 9." });
      return;
    }

    setLoading(true);
    const res = await authApi.forgotPassword(cleanDigits);
    setLoading(false);

    if (res.success) {
      setMaskedMobile(`******${cleanDigits.slice(-4)}`);
      setResendTimer(45);
      setIsResendActive(false);
      setOtpDigits(["", "", "", "", "", ""]);
      setStep("VERIFY_OTP");
      Toast.show({ type: "success", text1: "Code Sent", text2: res.message || "OTP sent to your phone." });
    } else {
      Toast.show({ type: "error", text1: "Failed", text2: res.message || "Could not send OTP." });
    }
  };

  const handleResendOtp = async () => {
    if (!isResendActive || loading) return;
    setLoading(true);
    const cleanDigits = mobile.replace(/\D/g, "");
    const res = await authApi.resendOtp(cleanDigits);
    setLoading(false);

    if (res.success) {
      setResendTimer(45);
      setIsResendActive(false);
      Toast.show({ type: "success", text1: "Code Sent", text2: "Fresh verification code sent." });
    } else {
      Toast.show({ type: "error", text1: "Resend Failed", text2: res.message });
    }
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "");
    const nextDigits = [...otpDigits];
    nextDigits[index] = clean.slice(-1);
    setOtpDigits(nextDigits);

    if (clean && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      Toast.show({ type: "error", text1: "Incomplete Code", text2: "Please enter all 6 digits." });
      return;
    }

    setLoading(true);
    const cleanDigits = mobile.replace(/\D/g, "");
    const res = await authApi.verifyOtp(cleanDigits, fullOtp);
    setLoading(false);

    if (res.success && res.data?.resetToken) {
      setResetToken(res.data.resetToken);
      setStep("RESET_PASSWORD");
      Toast.show({ type: "success", text1: "Verified", text2: "Set your new password." });
    } else {
      Toast.show({ type: "error", text1: "Verification Failed", text2: res.message || "Incorrect or expired OTP." });
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      Toast.show({ type: "error", text1: "Weak Password", text2: "Password must be at least 8 characters." });
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      Toast.show({ type: "error", text1: "Weak Password", text2: "Include at least one special character." });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({ type: "error", text1: "Mismatch", text2: "Passwords do not match." });
      return;
    }

    setLoading(true);
    const cleanDigits = mobile.replace(/\D/g, "");
    const res = await authApi.resetPassword({
      resetToken,
      mobile: cleanDigits,
      otp: otpDigits.join(""),
      newPassword,
      confirmPassword,
    });
    setLoading(false);

    if (res.success) {
      setStep("SUCCESS");
    } else {
      Toast.show({ type: "error", text1: "Reset Failed", text2: res.message || "Could not update password." });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f7f9fb" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* Top Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              if (step === "VERIFY_OTP") setStep("REQUEST_OTP");
              else if (step === "RESET_PASSWORD") setStep("VERIFY_OTP");
              else router.back();
            }}
          >
            <MaterialIcons name="arrow-back" size={24} color="#141779" />
          </TouchableOpacity>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {step === "REQUEST_OTP" && (
            <View style={styles.stepContainer}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="vpn-key" size={28} color="#141779" />
              </View>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                Enter your registered mobile number to receive a 6-digit verification code.
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <View style={styles.phoneInputRow}>
                  <Text style={styles.countryCode}>+91</Text>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="10-digit mobile number"
                    placeholderTextColor="#767683"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={mobile}
                    onChangeText={(t) => setMobile(t.replace(/\D/g, "").slice(0, 10))}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.disabledBtn]}
                onPress={handleSendOtp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {step === "VERIFY_OTP" && (
            <View style={styles.stepContainer}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="verified-user" size={28} color="#141779" />
              </View>
              <Text style={styles.title}>Verify Code</Text>
              <Text style={styles.subtitle}>
                Enter the 6-digit code sent to +91 {maskedMobile}.
              </Text>

              <View style={styles.otpRow}>
                {otpDigits.map((digit, i) => (
                  <TextInput
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    style={styles.otpBox}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(val) => handleOtpDigitChange(i, val)}
                  />
                ))}
              </View>

              <View style={styles.resendRow}>
                <Text style={styles.resendLabel}>Didn't receive code?</Text>
                {isResendActive ? (
                  <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
                    <Text style={styles.resendAction}>Resend OTP</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.timerText}>Resend in {resendTimer}s</Text>
                )}
              </View>

              <TouchableOpacity
                style={[styles.primaryBtn, (loading || otpDigits.join("").length !== 6) && styles.disabledBtn]}
                onPress={handleVerifyOtp}
                disabled={loading || otpDigits.join("").length !== 6}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Verify Code</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {step === "RESET_PASSWORD" && (
            <View style={styles.stepContainer}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="lock-reset" size={28} color="#141779" />
              </View>
              <Text style={styles.title}>Create New Password</Text>
              <Text style={styles.subtitle}>
                Choose a strong password with at least 8 characters and a special symbol.
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>New Password</Text>
                <View style={styles.passInputRow}>
                  <TextInput
                    style={styles.passInput}
                    placeholder="Enter new password"
                    placeholderTextColor="#767683"
                    secureTextEntry={!showPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={22} color="#767683" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm New Password</Text>
                <View style={styles.passInputRow}>
                  <TextInput
                    style={styles.passInput}
                    placeholder="Re-enter new password"
                    placeholderTextColor="#767683"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} size={22} color="#767683" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.disabledBtn]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Reset Password</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {step === "SUCCESS" && (
            <View style={styles.stepContainer}>
              <View style={[styles.iconCircle, { backgroundColor: "#d1fae5" }]}>
                <MaterialIcons name="check-circle" size={42} color="#059669" />
              </View>
              <Text style={styles.title}>Password Updated!</Text>
              <Text style={styles.subtitle}>
                Your password has been reset successfully. You can now log in with your new credentials.
              </Text>

              <TouchableOpacity
                style={[styles.primaryBtn, { marginTop: 24 }]}
                onPress={() => router.replace("/login")}
              >
                <Text style={styles.primaryBtnText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fb",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  topHeader: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  stepContainer: {
    alignItems: "center",
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#141779",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#767683",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#475569",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  phoneInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 14,
    height: 52,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#141779",
    marginRight: 10,
    borderRightWidth: 1,
    borderRightColor: "#cbd5e1",
    paddingRight: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
    color: "#141779",
  },
  passInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 14,
    height: 52,
  },
  passInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
    color: "#141779",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#141779",
  },
  resendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  resendLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  resendAction: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#141779",
  },
  timerText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#94a3b8",
  },
  primaryBtn: {
    width: "100%",
    height: 52,
    backgroundColor: "#141779",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#141779",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
