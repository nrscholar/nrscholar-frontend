import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#006a62', backgroundColor: '#ffffff', borderRadius: 16, height: 'auto', minHeight: 70, paddingVertical: 12, paddingHorizontal: 16, width: '92%', shadowColor: '#006a62', shadowOffset: {width:0, height:4}, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: '800', color: '#141779', marginBottom: 4 }}
      text2Style={{ fontSize: 14, color: '#464652', fontWeight: '500' }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#ba1a1a', backgroundColor: '#fffbfa', borderRadius: 16, height: 'auto', minHeight: 70, paddingVertical: 12, paddingHorizontal: 16, width: '92%', shadowColor: '#ba1a1a', shadowOffset: {width:0, height:4}, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: '800', color: '#ba1a1a', marginBottom: 4 }}
      text2Style={{ fontSize: 14, color: '#464652', fontWeight: '500' }}
    />
  )
};

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>

        {/* Entry point: redirects to /login */}
        <Stack.Screen name="index" />

        {/* Auth Screens */}
        <Stack.Screen name="login" />
        <Stack.Screen name="signup-step1" />
        <Stack.Screen name="signup-step2" />
        <Stack.Screen name="signup-step3" />

        {/* Main App (after login) */}
        <Stack.Screen name="(tabs)" />

        {/* Weekly Test Flow */}
        <Stack.Screen name="weekly-test" />
        <Stack.Screen name="weekly-test-questions" />
        <Stack.Screen name="weekly-test-results" />

        {/* Standalone Modules */}
        <Stack.Screen name="good-habits" />

        {/* Modal */}
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', headerShown: true, title: 'Modal' }}
        />

      </Stack>

      <StatusBar style="auto" />
      <Toast config={toastConfig} />
    </ThemeProvider>
  );
}