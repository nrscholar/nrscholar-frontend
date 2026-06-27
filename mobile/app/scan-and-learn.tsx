/**
 * Scan & Learn — uses expo-image-picker to open camera,
 * sends photo to Gemini Vision API via backend, shows educational facts.
 *
 * If the native module isn't available (old dev client), falls back to
 * a text-based input so the screen never crashes.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  NativeModules,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scanApi } from './services/api';

const { width: SW } = Dimensions.get('window');

// Detect if native camera is available in current build
const CAMERA_AVAILABLE = !!NativeModules.ExponentImagePicker;

// ── Subject colors ─────────────────────────────────────────────────────────
const COLORS: Record<string, { color: string; bg: string }> = {
  Physics:           { color: '#4a148c', bg: '#f3e5f5' },
  Chemistry:         { color: '#e65100', bg: '#fff3e0' },
  Biology:           { color: '#1b5e20', bg: '#e8f5e9' },
  Math:              { color: '#0d47a1', bg: '#e3f2fd' },
  Geography:         { color: '#004d40', bg: '#e0f2f1' },
  History:           { color: '#4e342e', bg: '#efebe9' },
  Astronomy:         { color: '#1a237e', bg: '#e8eaf6' },
  'General Science': { color: '#00695c', bg: '#e0f2f1' },
};
const getColors = (tag: string) => COLORS[tag] || { color: '#735c00', bg: '#fffde7' };

// ── Quick topic chips (text fallback) ────────────────────────────────────────
const CHIPS = [
  { emoji: '🌞', label: 'Sun',        topic: 'The Sun' },
  { emoji: '🧬', label: 'DNA',        topic: 'DNA and genetics' },
  { emoji: '⚡', label: 'Electricity',topic: 'Electricity' },
  { emoji: '🍎', label: 'Gravity',    topic: 'Gravity' },
  { emoji: '🌊', label: 'Waves',      topic: 'Sound waves' },
  { emoji: '🦋', label: 'Metamorph.', topic: 'Butterfly metamorphosis' },
  { emoji: '⚗️', label: 'Acids',      topic: 'Acids and bases' },
  { emoji: '🪐', label: 'Saturn',     topic: 'Planet Saturn' },
];

// ── Scanning animation ───────────────────────────────────────────────────────
const ScanAnimation = ({ label }: { label: string }) => {
  const pulse = useRef(new Animated.Value(1)).current;
  const lineY  = useRef(new Animated.Value(0)).current;
  const fade   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.18, duration: 700, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1,    duration: 700, useNativeDriver: true }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.timing(lineY, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.timing(lineY, { toValue: 0, duration: 1200, useNativeDriver: true }),
    ])).start();
  }, []);

  const ty = lineY.interpolate({ inputRange: [0, 1], outputRange: [0, 170] });

  return (
    <Animated.View style={[aStyles.wrap, { opacity: fade }]}>
      <Animated.View style={[aStyles.ring, { transform: [{ scale: pulse }] }]}>
        <View style={aStyles.inner}>
          <Text style={aStyles.rEmoji}>🔬</Text>
        </View>
      </Animated.View>
      <View style={aStyles.box}>
        <View style={[aStyles.c, aStyles.TL]} /><View style={[aStyles.c, aStyles.TR]} />
        <View style={[aStyles.c, aStyles.BL]} /><View style={[aStyles.c, aStyles.BR]} />
        <Animated.View style={[aStyles.line, { transform: [{ translateY: ty }] }]} />
      </View>
      <Text style={aStyles.label}>Analyzing with Gemini AI...</Text>
      <Text style={aStyles.sub}>{label}</Text>
    </Animated.View>
  );
};

// ── Result card ───────────────────────────────────────────────────────────────
const ResultCard = ({ data, imageUri, onSave, onReset }: {
  data: any; imageUri: string | null; onSave: () => void; onReset: () => void;
}) => {
  const slide = useRef(new Animated.Value(500)).current;
  const [fi, setFi] = useState(0);
  const col = getColors(data.tag);

  useEffect(() => {
    Animated.spring(slide, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.ScrollView style={{ transform: [{ translateY: slide }] }}
      showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={rStyles.card}>
        {/* Photo thumbnail */}
        {imageUri && (
          <Image source={{ uri: imageUri }} style={rStyles.thumb} resizeMode="cover" />
        )}

        {/* Tag */}
        <View style={[rStyles.tag, { backgroundColor: col.bg }]}>
          <Text style={[rStyles.tagTxt, { color: col.color }]}>{data.tag}</Text>
        </View>

        {/* Header */}
        <View style={rStyles.header}>
          <Text style={rStyles.emoji}>{data.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={rStyles.title}>{data.title}</Text>
            {data.summary && <Text style={rStyles.summary}>{data.summary}</Text>}
          </View>
        </View>

        {/* Fact */}
        <View style={[rStyles.factBox, { backgroundColor: col.bg }]}>
          <Text style={rStyles.factLbl}>💡 Fact {fi + 1} of {data.facts.length}</Text>
          <Text style={[rStyles.factTxt, { color: col.color }]}>{data.facts[fi]}</Text>
        </View>

        {/* Dots */}
        <View style={rStyles.dots}>
          {data.facts.map((_: any, i: number) => (
            <TouchableOpacity key={i} onPress={() => setFi(i)}>
              <View style={[rStyles.dot, i === fi && { backgroundColor: col.color, width: 20 }]} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[rStyles.nextBtn, { borderColor: col.color }]}
          onPress={() => setFi(p => (p + 1) % data.facts.length)}>
          <Text style={[rStyles.nextTxt, { color: col.color }]}>Next Fact →</Text>
        </TouchableOpacity>

        {/* Fun fact */}
        {data.funFact && (
          <View style={rStyles.funBox}>
            <Text style={rStyles.funLbl}>🤩 Fun Fact</Text>
            <Text style={rStyles.funTxt}>{data.funFact}</Text>
          </View>
        )}

        {/* Buttons */}
        <TouchableOpacity style={[rStyles.saveBtn, { backgroundColor: col.color }]} onPress={onSave}>
          <Text style={rStyles.saveTxt}>💾 Save to History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={rStyles.againBtn} onPress={onReset}>
          <Text style={rStyles.againTxt}>📸 Scan Another Object</Text>
        </TouchableOpacity>
      </View>
    </Animated.ScrollView>
  );
};

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ScanAndLearn() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [state, setState] = useState<'idle' | 'analyzing' | 'result' | 'error'>('idle');
  const [resultData, setResultData] = useState<any>(null);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [analysisLabel, setAnalysisLabel] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [textInput, setTextInput] = useState('');

  // ── Camera scan (primary) ──
  const handleCameraScan = async () => {
    try {
      const ImagePicker = require('expo-image-picker');
      const FileSystem  = require('expo-file-system');

      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission Needed', 'Camera permission is required to scan objects.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
      if (result.canceled) return;

      const asset = result.assets[0];
      setCapturedUri(asset.uri);
      setAnalysisLabel('Identifying what you scanned...');
      setState('analyzing');

      const base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const res = await scanApi.analyzeImage(base64);
      if (res.success && res.data) {
        setResultData(res.data);
        setState('result');
      } else {
        setErrorMsg(res.message || 'Could not identify the object. Try again.');
        setState('error');
      }
    } catch (e: any) {
      console.log('Camera error:', e.message);
      setErrorMsg('Camera not available in this build. Use the text search below instead.');
      setState('error');
    }
  };

  // ── Gallery scan ──
  const handleGalleryScan = async () => {
    try {
      const ImagePicker = require('expo-image-picker');
      const FileSystem  = require('expo-file-system');

      const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.6 });
      if (result.canceled) return;

      const asset = result.assets[0];
      setCapturedUri(asset.uri);
      setAnalysisLabel('Analyzing your photo...');
      setState('analyzing');

      const base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const res = await scanApi.analyzeImage(base64);
      if (res.success && res.data) {
        setResultData(res.data);
        setState('result');
      } else {
        setErrorMsg(res.message || 'Could not analyze the photo. Try again.');
        setState('error');
      }
    } catch (e: any) {
      setErrorMsg('Could not open gallery. Try the text search below.');
      setState('error');
    }
  };

  // ── Text learn fallback ──
  const handleTextLearn = async (topic: string) => {
    if (!topic.trim()) return;
    setAnalysisLabel(`"${topic.trim()}"`);
    setState('analyzing');
    setTextInput('');
    try {
      const res = await scanApi.learnAbout(topic.trim());
      if (res.success && res.data) {
        setResultData(res.data);
        setState('result');
      } else {
        setErrorMsg(res.message || 'Could not get information.');
        setState('error');
      }
    } catch (e: any) {
      setErrorMsg('Network error. Make sure your backend is running.');
      setState('error');
    }
  };

  const handleSave = async () => {
    if (!resultData) return;
    try {
      const raw = await AsyncStorage.getItem('scanHistory');
      const history = raw ? JSON.parse(raw) : [];
      await AsyncStorage.setItem('scanHistory', JSON.stringify([
        { id: Date.now(), ...resultData, date: new Date().toISOString() },
        ...history,
      ]));
      Alert.alert('✅ Saved!', `"${resultData.title}" added to Scan History.`);
    } catch (e) { console.log(e); }
  };

  const reset = () => {
    setState('idle'); setResultData(null);
    setCapturedUri(null); setErrorMsg(''); setAnalysisLabel('');
  };

  return (
    <KeyboardAvoidingView
      style={[s.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.title}>🔬 Scan & Learn</Text>
        <TouchableOpacity onPress={() => router.push('/scan-history' as any)}>
          <Text style={s.hist}>🕒</Text>
        </TouchableOpacity>
      </View>

      <View style={[s.body, { paddingBottom: insets.bottom + 20 }]}>

        {/* ═══ IDLE ═══ */}
        {state === 'idle' && (
          <ScrollView showsVerticalScrollIndicator={false}>

            {/* Camera scan buttons */}
            <View style={s.cameraCard}>
              <Text style={s.cameraCardTitle}>📸 Point & Scan</Text>
              <Text style={s.cameraCardSub}>
                Point your camera at any object — plant, book, food, gadget — and AI will teach you about it!
              </Text>

              <TouchableOpacity style={s.scanBtn} onPress={handleCameraScan} activeOpacity={0.85}>
                <Text style={s.scanBtnEmoji}>📷</Text>
                <Text style={s.scanBtnTxt}>Open Camera & Scan</Text>
              </TouchableOpacity>

              <TouchableOpacity style={s.galleryBtn} onPress={handleGalleryScan} activeOpacity={0.85}>
                <Text style={s.galleryBtnEmoji}>🖼️</Text>
                <Text style={s.galleryBtnTxt}>Pick Image from Gallery</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={s.divider}>
              <View style={s.dividerLine} />
              <Text style={s.dividerTxt}>or type a topic</Text>
              <View style={s.dividerLine} />
            </View>

            {/* Text search */}
            <View style={s.inputRow}>
              <TextInput
                style={s.input}
                placeholder="e.g. photosynthesis, black hole..."
                placeholderTextColor="#aaa"
                value={textInput}
                onChangeText={setTextInput}
                onSubmitEditing={() => handleTextLearn(textInput)}
                returnKeyType="search"
              />
              <TouchableOpacity
                style={[s.goBtn, !textInput.trim() && s.goBtnOff]}
                onPress={() => handleTextLearn(textInput)}
                disabled={!textInput.trim()}
              >
                <Text style={s.goTxt}>Go</Text>
              </TouchableOpacity>
            </View>

            {/* Quick chips */}
            <Text style={s.chipsTitle}>⚡ Quick Topics</Text>
            <View style={s.chips}>
              {CHIPS.map(ch => (
                <TouchableOpacity key={ch.topic} style={s.chip} onPress={() => handleTextLearn(ch.topic)}>
                  <Text style={s.chipEmoji}>{ch.emoji}</Text>
                  <Text style={s.chipLbl}>{ch.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {/* ═══ ANALYZING ═══ */}
        {state === 'analyzing' && (
          <View style={{ flex: 1 }}>
            {capturedUri && (
              <Image source={{ uri: capturedUri }} style={s.preview} resizeMode="cover" />
            )}
            <ScanAnimation label={analysisLabel} />
          </View>
        )}

        {/* ═══ RESULT ═══ */}
        {state === 'result' && resultData && (
          <ResultCard data={resultData} imageUri={capturedUri} onSave={handleSave} onReset={reset} />
        )}

        {/* ═══ ERROR ═══ */}
        {state === 'error' && (
          <View style={s.errWrap}>
            <Text style={s.errEmoji}>😕</Text>
            <Text style={s.errTitle}>Couldn't Analyze</Text>
            <Text style={s.errMsg}>{errorMsg}</Text>
            <TouchableOpacity style={s.retryBtn} onPress={reset}>
              <Text style={s.retryTxt}>🔄 Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fbfaee' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fffde7',
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  back:  { fontSize: 15, fontWeight: '600', color: '#735c00' },
  title: { fontSize: 18, fontWeight: '800', color: '#1b1c15' },
  hist:  { fontSize: 22 },
  body:  { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  // Camera card
  cameraCard: {
    backgroundColor: '#fff', borderRadius: 22, padding: 20, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  cameraCardTitle: { fontSize: 18, fontWeight: '800', color: '#1b1c15', marginBottom: 6 },
  cameraCardSub: { fontSize: 13, color: '#64748b', lineHeight: 20, marginBottom: 18 },
  scanBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#735c00', paddingVertical: 16, borderRadius: 18, marginBottom: 12,
    shadowColor: '#735c00', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4,
  },
  scanBtnEmoji: { fontSize: 20 },
  scanBtnTxt:   { fontSize: 16, fontWeight: '700', color: '#fff' },
  galleryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    borderWidth: 2, borderColor: '#735c00', paddingVertical: 13, borderRadius: 18,
  },
  galleryBtnEmoji: { fontSize: 18 },
  galleryBtnTxt:   { fontSize: 15, fontWeight: '700', color: '#735c00' },

  // Divider
  divider:     { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#ddd' },
  dividerTxt:  { fontSize: 13, color: '#aaa', marginHorizontal: 12 },

  // Text input
  inputRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  input: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 16,
    paddingVertical: 12, fontSize: 14, color: '#1b1c15',
    borderWidth: 1.5, borderColor: '#ddd',
  },
  goBtn:    { backgroundColor: '#735c00', borderRadius: 14, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  goBtnOff: { backgroundColor: '#ccc' },
  goTxt:    { color: '#fff', fontWeight: '800', fontSize: 15 },

  // Chips
  chipsTitle: { fontSize: 14, fontWeight: '700', color: '#50462a', marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 20, borderWidth: 1.5, borderColor: '#ddd',
  },
  chipEmoji: { fontSize: 16 },
  chipLbl:   { fontSize: 13, fontWeight: '600', color: '#50462a' },

  // Analyzing / preview
  preview: { width: SW * 0.5, height: SW * 0.5, borderRadius: 20, alignSelf: 'center', marginBottom: 10 },

  // Error
  errWrap:  { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errEmoji: { fontSize: 56, marginBottom: 16 },
  errTitle: { fontSize: 22, fontWeight: '800', color: '#1b1c15', marginBottom: 8 },
  errMsg:   { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 24, paddingHorizontal: 20 },
  retryBtn: { backgroundColor: '#735c00', paddingVertical: 14, paddingHorizontal: 36, borderRadius: 24 },
  retryTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },
});

// ── Animation styles ──────────────────────────────────────────────────────────
const aStyles = StyleSheet.create({
  wrap:  { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ring:  { width: 110, height: 110, borderRadius: 55, backgroundColor: '#ffe087', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  inner: { width: 78, height: 78, borderRadius: 39, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#ebc23e' },
  rEmoji:{ fontSize: 32 },
  box:   { width: SW * 0.55, height: 188, marginBottom: 20, position: 'relative' },
  c:     { position: 'absolute', width: 24, height: 24, borderColor: '#735c00' },
  TL:    { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 6 },
  TR:    { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 6 },
  BL:    { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 6 },
  BR:    { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 6 },
  line:  { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: '#f57f17', shadowColor: '#f57f17', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6 },
  label: { fontSize: 16, fontWeight: '700', color: '#1b1c15', marginBottom: 6 },
  sub:   { fontSize: 13, color: '#64748b' },
});

// ── Result card styles ────────────────────────────────────────────────────────
const rStyles = StyleSheet.create({
  card:    { backgroundColor: '#fff', borderRadius: 24, padding: 22, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 5 },
  thumb:   { width: '100%', height: 170, borderRadius: 16, marginBottom: 16 },
  tag:     { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12, marginBottom: 14 },
  tagTxt:  { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  header:  { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  emoji:   { fontSize: 38 },
  title:   { fontSize: 22, fontWeight: '800', color: '#1b1c15', flex: 1 },
  summary: { fontSize: 13, color: '#64748b', marginTop: 4, lineHeight: 18 },
  factBox: { borderRadius: 16, padding: 16, marginBottom: 14 },
  factLbl: { fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 8, letterSpacing: 0.5 },
  factTxt: { fontSize: 15, fontWeight: '600', lineHeight: 24 },
  dots:    { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 14 },
  dot:     { width: 8, height: 8, borderRadius: 4, backgroundColor: '#e0e0e0' },
  nextBtn: { borderWidth: 2, borderRadius: 14, paddingVertical: 12, alignItems: 'center', marginBottom: 14 },
  nextTxt: { fontSize: 14, fontWeight: '700' },
  funBox:  { backgroundColor: '#fffde7', borderRadius: 14, padding: 14, marginBottom: 14 },
  funLbl:  { fontSize: 13, fontWeight: '700', color: '#735c00', marginBottom: 6 },
  funTxt:  { fontSize: 14, color: '#50462a', lineHeight: 22 },
  saveBtn: { paddingVertical: 14, borderRadius: 16, alignItems: 'center', marginBottom: 10 },
  saveTxt: { fontSize: 15, fontWeight: '700', color: '#fff' },
  againBtn:{ paddingVertical: 14, borderRadius: 16, alignItems: 'center', backgroundColor: '#f5f4e8' },
  againTxt:{ fontSize: 15, fontWeight: '700', color: '#50462a' },
});
