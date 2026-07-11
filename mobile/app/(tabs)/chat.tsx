import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authApi, apiRequest } from "../services/api";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";

// ── Color tokens from Tailwind config ─────────────────────────────────────────
const C = {
  surface: "#f7f9fb",
  onSurface: "#191c1e",
  primary: "#141779",
  primaryFixedDim: "#bfc2ff",
  primaryContainer: "#2d328f",
  secondary: "#006a62",
  secondaryContainer: "#57fae9",
  onSecondaryContainer: "#007168",
  onSurfaceVariant: "#464652",
  outlineVariant: "#c7c5d4",
  white: "#ffffff",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.4)",
};

// ── Types ─────────────────────────────────────────────────────────────────────
type Message = {
  id: string;
  role: "ai" | "user";
  text: string;
  image?: string;
};

// ── Initial messages ──────────────────────────────────────────────────────────
const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "ai",
    text: "Hello Explorer! I'm Saathy, your learning guide. Ready to discover something new in the cosmos today?",
  },
  {
    id: "2",
    role: "user",
    text: "Can you help me understand how black holes work?",
  },
  {
    id: "3",
    role: "ai",
    text: "Great question! Think of a black hole like a cosmic vacuum cleaner with infinite power. Here's a look at one:\n\nNothing, not even light, can escape it! 🌌",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVAgNd_cTSl56KCFiHwrwHqEQRcO6tGMF09vih5dHm0-eEAxzfgWsdBmLofUdrO4BvNBcESoTnk3Q0JnIy0QWd5UoGUi9j89EDyyIec6oKxuw4tOMNr6VvpEuuG0WpCgMMRug-QfUauVWGPD8331mNsZXE_NgfQY6RUS6_FJRIcOUUi9JWX7AqN2hDl49HUMCS8Nslczuc0IFPVBJDHkvmzIXe7xwlqeXjHaJ0Fw9rLRcUcd9-pRz8W9QId6_VaT7RbyJlR3t7uw",
  },
];

// ── Quick Replies ─────────────────────────────────────────────────────────────
const QUICK_REPLIES = [
  "🚀 How do they form?",
  "✨ Show more pics",
  "🔭 Who found them?",
];

// ── AI Message Bubble ─────────────────────────────────────────────────────────
function AIBubble({ msg }: { msg: Message }) {
  const parts = msg.text.split("\n\n");
  
  return (
    <View style={styles.messageRowIn}>
      <View style={[styles.avatarIcon, styles.cosmicGlow, { backgroundColor: C.secondaryContainer }]}>
        <MaterialIcons name="auto-awesome" size={16} color={C.onSecondaryContainer} />
      </View>
      <View style={[styles.glassCard, styles.bubbleIn]}>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {index > 0 && msg.image && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: msg.image }} style={styles.messageImage} />
              </View>
            )}
            <Text style={styles.bubbleTextIn}>{part}</Text>
          </React.Fragment>
        ))}
        {parts.length === 1 && msg.image && (
          <View style={[styles.imageContainer, { marginTop: 12 }]}>
             <Image source={{ uri: msg.image }} style={styles.messageImage} />
          </View>
        )}
      </View>
    </View>
  );
}

// ── User Message Bubble ───────────────────────────────────────────────────────
function UserBubble({ msg }: { msg: Message }) {
  return (
    <View style={styles.messageRowOut}>
      <View style={[styles.avatarIcon, { backgroundColor: C.primaryContainer }]}>
        <MaterialIcons name="person" size={16} color={C.white} />
      </View>
      <View style={styles.bubbleOut}>
        <Text style={styles.bubbleTextOut}>{msg.text}</Text>
      </View>
    </View>
  );
}

