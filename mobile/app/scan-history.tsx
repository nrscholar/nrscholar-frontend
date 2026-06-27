import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScanItem {
  id: number;
  title: string;
  emoji?: string;
  facts?: string[];
  date: string;
}

export default function ScanHistory() {
  const [history, setHistory] = useState<ScanItem[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyStr = await AsyncStorage.getItem('scanHistory');
      if (historyStr) {
        setHistory(JSON.parse(historyStr));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const clearHistory = async () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all scan history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('scanHistory');
              setHistory([]);
            } catch (e) {
              console.log(e);
            }
          },
        },
      ]
    );
  };

  const deleteItem = async (id: number) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    await AsyncStorage.setItem('scanHistory', JSON.stringify(updated));
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  const renderItem = ({ item }: { item: ScanItem }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.8}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
      >
        <View style={styles.itemHeader}>
          <View style={styles.itemEmojiWrap}>
            <Text style={styles.itemEmoji}>{item.emoji || '📸'}</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
          </View>
          <TouchableOpacity
            onPress={() => deleteItem(item.id)}
            style={styles.deleteBtn}
          >
            <Text style={styles.deleteTxt}>🗑️</Text>
          </TouchableOpacity>
        </View>

        {isExpanded && item.facts && (
          <View style={styles.factsWrap}>
            <Text style={styles.factsLabel}>📚 Saved Facts:</Text>
            {item.facts.map((fact, idx) => (
              <View key={idx} style={styles.factRow}>
                <Text style={styles.factBullet}>•</Text>
                <Text style={styles.factText}>{fact}</Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Scan History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory} style={styles.clearBtn}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stats bar */}
      {history.length > 0 && (
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{history.length}</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {new Set(history.map((h) => h.title)).size}
            </Text>
            <Text style={styles.statLabel}>Topics</Text>
          </View>
        </View>
      )}

      {/* List */}
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>🔬</Text>
            <Text style={styles.emptyTitle}>No Scans Yet</Text>
            <Text style={styles.emptyDesc}>
              Open the Scan & Learn camera and start scanning objects around you!
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/scan-and-learn' as any)}
            >
              <Text style={styles.emptyBtnText}>📸 Start Scanning</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfaee',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fffde7',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  backButton: {
    marginRight: 12,
  },
  backText: {
    fontSize: 16,
    color: '#735c00',
    fontWeight: '600',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#1b1c15',
  },
  clearBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#ffdad6',
    borderRadius: 12,
  },
  clearText: {
    color: '#ba1a1a',
    fontWeight: '700',
    fontSize: 12,
  },

  // Stats bar
  statsBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1b1c15',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },

  // List
  list: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  item: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemEmojiWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#fffde7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b1c15',
  },
  itemDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  deleteBtn: {
    padding: 8,
  },
  deleteTxt: {
    fontSize: 18,
  },

  // Expanded facts
  factsWrap: {
    marginTop: 14,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 14,
  },
  factsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#735c00',
    marginBottom: 10,
  },
  factRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingRight: 8,
  },
  factBullet: {
    fontSize: 14,
    color: '#735c00',
    marginRight: 8,
    fontWeight: '700',
  },
  factText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
  },

  // Empty state
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1b1c15',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyBtn: {
    backgroundColor: '#735c00',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 20,
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
