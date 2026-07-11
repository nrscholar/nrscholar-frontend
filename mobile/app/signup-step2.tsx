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
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Custom Dropdown Component
const CustomDropdown = ({ label, icon, iconColor, value, options, onSelect, placeholder }: any) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.inputGroupContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.selectWrapper}
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name={icon} size={22} color={iconColor} style={styles.inputIconLeft} />
        <Text style={[styles.selectText, !value && { color: "#c7c5d4" }]}>
          {value || placeholder}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#767683" style={styles.inputIconRight} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select {label}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((opt: string) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.modalOption}
                  onPress={() => {
                    onSelect(opt);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    value === opt && styles.modalOptionTextSelected
                  ]}>
                    {opt}
                  </Text>
                  {value === opt && (
                    <MaterialIcons name="check" size={20} color="#141779" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default function SignupStep2Screen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [childName, setChildName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [age, setAge] = useState("");

  const classes = ["Nursery", "KG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"];
  const ages = ["4 Years", "5 Years", "6 Years", "7 Years", "8 Years", "9 Years", "10 Years"];

  const handleNext = () => {
    router.push({
      pathname: "/signup-step3",
      params: {
        ...params,
        childName,
        age,
        selectedClass,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Cosmic Background Gradient */}
      <LinearGradient
        colors={["#e0e0ff", "#e8ddff"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      />

      {/* Floating Background Elements */}
      <View style={styles.floatingIconTop}>
        <MaterialIcons name="auto-awesome" size={120} color="#006a62" style={{ opacity: 0.15, transform: [{ rotate: '12deg' }] }} />
      </View>
      <View style={styles.floatingIconBottom}>
        <MaterialIcons name="rocket" size={80} color="#30007f" style={{ opacity: 0.15, transform: [{ rotate: '-12deg' }] }} />
      </View>

      {/* Header (TopAppBar) */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="rocket-launch" size={28} color="#141779" />
          <Text style={styles.headerTitle}>NR Scholar</Text>
        </View>
        {/* Close/Back button */}
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
          {/* Step Indicator (Consistent with Step 1) */}
          <View style={styles.stepIndicatorContainer}>
            <View style={styles.stepTextRow}>
              <Text style={styles.stepLabel}>STEP 2 OF 3</Text>
              <Text style={styles.stepPercent}>66%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '66%' }]} />
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.glassCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Who's Exploring?</Text>
              <Text style={styles.cardSubtitle}>Tell us about your child to personalize their learning journey.</Text>
            </View>

            <View style={styles.formSection}>
              {/* Child's Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Child's Explorer Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Leo Star"
                    placeholderTextColor="#c7c5d4"
                    value={childName}
                    onChangeText={setChildName}
                  />
                  <MaterialIcons name="face" size={22} color="#006a62" style={styles.inputIconLeft} />
                </View>
              </View>

              {/* Row for Class & Age */}
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <CustomDropdown
                    label="Class/Grade"
                    icon="school"
                    iconColor="#30007f"
                    value={selectedClass}
                    options={classes}
                    onSelect={setSelectedClass}
                    placeholder="Select"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <CustomDropdown
                    label="Age"
                    icon="cake"
                    iconColor="#141779"
                    value={age}
                    options={ages}
                    onSelect={setAge}
                    placeholder="Select"
                  />
                </View>
              </View>
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity 
              style={[styles.nextButton, (!childName || !selectedClass || !age) && { opacity: 0.7 }]}
              onPress={handleNext}
              disabled={!childName || !selectedClass || !age}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>Almost There</Text>
              <MaterialIcons name="rocket-launch" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Decorative Astronaut Image Badge */}
          <View style={styles.badgeContainer}>
            <Image 
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDO0uywXKeZFaBqTF0zxGYLlyFO5nR80YlXpDdDN-LCQQy02I46kxfNyZ_ABhaGtIpEj0rOByCUZ_exo_fZrWr1cMy6PDImMjt5Sb8TrJPYa8qz8QeYsSdo-0OwIMhnONQQfJUiM-qKOfYsDC6_TtusgxaiiYmoLaoCJzmQ1dIIKpgT_33IqngfJSAgfBPjexpOA7XmxxMUzeygwSz2xTNeeQmgK1GLBr1GKslEWUMfqNpVqmFJlUKqXLQgbyey9OnEtMGqDdBW-g" }}
              style={styles.badgeImage}
            />
            <Text style={styles.badgeText}>Your space journey is almost ready!</Text>
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
  floatingIconTop: {
    position: 'absolute',
    top: '25%',
    right: 16,
  },
  floatingIconBottom: {
    position: 'absolute',
    bottom: '25%',
    left: 16,
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
    borderColor: 'rgba(255, 255, 255, 1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    gap: 8,
  },
  inputGroupContainer: {
    gap: 8,
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#767683',
    marginLeft: 16,
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
    right: 12,
    zIndex: 1,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 9999,
    paddingLeft: 48,
    paddingRight: 24,
    fontSize: 16,
    fontWeight: '500',
    color: '#191c1e',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  selectWrapper: {
    width: '100%',
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 9999,
    paddingLeft: 48,
    paddingRight: 40,
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
  },
  selectText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#191c1e',
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
  badgeContainer: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(42, 221, 205, 0.15)',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  badgeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#005049',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#141779',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f4f6',
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#464652',
  },
  modalOptionTextSelected: {
    color: '#141779',
    fontWeight: '700',
  }
});