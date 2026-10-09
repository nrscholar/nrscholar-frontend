import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#006a62',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        height: 'auto',
        minHeight: 70,
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: '92%',
        shadowColor: '#006a62',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: '800', color: '#141779', marginBottom: 4 }}
      text2Style={{ fontSize: 14, color: '#464652', fontWeight: '500' }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#ba1a1a',
        backgroundColor: '#fffbfa',
        borderRadius: 16,
        height: 'auto',
        minHeight: 70,
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: '92%',
        shadowColor: '#ba1a1a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: '800', color: '#ba1a1a', marginBottom: 4 }}
      text2Style={{ fontSize: 14, color: '#464652', fontWeight: '500' }}
    />
  ),
};

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          animationDuration: 240,
        }}
      >
        {/* Entry & Splash flow */}
        <Stack.Screen name="index" options={{ animation: 'fade' }} />

        {/* Auth Stack */}
        <Stack.Screen name="login" options={{ animation: 'fade' }} />
        <Stack.Screen name="signup-step1" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="signup-step2" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="signup-step3" options={{ animation: 'slide_from_right' }} />

        {/* Main Application Tabs */}
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />

        {/* Practice & Learning Engine */}
        <Stack.Screen name="practice/chapters" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="practice/learning-adventure" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="practice/journey-map" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="practice/session" options={{ animation: 'slide_from_right', gestureEnabled: false }} />
        <Stack.Screen name="practice/results" options={{ animation: 'fade' }} />
        <Stack.Screen name="practice/boss-battle" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="practice/collections" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="practice/inventory" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="practice/webview" options={{ animation: 'slide_from_right' }} />

        {/* Parent Portal Modules */}
        <Stack.Screen name="parent/index" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="parent/dashboard" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="parent/learning-dna" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="parent/kids-activity" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="parent/early-warning" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="parent/report" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="parent/settings" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="parent/subscription" options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
        <Stack.Screen name="parent/notifications" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="parent/assessment-history" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="parent/assessment-summary" options={{ animation: 'slide_from_right' }} />

        {/* Diagnostic Weekly Exam Flow */}
        <Stack.Screen name="weekly-test" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="weekly-test-questions" options={{ animation: 'slide_from_right', gestureEnabled: false }} />
        <Stack.Screen name="weekly-test-results" options={{ animation: 'fade' }} />

        {/* Camera AI Scanner */}
        <Stack.Screen name="scan-and-learn" options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
        <Stack.Screen name="scan-history" options={{ animation: 'slide_from_right' }} />

        {/* Feature Modules */}
        <Stack.Screen name="good-habits" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="daily-challenge" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="subscription" options={{ animation: 'slide_from_bottom', presentation: 'modal' }} />
        <Stack.Screen name="progress" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="recap" options={{ animation: 'slide_from_right' }} />

        {/* Generic Modals */}
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', headerShown: false, animation: 'slide_from_bottom' }}
        />
      </Stack>

      <StatusBar style="auto" />
      <Toast config={toastConfig} />
    </ThemeProvider>
  );
}