// ── Typing Indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnim = (anim: Animated.Value, delay: number) => {
      return Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
            Animated.delay(400)
          ])
        )
      ]);
    };
    Animated.parallel([
      createAnim(anim1, 0),
      createAnim(anim2, 150),
      createAnim(anim3, 300)
    ]).start();
  }, []);

  const getTranslateY = (anim: Animated.Value) => anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5]
  });

  return (
    <View style={[styles.messageRowIn, { opacity: 0.7 }]}>
      <View style={[styles.avatarIcon, { backgroundColor: C.secondaryContainer }]}>
        <MaterialIcons name="auto-awesome" size={16} color={C.onSecondaryContainer} />
      </View>
      <View style={styles.typingContainer}>
        <Animated.View style={[styles.typingDot, { transform: [{ translateY: getTranslateY(anim1) }] }]} />
        <Animated.View style={[styles.typingDot, { transform: [{ translateY: getTranslateY(anim2) }] }]} />
        <Animated.View style={[styles.typingDot, { transform: [{ translateY: getTranslateY(anim3) }] }]} />
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  const [blocked, setBlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const res = await authApi.getMe();
      if (res.success && res.data?.parentControls?.allowChat === false) {
        setBlocked(true);
      }
    } catch (e) {
      // allow access on error
    } finally {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <View style={{ flex: 1, backgroundColor: C.surface, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  if (blocked) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.surface, alignItems: "center", justifyContent: "center", padding: 40 }}>
        <Text style={{ fontSize: 64, marginBottom: 20 }}>🔒</Text>
        <Text style={{ color: C.onSurface, fontSize: 22, fontWeight: "800", textAlign: "center", marginBottom: 12 }}>
          AI Chat Disabled
        </Text>
        <Text style={{ color: C.onSurfaceVariant, fontSize: 15, textAlign: "center", lineHeight: 22 }}>
          Your parent has disabled the AI chat. Ask them to enable it from the Parent Control Center.
        </Text>
      </SafeAreaView>
    );
  }

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const chatHistory = messages.map(m => ({ role: m.role, text: m.text })).concat({ role: "user", text });
      const res = await apiRequest("/api/scan/chat", {
        method: "POST",
        body: { messages: chatHistory },
      });
      if (res.success && res.message) {
        const aiReply: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: res.message,
        };
        setIsTyping(false);
        setMessages((prev) => [...prev, aiReply]);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
      } else {
        // Fallback for demo if API fails
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: "ai",
            text: "That's a very curious question! Let's explore that together. ✨"
          }]);
          setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
        }, 1500);
      }
    } catch (e) {
      console.log(e);
      // Fallback on error
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: "That's a very curious question! Let's explore that together. ✨"
        }]);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
      }, 1500);
    }
  };

  return (
    <View style={styles.container}>
      {/* ── Top AppBar ── */}
      <BlurView intensity={80} tint="light" style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.headerLeft} activeOpacity={0.7} onPress={() => router.push("/profile")}>
            <View style={styles.headerAvatarContainer}>
              <Image
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqzZgKYqkAFvG1duOpGq-qgFWHO1DbEeOPWvesdsngc_j-_EF3XW414Dw5lkQGx3OgT6vwuTPpx1AxS8j7wttjRXRmYzdNJa3A-wAJk6WAQF0nzjFs8sprRCjUTgIsy5Q7fI_RSFoZTBBfyYDmM9uWVPCPKuVvTcmzatUW1k8LDumDgYsJsAAa5gid0w8V2ugKrU7W2fOLth7ZzeE4VbEFWvD_IKJ_d7SOx773lqHSS52YQlHYGdixtpMMnnCOXDMBEdUjRCgdQQ" }}
                style={styles.headerAvatar}
              />
            </View>
            <Text style={styles.headerTitle}>NR Scholar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push("/notifications")}>
            <MaterialIcons name="notifications" size={24} color={C.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
      </BlurView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* ── Chat Canvas ── */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.chatScroll,
            { paddingTop: insets.top + 64 + 24, paddingBottom: 24 },
          ]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: false })
          }
        >
          {messages.map((msg) =>
            msg.role === "ai" ? (
              <AIBubble key={msg.id} msg={msg} />
            ) : (
              <UserBubble key={msg.id} msg={msg} />
            )
          )}
          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* ── Input Area ── */}
        <View style={[styles.bottomContainer, { paddingBottom: Platform.OS === 'ios' ? insets.bottom + 85 : 90 }]}>
          {/* Quick Replies */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.quickRepliesScroll}
            style={styles.quickRepliesContainer}
          >
            {QUICK_REPLIES.map((reply, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickReplyChip}
                onPress={() => handleSend(reply)}
              >
                <Text style={styles.quickReplyText}>{reply}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Input Box */}
          <View style={styles.inputGlassCard}>
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialIcons name="add-circle" size={24} color={C.onSurfaceVariant} />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Ask Saathy anything..."
              placeholderTextColor={C.onSurfaceVariant}
              value={input}
              onChangeText={setInput}
              multiline={false}
              returnKeyType="send"
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
              <MaterialIcons name="send" size={20} color={C.white} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.surface,
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 50,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.4)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 64,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: C.secondaryContainer,
    overflow: 'hidden',
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: C.primary,
  },
  notificationBtn: {
    padding: 4,
  },
  chatScroll: {
    paddingHorizontal: 24,
    gap: 24,
  },
  messageRowIn: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 24,
  },
  messageRowOut: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 24,
  },
  avatarIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cosmicGlow: {
    shadowColor: 'rgba(87, 250, 233, 0.5)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  glassCard: {
    backgroundColor: C.glassBg,
    borderColor: C.glassBorder,
    borderWidth: 1.5,
  },
  bubbleIn: {
    padding: 16,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    maxWidth: '85%',
  },
  bubbleOut: {
    backgroundColor: C.primaryContainer,
    padding: 16,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleTextIn: {
    fontSize: 16,
    fontWeight: '500',
    color: C.onSurface,
    lineHeight: 24,
  },
  bubbleTextOut: {
    fontSize: 16,
    fontWeight: '500',
    color: C.white,
    lineHeight: 24,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 12,
  },
  messageImage: {
    width: '100%',
    height: 128,
    resizeMode: 'cover',
  },
  bottomContainer: {
    width: '100%',
    paddingHorizontal: 24,
    gap: 16,
    zIndex: 40,
    backgroundColor: 'transparent',
  },
  quickRepliesContainer: {
    flexGrow: 0,
  },
  quickRepliesScroll: {
    gap: 8,
    paddingBottom: 8,
  },
  quickReplyChip: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.outlineVariant,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickReplyText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.secondary,
  },
  inputGlassCard: {
    backgroundColor: C.glassBg,
    borderColor: 'rgba(191, 194, 255, 0.3)', // primary-fixed-dim/30
    borderWidth: 1.5,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: C.onSurface,
    height: 40,
  },
  sendBtn: {
    width: 40,
    height: 40,
    backgroundColor: C.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 16,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.secondary,
  }
});
