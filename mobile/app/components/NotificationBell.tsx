/**
 * NotificationBell.tsx
 * A reusable bell icon with unread badge that opens the notification drawer.
 * Pass role="parent" or role="child" to show appropriate notifications.
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  FlatList,
  Platform,
} from "react-native";
import {
  AppNotification,
  getNotifications,
  getUnreadCount,
  markAllRead,
  markRead,
  clearAll,
  subscribeToNotifications,
} from "../services/notifications";
import { useRouter } from "expo-router";

const C = {
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  onTertiary: "#ffffff",
  onSecondary: "#ffffff",
  onPrimary: "#ffffff",
  secondaryFixed: "#cce8e4",
  secondaryShadow: "#006a62",
  primaryFixed: "#e0e0ff",
  primaryShadow: "#141779",
  surfaceContainerHigh: "#f5f5f5",
  surfaceContainerHighest: "#e6e6e6",

  primary: "#141779",
  primaryContainer: "#e0e0ff",
  primaryFixedDim: "#c2e8ff",
  onPrimaryContainer: "#0a0c45",
  surface: "#f4efff",
  surfaceContainerLow: "#ffffff",
  surfaceContainerLowest: "#ffffff",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464652",
  secondary: "#006a62",
  secondaryContainer: "#d0f0ed",
  onSecondaryContainer: "#003733",
  tertiary: "#30007f",
  tertiaryContainer: "#e8ddff",
  onTertiaryContainer: "#1d0052",
  outline: "#827656",
  yellow50: "#f4efff",
  yellow100: "#e0e0ff",
  yellow200: "#c2e8ff",
  yellow900: "#141779",
};

const CATEGORY_COLORS: Record<string, string> = {
  test: "#e8f5e9",
  control: "#fff3e0",
  subscription: "#f3e5f5",
  exam: "#e3f2fd",
  streak: "#fff8e1",
  system: "#f5f5f5",
};

interface Props {
  role: "parent" | "child";
  tintColor?: string;
}

export default function NotificationBell({ role, tintColor }: Props) {
  const router = useRouter();
  const [unread, setUnread] = useState(0);
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);

  // Subscribe to store changes
  useEffect(() => {
    const refresh = () => {
      setUnread(getUnreadCount(role));
      setItems(getNotifications(role));
    };
    refresh();
    const unsub = subscribeToNotifications(refresh);
    return unsub;
  }, [role]);

  const open = () => {
    if (role === "parent") {
      router.push("/parent/notifications");
    } else {
      setVisible(true);
      setItems(getNotifications(role));
    }
  };

  const handleMarkAllRead = () => {
    markAllRead(role);
    setItems(getNotifications(role));
  };

  const handleClear = () => {
    clearAll(role);
    setItems([]);
    setVisible(false);
  };

  const handleRead = (id: string) => {
    markRead(id);
    setItems(getNotifications(role));
  };

  const timeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <>
      <TouchableOpacity onPress={open} style={styles.bellWrap} activeOpacity={0.7}>
        <Text style={[styles.bell, tintColor ? { color: tintColor } : {}]}>🔔</Text>
        {unread > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unread > 99 ? "99+" : unread}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <View style={styles.sheetContainer} onStartShouldSetResponder={() => true}>
            {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Notifications</Text>
              <Text style={styles.headerSub}>
                {unread > 0 ? `${unread} unread` : "All caught up!"}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Actions row */}
          {items.length > 0 && (
            <View style={styles.actionsRow}>
              <TouchableOpacity onPress={handleMarkAllRead} style={styles.acBtn}>
                <Text style={styles.acBtnText}>Mark all read</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClear} style={[styles.acBtn, { borderColor: "#ba1a1a" }]}>
                <Text style={[styles.acBtnText, { color: "#ba1a1a" }]}>Clear all</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* List */}
          {items.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 60, marginBottom: 16 }}>🔕</Text>
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptySub}>
                Activity updates will appear here for you.
              </Text>
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleRead(item.id)}
                  activeOpacity={0.8}
                  style={[
                    styles.notifCard,
                    { backgroundColor: item.read ? "#ffffff" : CATEGORY_COLORS[item.category] || "#fff" },
                    !item.read && styles.notifCardUnread,
                  ]}
                >
                  <View style={styles.notifLeft}>
                    <View style={[styles.emojiWrap, { backgroundColor: CATEGORY_COLORS[item.category] || "#eee" }]}>
                      <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
                    </View>
                  </View>
                  <View style={styles.notifBody}>
                    <View style={styles.notifTitleRow}>
                      <Text style={[styles.notifTitle, !item.read && { fontWeight: "900" }]} numberOfLines={1}>
                        {item.title}
                      </Text>
                      {!item.read && <View style={styles.dot} />}
                    </View>
                    <Text style={styles.notifMsg} numberOfLines={2}>{item.body}</Text>
                    <Text style={styles.notifTime}>{timeAgo(item.timestamp)}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bellWrap: { position: "relative", padding: 4 },
  bell: { fontSize: 24, color: C.primary },
  badge: {
    position: "absolute", top: -2, right: -4,
    backgroundColor: "#ba1a1a",
    borderRadius: 10, minWidth: 18, height: 18,
    alignItems: "center", justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5, borderColor: "#ffffff",
  },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "900" },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
    marginHorizontal: 8,
    marginBottom: 100, // keep it a little bit above the footer
  },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",
    padding: 20, backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 22, fontWeight: "900", color: C.primary },
  headerSub: { fontSize: 13, color: C.onSurfaceVariant, fontWeight: "600", marginTop: 2 },
  close: { fontSize: 22, color: C.onSurfaceVariant, fontWeight: "800" },

  actionsRow: {
    flexDirection: "row", gap: 10, paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#f5f5f5",
  },
  acBtn: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10,
    borderWidth: 1.5, borderColor: "#e0e0e0",
  },
  acBtnText: { fontSize: 12, fontWeight: "800", color: C.primary },

  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: C.onSurface, marginBottom: 8 },
  emptySub: { fontSize: 14, color: C.onSurfaceVariant, textAlign: "center", lineHeight: 21 },

  notifCard: {
    flexDirection: "row", borderRadius: 18, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: "transparent",
  },
  notifCardUnread: { borderColor: "#ebc23e" },
  notifLeft: { marginRight: 14, justifyContent: "flex-start" },
  emojiWrap: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  notifBody: { flex: 1 },
  notifTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  notifTitle: { flex: 1, fontSize: 15, fontWeight: "700", color: C.onSurface },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#ebc23e", marginLeft: 6 },
  notifMsg: { fontSize: 13, color: C.onSurfaceVariant, lineHeight: 19, fontWeight: "500" },
  notifTime: { fontSize: 11, color: "#aaa", fontWeight: "700", marginTop: 6 },
});
